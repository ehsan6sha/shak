# GitHub Actions Workflows

## Fetch Episodes from Spotify RSS

This workflow automatically fetches new episodes from your Spotify RSS feed and updates the site.

### Configuration

- **RSS Feed URL**: `https://anchor.fm/s/10aa6fc9c/podcast/rss`
- **Schedule**: Every 6 hours
- **Manual Trigger**: Available via GitHub Actions UI

### What It Does

1. Fetches RSS feed from Spotify/Anchor
2. Parses episode information
3. Checks for new episodes (by episode number)
4. For each new episode:
   - Downloads audio file to `assets/episodes/`
   - Creates JSON metadata file in `_data/episodes/`
   - Creates markdown post file in `_posts/`
   - Converts HTML descriptions to markdown with clickable links
5. Commits and pushes changes to repository

### Manual Trigger

To manually run the workflow:

1. Go to repository → Actions tab
2. Select "Fetch Episodes from Spotify RSS"
3. Click "Run workflow" button
4. Select branch (usually `main`)
5. Click "Run workflow"

### Episode Detection

The script extracts episode numbers from titles using:
- Persian number words (اول، دوم، سوم، etc.)
- Digit patterns in Persian text
- Fallback to any numbers found in title

### Files Created

For episode number `X`:

```
_data/episodes/X.json           # Episode metadata
_posts/YYYY-MM-DD-episode-X.md  # Episode post (if doesn't exist)
assets/episodes/X.mp3           # Audio file
```

### Skipping Existing Episodes

The workflow automatically skips episodes that already exist (based on JSON file presence). This prevents:
- Overwriting manual edits
- Re-downloading audio files
- Duplicate posts

### Customization

To modify the workflow behavior, edit:
- `.github/workflows/fetch_episodes.yml` - Workflow configuration
- `.github/scripts/fetch_episodes.py` - Python script logic

### Dependencies

The workflow uses:
- Python 3.11
- `requests` - HTTP requests
- `feedparser` - RSS parsing
- `beautifulsoup4` - HTML parsing
- `python-dateutil` - Date parsing

### Troubleshooting

#### Workflow fails to run

Check:
- Repository Actions permissions (Settings → Actions → General)
- Workflow file syntax
- Python script syntax

#### Episodes not detected

The script looks for patterns like:
- `اپیزود اول`
- `اپیزود دوم`
- `اپیزود 5`
- `Episode 5`

If your titles don't match, modify the `extract_episode_number()` function.

#### Audio download fails

Possible causes:
- Network timeout (increase timeout in script)
- Invalid audio URL
- File size too large for GitHub

#### Commits not pushed

Check:
- GitHub token permissions
- Branch protection rules
- Git configuration in workflow

### Logs

View workflow logs:
1. Go to Actions tab
2. Click on workflow run
3. Click on job name
4. Expand step to see detailed logs

### Environment Variables

- `RSS_FEED_URL`: Spotify RSS feed URL (default: anchor.fm feed)
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Security

- Uses GitHub's built-in `GITHUB_TOKEN`
- No secrets required
- Read-only access to RSS feed
- Write access only to repository files

### Rate Limiting

- RSS feed: No known limits
- GitHub API: Standard rate limits apply
- Audio downloads: One per episode, cached locally

### Future Enhancements

Possible improvements:
- Automatic video teaser download
- Transcript generation via speech-to-text
- Social media post generation
- Email notifications for new episodes
- Analytics integration
