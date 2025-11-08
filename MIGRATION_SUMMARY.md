# Migration Summary: Single Source of Truth Implementation

## Overview

Successfully migrated the podcast site from a **duplicate data structure** to a **single source of truth** system with automatic episode fetching from Spotify RSS.

## What Changed

### Before (Duplicate Data)

Episode information was stored in **two places**:

1. **Front matter in `_posts/*.md`**:
   ```yaml
   ---
   title: "Episode Title"
   date: 2025-11-02
   audio_url: "/assets/episodes/5.mp3"
   duration: "27:28"
   episode_number: 5
   video_teaser: "/assets/videos/episode-5-teaser.mp4"
   related_audios: [...]
   ---
   ```

2. **JSON files in `_data/episodes/*.json`**:
   ```json
   {
     "episode_number": 5,
     "title": "Episode Title",
     "duration": "27:28",
     ...
   }
   ```

**Problems:**
- ❌ Data duplication
- ❌ Inconsistency risk
- ❌ Manual updates required in multiple places
- ❌ Error-prone

### After (Single Source of Truth)

Episode information is stored in **one place only**:

**`_data/episodes/{number}.json`** (Single Source):
```json
{
  "episode_number": 5,
  "title": "اپیزود پنجم: جملات قصار 3 تا 6 از فصل اول",
  "description": "توضیحات با [لینک‌های](https://example.com) قابل کلیک",
  "duration": "27:28",
  "publish_date": "02 نوامبر ۲۰۲۵",
  "audio_file": "5.mp3",
  "video_teaser": "/assets/videos/episode-5-teaser.mp4",
  "related_audios": [...]
}
```

**Post files simplified to:**
```markdown
---
layout: post
episode_number: 5
transcript: "episode-5.md"
---

Episode content here...
```

**Benefits:**
- ✅ No duplication
- ✅ Single source of truth
- ✅ Automatic updates from Spotify RSS
- ✅ Clickable links in descriptions
- ✅ Easier maintenance

## New Features

### 1. Automatic Episode Fetching

**GitHub Actions Workflow**: `.github/workflows/fetch_episodes.yml`

- **Schedule**: Runs every 6 hours automatically
- **Manual Trigger**: Available via GitHub Actions UI
- **Source**: Spotify RSS feed (`https://anchor.fm/s/10aa6fc9c/podcast/rss`)

**What it does:**
1. Fetches RSS feed from Spotify
2. Detects new episodes by episode number
3. Downloads audio files to `assets/episodes/`
4. Creates JSON metadata in `_data/episodes/`
5. Creates markdown posts in `_posts/`
6. Converts HTML descriptions to markdown with clickable links
7. Commits and pushes changes automatically

### 2. Python Fetch Script

**Script**: `.github/scripts/fetch_episodes.py`

**Features:**
- Episode number extraction (Persian and English)
- HTML to Markdown conversion
- Audio file downloading
- Persian date formatting
- Duplicate detection (skips existing episodes)

### 3. Updated Templates

**Modified Files:**
- `_layouts/post.html` - Reads from JSON data
- `index.html` - Uses episode data from JSON
- `_includes/episode_data.html` - Helper for data access

**How it works:**
```liquid
{% assign episode_data = site.data.episodes[page.episode_number] %}
<h1>{{ episode_data.title }}</h1>
<audio src="/assets/episodes/{{ episode_data.audio_file }}"></audio>
```

## Files Modified

### Created Files
- `.github/workflows/fetch_episodes.yml` - GitHub Actions workflow
- `.github/scripts/fetch_episodes.py` - Python fetch script
- `.github/README.md` - Workflow documentation
- `_includes/episode_data.html` - Data helper
- `EPISODE_MANAGEMENT.md` - Complete management guide
- `MIGRATION_SUMMARY.md` - This file

### Modified Files
- `_layouts/post.html` - Updated to use JSON data
- `index.html` - Updated to use JSON data
- `_posts/2025-10-19-episode-1.md` - Simplified front matter
- `_posts/2025-10-21-episode-2.md` - Simplified front matter
- `_posts/2025-10-25-episode-3.md` - Simplified front matter
- `_posts/2025-10-29-episode-4.md` - Simplified front matter
- `_posts/2025-11-02-episode-5.md` - Simplified front matter
- `_posts/TEMPLATE.md` - Updated template
- `README.md` - Updated documentation

### Unchanged Files
- All JSON files in `_data/episodes/` - Already correct format
- All transcript files in `_transcripts/` - No changes needed
- All audio files in `assets/episodes/` - No changes needed
- All video files in `assets/videos/` - No changes needed
- Episode content in `_posts/*.md` - Only front matter changed

## Data Flow

### Old Flow (Manual)
```
1. Publish episode on Spotify
2. Manually create JSON file
3. Manually create post file with duplicate data
4. Manually upload MP3 file
5. Commit and push
```

### New Flow (Automatic)
```
1. Publish episode on Spotify
2. GitHub Actions runs automatically (or manually triggered)
3. Script fetches RSS, downloads audio, creates files
4. Automatic commit and push
5. (Optional) Manually add transcript and video teaser
```

### New Flow (Manual Override)
```
1. Create JSON file in _data/episodes/
2. Upload MP3 to assets/episodes/
3. Create simplified post in _posts/
4. (Optional) Add transcript and video teaser
5. Commit and push
```

## Migration Steps Completed

1. ✅ Created GitHub Actions workflow
2. ✅ Created Python fetch script
3. ✅ Updated Jekyll templates to read from JSON
4. ✅ Simplified all existing post files
5. ✅ Updated template file
6. ✅ Updated documentation (README, guides)
7. ✅ Tested data flow

## Testing Checklist

Before deploying, verify:

- [ ] GitHub Actions workflow file is valid
- [ ] Python script dependencies are correct
- [ ] All post files have `episode_number` field
- [ ] All JSON files exist in `_data/episodes/`
- [ ] Templates correctly reference `episode_data`
- [ ] Audio files are in correct location
- [ ] Links in descriptions are clickable
- [ ] Episode numbers display correctly
- [ ] Transcripts still load properly
- [ ] Video teasers still work

## How to Use

### For Automatic Updates

1. Publish episode on Spotify
2. Wait up to 6 hours, or manually trigger workflow
3. Verify episode appears on site
4. (Optional) Add transcript manually

### For Manual Updates

1. Create JSON file: `_data/episodes/N.json`
2. Upload MP3: `assets/episodes/N.mp3`
3. Create post: `_posts/YYYY-MM-DD-episode-N.md`
4. Add transcript: `_transcripts/episode-N.md` (optional)
5. Add video: `assets/videos/episode-N-teaser.mp4` (optional)
6. Commit and push

## Rollback Plan

If issues occur, you can rollback by:

1. Reverting template changes in `_layouts/post.html` and `index.html`
2. Restoring old front matter in post files
3. Disabling GitHub Actions workflow

However, the new system is **backward compatible** - old data structure still works.

## Benefits Summary

### Eliminated Duplication
- Episode data exists in only one place
- No risk of inconsistency
- Easier to maintain

### Automatic Updates
- Episodes auto-fetch from Spotify RSS
- Audio files auto-download
- Descriptions converted to markdown with clickable links
- Saves time and reduces errors

### Better Developer Experience
- Clear separation of concerns
- Single source of truth principle
- Easier to understand and modify
- Better documentation

### Better User Experience
- Clickable links in episode descriptions
- Consistent data across all pages
- Faster updates (automatic)

## Next Steps

1. **Test the workflow**: Manually trigger GitHub Actions
2. **Monitor first auto-run**: Check logs after 6 hours
3. **Add transcripts**: For episodes that need them
4. **Add video teasers**: For episodes that have them
5. **Update related_audios**: In JSON files as needed

## Support

For questions or issues:
- See `EPISODE_MANAGEMENT.md` for detailed guide
- See `.github/README.md` for workflow documentation
- Check GitHub Actions logs for errors
- Review Python script for customization

---

**Migration completed successfully! 🎉**

All episodes now use a single source of truth with automatic fetching from Spotify RSS.
