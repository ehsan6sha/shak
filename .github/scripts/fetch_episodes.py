#!/usr/bin/env python3
"""
Fetch episodes from Spotify RSS feed and update Jekyll site data.
This script downloads episode metadata and audio files from the RSS feed.
"""

import os
import json
import re
import requests
import feedparser
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from dateutil import parser as date_parser

# Configuration
RSS_FEED_URL = os.environ.get('RSS_FEED_URL', 'https://anchor.fm/s/10aa6fc9c/podcast/rss')
BASE_DIR = Path(__file__).parent.parent.parent
DATA_DIR = BASE_DIR / '_data' / 'episodes'
POSTS_DIR = BASE_DIR / '_posts'
ASSETS_DIR = BASE_DIR / 'assets' / 'episodes'

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
POSTS_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)


# Translate Persian/Arabic-Indic digits to Latin
PERSIAN_DIGITS = str.maketrans('۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩', '01234567890123456789')

# Persian ordinal words → numbers (for chapters and preface parts)
ORDINAL_WORDS = {
    'اول': 1, 'یکم': 1, 'دوم': 2, 'سوم': 3, 'چهارم': 4, 'پنجم': 5,
    'ششم': 6, 'هفتم': 7, 'هشتم': 8, 'نهم': 9, 'دهم': 10,
}

# Aphorism ranges per chapter of "Beyond Good and Evil" (mirrors _data/book.yml)
BGE_CHAPTERS = [
    (1, 1, 23), (2, 24, 44), (3, 45, 62), (4, 63, 185), (5, 186, 203),
    (6, 204, 213), (7, 214, 239), (8, 240, 256), (9, 257, 296),
]


def chapter_for_aphorism(n):
    """Map an aphorism number to its book chapter."""
    for ch, start, end in BGE_CHAPTERS:
        if start <= n <= end:
            return ch
    return None


def extract_book_metadata(title):
    """Best-effort extraction of book metadata (aphorism range, chapter,
    preface part) from a Persian episode title. Returns a dict of optional
    front matter fields; ambiguous titles yield fewer fields (the site
    templates degrade gracefully when fields are absent).

    Examples it understands:
      "اپیزود یازدهم: جملات قصار 20 تا 23 از فصل اول. ..."
      "اپیزود دوازدهم (بخش اول): قصارهای ۲۴ و ۲۵ - ..."
      "اپیزود دوم: پیش گفتار، بخش اول - ..."
    """
    t = title.translate(PERSIAN_DIGITS)
    meta = {}

    # Preface episodes ("پیش گفتار" / "پیش‌گفتار" with optional ZWNJ)
    if re.search(r'پیش[\s‌]*گفتار', t):
        meta['book_section'] = 'preface'
        m = re.search(r'بخش\s+([^\s،:.-]+)', t)
        if m:
            word = m.group(1)
            if word.isdigit():
                meta['part'] = int(word)
            elif word in ORDINAL_WORDS:
                meta['part'] = ORDINAL_WORDS[word]
        return meta

    # Aphorism range: "قصارهای 27 و 28" / "جملات قصار 20 تا 23" /
    # "قصار های 25 و 26" / "قصار 24، 25"
    m = re.search(r'قصار\S*\s*(?:های?\s+)?(\d+)\s*(?:(?:و|تا|الی|[-–،,])\s*(\d+))?', t)
    if m:
        meta['aphorism_start'] = int(m.group(1))
        meta['aphorism_end'] = int(m.group(2)) if m.group(2) else int(m.group(1))

    # Chapter: "از فصل اول" / "فصل 2"
    m = re.search(r'فصل\s+([^\s،:.-]+)', t)
    if m:
        word = m.group(1)
        if word.isdigit():
            ch = int(word)
            if 1 <= ch <= 9:
                meta['chapter'] = ch
        elif word in ORDINAL_WORDS and ORDINAL_WORDS[word] <= 9:
            meta['chapter'] = ORDINAL_WORDS[word]

    # Derive chapter from aphorism range when the title doesn't state it
    if 'chapter' not in meta and 'aphorism_start' in meta:
        ch = chapter_for_aphorism(meta['aphorism_start'])
        if ch:
            meta['chapter'] = ch

    return meta


# Persian ordinal words for episode numbers, longest first so that
# e.g. "بیست و یکم" wins over "یکم"
EPISODE_ORDINALS = {
    'بیست و چهارم': 24, 'بیست و پنجم': 25, 'بیست و ششم': 26, 'بیست و هفتم': 27,
    'بیست و هشتم': 28, 'بیست و نهم': 29, 'بیست و یکم': 21, 'بیست و دوم': 22,
    'بیست و سوم': 23, 'چهاردهم': 14, 'پانزدهم': 15, 'شانزدهم': 16,
    'هفدهم': 17, 'هجدهم': 18, 'نوزدهم': 19, 'یازدهم': 11, 'دوازدهم': 12,
    'سیزدهم': 13, 'بیستم': 20, 'سی‌ام': 30, 'سی ام': 30, 'چهارم': 4,
    'پنجم': 5, 'ششم': 6, 'هفتم': 7, 'هشتم': 8, 'نهم': 9, 'دهم': 10,
    'اول': 1, 'یکم': 1, 'دوم': 2, 'سوم': 3,
}

PART_WORDS = {'اول': 1, 'یکم': 1, 'دوم': 2, 'سوم': 3, 'چهارم': 4, 'پنجم': 5}


# Separators allowed between the episode designation and its "بخش" part
# marker (space, ZWNJ, kasra, dash, parentheses, comma)
SEP = r'[\s‌ِ\-–—(),،]'


def extract_episode_number(title):
    """Extract the episode number from a Persian title, always as a string
    (e.g. "13", or "13-1"/"13-2" for multi-part titles like
    "اپیزود سیزدهم (بخش اول)" or "اپیزود ۱۳، قسمت دوم").

    Returns None when no number can be determined CONFIDENTLY. There is
    deliberately no "first number in the title" fallback: guessing used to
    pick up aphorism numbers ("قصار 27") and created duplicate episodes
    (e.g. episode-27 duplicating episode 13-1). Unparseable entries are
    skipped with a warning instead.
    """
    t = title.translate(PERSIAN_DIGITS)

    # Base number: digits or ordinal word after اپیزود/قسمت. The (?!\w)
    # guard stops ordinals matching inside longer words (اول in اولین).
    num = None
    num_end = None
    designator = None
    m = re.search(r'(اپیزود|قسمت)\s*(\d+)', t)
    if m:
        designator = m.group(1)
        num = int(m.group(2))
        num_end = m.end()
    else:
        for word in sorted(EPISODE_ORDINALS, key=len, reverse=True):
            m = re.search(r'(اپیزود|قسمت)\s*' + re.escape(word) + r'(?!\w)', t)
            if m:
                designator = m.group(1)
                num = EPISODE_ORDINALS[word]
                num_end = m.end()
                break

    if num is None:
        return None

    # Part suffix ("بخش اول" → -1, "قسمت دوم" → -2) — only when the marker is
    # ADJACENT to the episode designation (nothing but separators in between),
    # e.g. "اپیزود دوازدهم-بخش اول: ...", "اپیزود سیزدهم (بخش اول): ..." or
    # "... | اپیزود ۱۳، قسمت دوم".
    # Preface episodes like "اپیزود دوم: پیش گفتار، بخش اول" keep their plain
    # number because other words sit between the designation and the marker.
    # قسمت counts as a part marker ONLY when the number came from اپیزود: when
    # قسمت itself supplied the number it means "episode", not "part", so a
    # second قسمت after it must not be swallowed as a suffix.
    part_marker = r'(?:بخش|قسمت)' if designator == 'اپیزود' else r'بخش'
    part = None
    m = re.match(SEP + r'*' + part_marker + SEP + r'*(\d+)', t[num_end:])
    if m:
        part = int(m.group(1))
    else:
        m = re.match(SEP + r'*' + part_marker + SEP + r'+([^\s()،:.«»\-–—]+)', t[num_end:])
        if m and m.group(1) in PART_WORDS:
            part = PART_WORDS[m.group(1)]

    if part is not None:
        return f"{num}-{part}"
    return str(num)


def convert_html_to_markdown(html_content):
    """Convert HTML description to markdown with clickable links."""
    if not html_content:
        return ""
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Convert links to markdown
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = a.get_text()
        a.replace_with(f'[{text}]({href})')
    
    # Convert paragraphs
    for p in soup.find_all('p'):
        p.insert_before('\n')
        p.insert_after('\n')
        p.unwrap()
    
    # Convert lists
    for ul in soup.find_all('ul'):
        for li in ul.find_all('li'):
            li.insert_before('\n- ')
            li.unwrap()
        ul.unwrap()
    
    # Convert bold
    for strong in soup.find_all(['strong', 'b']):
        text = strong.get_text()
        strong.replace_with(f'**{text}**')
    
    # Convert italic
    for em in soup.find_all(['em', 'i']):
        text = em.get_text()
        em.replace_with(f'*{text}*')
    
    # Get text and clean up
    text = soup.get_text()
    text = re.sub(r'\n{3,}', '\n\n', text)  # Remove excessive newlines
    text = text.strip()
    
    return text


def download_audio_file(url, episode_number):
    """Download audio file from URL."""
    try:
        print(f"Downloading audio for episode {episode_number}...")
        response = requests.get(url, stream=True, timeout=300)
        response.raise_for_status()
        
        # Determine file extension from content-type or URL
        content_type = response.headers.get('content-type', '')
        if 'mp3' in content_type or url.endswith('.mp3'):
            ext = 'mp3'
        elif 'm4a' in content_type or url.endswith('.m4a'):
            ext = 'mp3'  # We'll save as mp3 for consistency
        else:
            ext = 'mp3'  # Default to mp3
        
        filename = f"{episode_number}.{ext}"
        filepath = ASSETS_DIR / filename
        
        # Download in chunks
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"✓ Audio downloaded: {filename}")
        return filename
    except Exception as e:
        print(f"✗ Failed to download audio for episode {episode_number}: {e}")
        return None


def episode_exists(episode_number):
    """Check if episode already exists."""
    json_file = DATA_DIR / f"{episode_number}.json"
    return json_file.exists()


def format_persian_date(date_obj):
    """Format date in Persian."""
    months = {
        1: 'ژانویه', 2: 'فوریه', 3: 'مارس', 4: 'آوریل', 5: 'می', 6: 'ژوئن',
        7: 'ژوئیه', 8: 'اوت', 9: 'سپتامبر', 10: 'اکتبر', 11: 'نوامبر', 12: 'دسامبر'
    }
    
    # Convert to Persian/Arabic numerals
    persian_nums = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')
    day = str(date_obj.day).translate(persian_nums)
    year = str(date_obj.year).translate(persian_nums)
    month = months[date_obj.month]
    
    return f"{day} {month} {year}"


def create_episode_files(entry, episode_number):
    """Create JSON data file and markdown post for an episode."""
    
    # Parse publication date
    pub_date = date_parser.parse(entry.published)
    
    # Extract duration
    duration = entry.get('itunes_duration', '00:00')
    
    # Get audio URL
    audio_url = None
    for link in entry.get('links', []):
        if link.get('type', '').startswith('audio/'):
            audio_url = link.get('href')
            break
    
    if not audio_url and hasattr(entry, 'enclosures') and entry.enclosures:
        audio_url = entry.enclosures[0].get('href')
    
    # Download audio file
    audio_filename = None
    if audio_url:
        audio_filename = download_audio_file(audio_url, episode_number)
    
    if not audio_filename:
        print(f"⚠ Warning: No audio file for episode {episode_number}")
        audio_filename = f"{episode_number}.mp3"  # Placeholder
    
    # Convert description to markdown
    description = entry.get('summary', '')
    description_md = convert_html_to_markdown(description)
    
    # Create episode data JSON
    episode_data = {
        "episode_number": episode_number,
        "title": entry.title,
        "description": description_md,
        "duration": duration,
        "publish_date": format_persian_date(pub_date),
        "audio_file": audio_filename,
        "video_teaser": f"/assets/videos/episode-{episode_number}-teaser.mp4",
        "related_audios": []
    }
    
    # Save JSON file
    json_file = DATA_DIR / f"{episode_number}.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(episode_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Created data file: {json_file.name}")
    
    # Create markdown post file
    post_date = pub_date.strftime('%Y-%m-%d')
    post_filename = f"{post_date}-episode-{episode_number}.md"
    post_file = POSTS_DIR / post_filename
    
    # Only create post if it doesn't exist (to preserve manual content)
    if not post_file.exists():
        # Optional book metadata parsed from the title (chapter, aphorism
        # range, preface part) — consumed by the site's TOC, aphorism
        # explorer and archive tabs. Missing fields degrade gracefully.
        book_meta = extract_book_metadata(entry.title)
        book_meta_yaml = ''.join(f"{key}: {value}\n" for key, value in book_meta.items())

        post_content = f"""---
layout: post
episode_number: {episode_number}
{book_meta_yaml}---

{description_md[:500]}...

---

اگر این اپیزود برایتان جالب بود، آن را با دوستانی که فکر می‌کنید «آماده دیدن دَم شیر هستند» به اشتراک بگذارید.

تا اپیزود بعدی: **شک کنید، بپرسید، و جرأت داشته باشید.**
"""
        
        with open(post_file, 'w', encoding='utf-8') as f:
            f.write(post_content)
        
        print(f"✓ Created post file: {post_filename}")
    else:
        print(f"○ Post file already exists: {post_filename}")


def main():
    """Main function to fetch and process episodes."""
    print("=" * 60)
    print("Fetching episodes from Spotify RSS feed...")
    print("=" * 60)
    
    # Fetch RSS feed
    try:
        feed = feedparser.parse(RSS_FEED_URL)
    except Exception as e:
        print(f"✗ Failed to fetch RSS feed: {e}")
        return
    
    if not feed.entries:
        print("✗ No episodes found in RSS feed")
        return
    
    print(f"Found {len(feed.entries)} episodes in RSS feed\n")
    
    # Process episodes (newest first)
    new_episodes = 0
    for entry in feed.entries:
        episode_number = extract_episode_number(entry.title)
        
        if episode_number is None:
            print(f"⚠ Could not extract episode number from: {entry.title}")
            continue
        
        print(f"\nProcessing Episode {episode_number}: {entry.title}")
        
        # Check if episode already exists
        if episode_exists(episode_number):
            print(f"○ Episode {episode_number} already exists, skipping...")
            continue
        
        # Create episode files
        try:
            create_episode_files(entry, episode_number)
            new_episodes += 1
        except Exception as e:
            print(f"✗ Failed to create files for episode {episode_number}: {e}")
    
    print("\n" + "=" * 60)
    print(f"Processing complete! {new_episodes} new episode(s) added.")
    print("=" * 60)


if __name__ == '__main__':
    main()
