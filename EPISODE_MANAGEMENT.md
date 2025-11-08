# Episode Management Guide

## Overview

This podcast site uses a **single source of truth** for episode data to eliminate duplication and simplify management. Episode metadata is stored in JSON files under `_data/episodes/`, and episodes can be added either manually or automatically via GitHub Actions.

## Data Structure

### Single Source of Truth: `_data/episodes/{episode_number}.json`

All episode metadata is stored in JSON files:

```json
{
  "episode_number": 5,
  "title": "اپیزود پنجم: جملات قصار 3 تا 6 از فصل اول- فیلسوفِ پنهانِ بدن!",
  "description": "تو اپیزود جدید «شَک»، می‌ریم سراغ کالبدشکافی روانی بزرگترین متفکرها...",
  "duration": "27:28",
  "publish_date": "02 نوامبر ۲۰۲۵",
  "audio_file": "5.mp3",
  "video_teaser": "/assets/videos/episode-5-teaser.mp4",
  "related_audios": [
    {
      "name": "آهنگ باده شبگیر",
      "author": "تریوله بند",
      "link": "https://example.com/link",
      "description": "توضیحات"
    }
  ]
}
```

### Post Files: `_posts/{date}-episode-{number}.md`

Post files now only contain:
- Layout specification
- Episode number (to link to JSON data)
- Transcript filename (optional)
- Episode content (markdown)

```markdown
---
layout: post
episode_number: 5
transcript: "episode-5.md"
---

## Episode Content

Your markdown content here...
```

## Adding Episodes

### Method 1: Automatic (Recommended)

Episodes are automatically fetched from your Spotify RSS feed via GitHub Actions.

#### How it works:

1. **Scheduled**: Runs every 6 hours automatically
2. **Manual**: Can be triggered manually from GitHub Actions tab
3. **Process**:
   - Fetches RSS feed from `https://anchor.fm/s/10aa6fc9c/podcast/rss`
   - Checks for new episodes
   - Downloads episode metadata and audio files
   - Creates JSON data files in `_data/episodes/`
   - Creates markdown post files in `_posts/`
   - Commits changes to repository

#### To manually trigger:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Fetch Episodes from Spotify RSS"
4. Click "Run workflow"

#### What gets downloaded:

- ✅ Episode title
- ✅ Episode description (converted to markdown with clickable links)
- ✅ Duration
- ✅ Publication date
- ✅ Audio file (downloaded to `assets/episodes/`)
- ❌ Transcript (must be added manually)
- ❌ Video teaser (must be added manually)
- ❌ Related audios (must be added manually)

### Method 2: Manual

If you prefer to add episodes manually or need to add transcripts and other custom content:

#### Step 1: Create JSON data file

Create `_data/episodes/{episode_number}.json`:

```json
{
  "episode_number": 6,
  "title": "اپیزود ششم: عنوان",
  "description": "توضیحات اپیزود با [لینک‌های](https://example.com) قابل کلیک",
  "duration": "30:00",
  "publish_date": "15 نوامبر ۲۰۲۵",
  "audio_file": "6.mp3",
  "video_teaser": "/assets/videos/episode-6-teaser.mp4",
  "related_audios": []
}
```

#### Step 2: Add audio file

Place your audio file in `assets/episodes/6.mp3`

#### Step 3: Create post file

Create `_posts/2025-11-15-episode-6.md`:

```markdown
---
layout: post
episode_number: 6
transcript: "episode-6.md"
---

## محتوای اپیزود

متن و محتوای اپیزود شما...
```

#### Step 4: (Optional) Add transcript

Create `_transcripts/episode-6.md` with the full transcript.

#### Step 5: (Optional) Add video teaser

Place video file in `assets/videos/episode-6-teaser.mp4`

## File Locations

```
shak/
├── _data/
│   └── episodes/
│       ├── 1.json          # Episode metadata
│       ├── 2.json
│       └── ...
├── _posts/
│   ├── 2025-10-19-episode-1.md    # Episode content
│   ├── 2025-10-21-episode-2.md
│   └── ...
├── _transcripts/
│   ├── episode-1.md        # Full transcripts (optional)
│   ├── episode-2.md
│   └── ...
├── assets/
│   ├── episodes/
│   │   ├── 1.mp3          # Audio files
│   │   ├── 2.mp3
│   │   └── ...
│   └── videos/
│       ├── episode-1-teaser.mp4   # Video teasers (optional)
│       └── ...
└── .github/
    ├── workflows/
    │   └── fetch_episodes.yml     # GitHub Actions workflow
    └── scripts/
        └── fetch_episodes.py      # Python script for fetching
```

## Editing Episodes

### To update episode metadata:

Edit the JSON file in `_data/episodes/{episode_number}.json`

### To update episode content:

Edit the markdown file in `_posts/{date}-episode-{number}.md`

### To add/update related audios:

Edit the `related_audios` array in the JSON file:

```json
{
  "related_audios": [
    {
      "name": "نام صوت",
      "author": "نام هنرمند",
      "link": "https://example.com/link",
      "description": "توضیحات"
    }
  ]
}
```

## How Templates Use Data

The Jekyll templates automatically load episode data from JSON files:

```liquid
{% assign episode_data = site.data.episodes[page.episode_number] %}

<h1>{{ episode_data.title }}</h1>
<p>{{ episode_data.publish_date }}</p>
<audio src="/assets/episodes/{{ episode_data.audio_file }}"></audio>
```

## Benefits of This System

1. **No Duplication**: Episode data exists in only one place
2. **Automatic Updates**: New episodes can be fetched automatically from Spotify
3. **Easy Maintenance**: Update episode info in one JSON file
4. **Clickable Links**: Descriptions from RSS are converted to markdown with working links
5. **Consistent Data**: All pages show the same information
6. **Manual Override**: You can still add episodes manually when needed

## Troubleshooting

### Episode not showing up?

1. Check that JSON file exists in `_data/episodes/{number}.json`
2. Check that post file exists in `_posts/` with correct `episode_number`
3. Verify JSON syntax is valid
4. Check that audio file exists in `assets/episodes/`

### Links not clickable in description?

The automatic fetch converts HTML links to markdown. If adding manually, use markdown link syntax:
```markdown
"description": "Check out [this link](https://example.com) for more info"
```

### GitHub Actions not running?

1. Check Actions tab in GitHub repository
2. Verify workflow file exists: `.github/workflows/fetch_episodes.yml`
3. Check workflow permissions in repository settings
4. Review action logs for errors

## RSS Feed Information

Your Spotify RSS feed: `https://anchor.fm/s/10aa6fc9c/podcast/rss`

The feed provides:
- Episode title
- Episode description (HTML format, converted to markdown)
- Publication date
- Duration
- Audio file URL (downloaded automatically)
- Episode artwork

## Migration Notes

All existing episodes have been migrated to use this new system:
- Front matter simplified to only `episode_number` and `transcript`
- All metadata moved to JSON files
- Templates updated to read from JSON files
- No changes to episode content or transcripts
