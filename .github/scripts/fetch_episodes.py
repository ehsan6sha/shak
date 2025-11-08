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


def extract_episode_number(title):
    """Extract episode number from title."""
    # Try Persian numbers first
    persian_numbers = {
        'اول': 1, 'دوم': 2, 'سوم': 3, 'چهارم': 4, 'پنجم': 5,
        'ششم': 6, 'هفتم': 7, 'هشتم': 8, 'نهم': 9, 'دهم': 10
    }
    
    for word, num in persian_numbers.items():
        if f'اپیزود {word}' in title:
            return num
    
    # Try digit extraction
    match = re.search(r'اپیزود\s*(\d+)', title)
    if match:
        return int(match.group(1))
    
    # Fallback: try to find any number in title
    match = re.search(r'(\d+)', title)
    if match:
        return int(match.group(1))
    
    return None


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
        post_content = f"""---
layout: post
episode_number: {episode_number}
---

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
