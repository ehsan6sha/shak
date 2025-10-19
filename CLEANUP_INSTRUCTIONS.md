# 🧹 دستورالعمل پاکسازی فایل‌های اضافی

## ❌ فایل‌ها و پوشه‌های قابل حذف

### 1. پوشه `_includes/` (Transcripts)

**مشکل:** Transcripts به اشتباه در دو پوشه ذخیره شدند:
- `_transcripts/` ✅ صحیح
- `_includes/` ❌ اضافی و تکراری

**راه‌حل:**
```bash
# حذف فایل‌های transcript از _includes
rm _includes/episode-1.md
rm _includes/README.md  # اگر فقط برای transcript بود
```

**نکته:** اگر فایل‌های دیگری در `_includes/` دارید، فقط `episode-*.md` را حذف کنید.

---

### 2. پوشه `_data/episodes/`

**مشکل:** اطلاعات اپیزودها در دو جا تکراری است:
- `_posts/*.md` front matter ✅ صحیح
- `_data/episodes/*.json` ❌ اضافی و تکراری

**مثال تکرار:**

**در `_posts/2025-10-19-episode-1.md`:**
```yaml
---
title: "اپیزود اول: دیدنِ دَم شیر"
duration: "28:48"
audio_url: "/assets/episodes/1.mp3"
related_audios:
  - name: "پادکست دیپ‌پادکست"
    author: "آرمان"
---
```

**در `_data/episodes/1.json`:**
```json
{
  "title": "اپیزود اول: دیدنِ دَم شیر",
  "duration": "28:48",
  "audio_file": "1.mp3",
  "related_audios": [...]
}
```

**راه‌حل:**
```bash
# حذف کل پوشه _data/episodes
rm -rf _data/episodes/
# یا حذف پوشه _data اگر فقط episodes داشت
rm -rf _data/
```

---

## ✅ ساختار صحیح نهایی

بعد از پاکسازی، ساختار شما باید این باشد:

```
shak/
├── _posts/                    ← تمام اطلاعات اپیزود اینجاست
│   ├── 2025-10-19-episode-1.md
│   └── TEMPLATE.md
│
├── _transcripts/              ← فقط اینجا transcript ذخیره می‌شود
│   ├── episode-1.md
│   └── README.md
│
├── assets/
│   ├── episodes/              ← فایل‌های MP3
│   └── videos/                ← فایل‌های ویدیو تیزر
│
└── _config.yml                ← تنظیمات Jekyll (transcripts collection)
```

---

## 📝 فایل‌های Front Matter ساده‌شده

### قبل (با تکرار):

```yaml
---
layout: post
title: "اپیزود اول: دیدنِ دَم شیر"
date: 2025-10-19
audio_url: "/assets/episodes/1.mp3"
duration: "28:48"
episode_number: 1
transcript: "episode-1.md"
video_teaser: "/assets/videos/episode-1-teaser.mp4"
related_audios:
  - name: "پادکست دیپ‌پادکست"
    author: "آرمان"
    link: "https://..."
    description: "..."
  - name: "پادکست ایستگاه فلسفه"
    author: ""
    link: "https://..."
    description: "..."
---
```

### بعد (بدون تکرار - همین کافیست):

همین قالب کافی است! تکراری در `_data/` نیست.

---

## 🔧 به‌روزرسانی‌های انجام شده

### 1. تنظیمات Jekyll (`_config.yml`)

```yaml
collections:
  transcripts:
    output: false  # برای استفاده داخلی
```

### 2. قالب صفحه اپیزود (`_layouts/post.html`)

```liquid
{% assign transcript_name = page.transcript | remove: '.md' %}
{% for transcript in site.transcripts %}
    {% if transcript_filename == transcript_name %}
        {{ transcript.content }}
    {% endif %}
{% endfor %}
```

این کد از پوشه `_transcripts/` می‌خواند، نه `_includes/`.

---

## ✅ چک‌لیست پاکسازی

- [ ] حذف `_includes/episode-1.md`
- [ ] حذف `_includes/README.md` (اگر فقط برای transcript بود)
- [ ] حذف پوشه `_data/episodes/` یا کل `_data/`
- [ ] اطمینان از وجود transcript در `_transcripts/episode-1.md`
- [ ] تست سایت بعد از commit

---

## 📚 مستندات به‌روز

- **`_transcripts/README.md`** - راهنمای استفاده از transcripts
- **`_posts/TEMPLATE.md`** - الگوی اپیزود جدید
- **`QUICK_REFERENCE.md`** - مرجع سریع

---

## ⚠️ هشدار

**قبل از حذف:**
- مطمئن شوید تمام اطلاعات لازم در `_posts/*.md` موجود است
- یک backup بگیرید (یا از Git history استفاده کنید)

**بعد از حذف:**
- Commit و Push کنید
- منتظر build بمانید
- سایت را تست کنید تا مطمئن شوید transcript کار می‌کند

---

## 🎯 نتیجه

✅ **یک منبع داده:** فقط `_posts/*.md`  
✅ **یک پوشه transcript:** فقط `_transcripts/`  
✅ **کد تمیز‌تر:** بدون تکرار  
✅ **نگهداری آسان‌تر:** فقط یک جا ویرایش می‌شود  

---

**آماده پاکسازی هستید! 🧹**
