# Quick Episode Guide

## 🚀 Add Episode (Automatic)

1. Publish on Spotify
2. Go to GitHub → Actions → "Fetch Episodes from Spotify RSS"
3. Click "Run workflow"
4. Done! ✅

## ✍️ Add Episode (Manual)

### Step 1: Create JSON
`_data/episodes/6.json`
```json
{
  "episode_number": 6,
  "title": "عنوان اپیزود",
  "description": "توضیحات",
  "duration": "30:00",
  "publish_date": "15 نوامبر ۲۰۲۵",
  "audio_file": "6.mp3",
  "video_teaser": "/assets/videos/episode-6-teaser.mp4",
  "related_audios": []
}
```

### Step 2: Upload Audio
`assets/episodes/6.mp3`

### Step 3: Create Post
`_posts/2025-11-15-episode-6.md`
```markdown
---
layout: post
episode_number: 6
transcript: "episode-6.md"
---

محتوای اپیزود...
```

### Step 4: Commit & Push
```bash
git add .
git commit -m "Add episode 6"
git push
```

## 📝 Add Transcript (Optional)

`_transcripts/episode-6.md`
```markdown
متن کامل اپیزود...
```

## 🎬 Add Video Teaser (Optional)

Upload to: `assets/videos/episode-6-teaser.mp4`

Already referenced in JSON file!

## 🔗 Add Related Audios

Edit JSON file:
```json
{
  "related_audios": [
    {
      "name": "نام صوت",
      "author": "هنرمند",
      "link": "https://example.com",
      "description": "توضیحات"
    }
  ]
}
```

## 📊 Data Structure

```
Single Source of Truth: _data/episodes/N.json
├── Episode metadata (title, duration, etc.)
├── Audio file reference
├── Video teaser reference
└── Related audios

Post File: _posts/YYYY-MM-DD-episode-N.md
├── Episode number (links to JSON)
├── Transcript reference
└── Episode content (markdown)

Transcript: _transcripts/episode-N.md
└── Full episode text
```

## 🔍 Find Episode Data

All episode info is in: `_data/episodes/{number}.json`

Templates automatically load it:
```liquid
{% assign ep = site.data.episodes[page.episode_number] %}
{{ ep.title }}
{{ ep.duration }}
```

## ⚡ Quick Commands

### Run workflow manually
GitHub → Actions → "Fetch Episodes from Spotify RSS" → Run workflow

### Check if episode exists
Look for: `_data/episodes/N.json`

### Update episode info
Edit: `_data/episodes/N.json`

### Update episode content
Edit: `_posts/YYYY-MM-DD-episode-N.md`

## 📖 Full Documentation

- **Complete Guide**: `EPISODE_MANAGEMENT.md`
- **Migration Info**: `MIGRATION_SUMMARY.md`
- **Workflow Details**: `.github/README.md`
- **Main README**: `README.md`

## ✅ Checklist for New Episode

- [ ] JSON file created in `_data/episodes/`
- [ ] Audio file in `assets/episodes/`
- [ ] Post file in `_posts/`
- [ ] Transcript added (optional)
- [ ] Video teaser added (optional)
- [ ] Related audios added (optional)
- [ ] Committed and pushed
- [ ] Verified on site

## 🆘 Troubleshooting

**Episode not showing?**
- Check JSON file exists
- Check episode_number in post matches JSON filename
- Check audio file exists

**Links not clickable?**
- Use markdown format: `[text](url)`
- Auto-fetch converts HTML to markdown

**Workflow not running?**
- Check Actions permissions in repo settings
- Check workflow file syntax
- Review action logs

---

**Need help?** See `EPISODE_MANAGEMENT.md` for detailed instructions.
