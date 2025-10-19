# 📋 راهنمای سریع - Quick Reference

## 🎯 قابلیت‌های وبسایت

| قابلیت | وضعیت | مستندات |
|--------|-------|---------|
| طراحی RTL با تم تیره | ✅ | `README.md` |
| لوگوی تصویری | ✅ | `NEW_FEATURES.md` |
| پلیر صوتی | ✅ | `assets/js/player.js` |
| **ویدیوی تیزر** | ✅ **جدید** | `VIDEO_TEASER_FEATURE.md` |
| Transcript (متن کامل) | ✅ | `_includes/README.md` |
| صوت‌های مرتبط | ✅ | `TEMPLATE.md` |
| خبرنامه | ✅ | `SETUP_GUIDE.md` |
| GitHub Pages | ✅ | `DEPLOYMENT_CHECKLIST.md` |

---

## 📁 ساختار پوشه‌ها

```
shak/
├── 📖 مستندات
│   ├── START_HERE.md
│   ├── QUICK_START.md
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── VIDEO_TEASER_FEATURE.md  ← جدید
│   └── QUICK_REFERENCE.md       ← این فایل
│
├── 🌐 محتوا
│   ├── _posts/                  ← اپیزودها
│   ├── _transcripts/            ← Transcripts
│   └── index.html               ← صفحه اصلی
│
├── 🎨 دارایی‌ها
│   ├── assets/css/
│   ├── assets/js/
│   ├── assets/images/           ← لوگو
│   ├── assets/episodes/         ← فایل‌های MP3
│   └── assets/videos/           ← ویدیوهای تیزر (جدید)
│
└── ⚙️ تنظیمات
    ├── _config.yml
    ├── _layouts/
    └── .github/workflows/
```

---

## 🚀 افزودن اپیزود جدید

### ۱. آماده‌سازی فایل‌ها

```
✅ فایل صوتی: X.mp3 (در assets/episodes/)
✅ ویدیو تیزر: episode-X-teaser.mp4 (اختیاری، در assets/videos/)
✅ Transcript: episode-X.md (اختیاری، در _includes/)
```

### ۲. ایجاد فایل اپیزود

در `_posts/` فایل جدید بسازید:

```
2025-10-20-episode-2.md
```

### ۳. Front Matter

```yaml
---
layout: post
title: "اپیزود دوم: عنوان"
date: 2025-10-20
audio_url: "/assets/episodes/2.mp3"
duration: "XX:XX"
episode_number: 2
video_teaser: "/assets/videos/episode-2-teaser.mp4"  # اختیاری
video_poster: "/assets/videos/episode-2-poster.jpg"  # اختیاری
transcript: "episode-2.md"                           # اختیاری
related_audios:
  - name: "نام"
    author: "نویسنده"
    link: "URL"
    description: "توضیحات"
---

## محتوای اپیزود

متن شما...
```

### ۴. Commit & Push

```bash
git add .
git commit -m "Add episode 2"
git push
```

**منتظر 2-5 دقیقه بمانید تا build شود!**

---

## 🎬 استفاده از Video Teaser

### مشخصات ویدیو:
- **فرمت:** MP4
- **رزولوشن:** 1920x1080
- **مدت:** 15-30 ثانیه
- **حجم:** < 50MB

### افزودن به اپیزود:

```yaml
video_teaser: "/assets/videos/episode-X-teaser.mp4"
video_poster: "/assets/videos/episode-X-poster.jpg"  # اختیاری
```

**راهنمای کامل:** `VIDEO_TEASER_FEATURE.md`

---

## 📝 استفاده از Transcript

### ایجاد فایل:

در `_transcripts/` فایل بسازید:

```markdown
### <span class="transcript-timestamp">[00:00]</span> مقدمه

متن شما...

### <span class="transcript-timestamp">[01:30]</span> بخش دوم

متن بعدی...
```

### اضافه کردن به اپیزود:

```yaml
transcript: "episode-X.md"
```

**راهنمای کامل:** `_transcripts/README.md`

---

## 🎨 سفارشی‌سازی

### رنگ‌ها (`assets/css/style.css`):

```css
:root {
    --bg-dark: #1a1a1a;        /* پس‌زمینه */
    --accent-red: #8c2b2b;     /* قرمز */
    --accent-gold: #b08f5c;    /* طلایی */
}
```

### لوگو:

```
assets/images/logo.webp  ← جایگزین کنید
```

### لینک‌های پلتفرم (`index.html`):

خطوط 132-150 را ویرایش کنید.

---

## 🔧 عیب‌یابی سریع

| مشکل | راه‌حل |
|------|--------|
| سایت نمایش داده نمی‌شود | Actions → بررسی لاگ |
| ویدیو کار نمی‌کند | فرمت MP4 باشد |
| Transcript نمایش داده نمی‌شود | فایل در `_includes/` باشد |
| صوت پخش نمی‌شود | فایل در `assets/episodes/` باشد |
| تغییرات اعمال نشد | 2-5 دقیقه صبر کنید |

---

## 📚 مستندات

| نیاز | فایل |
|-----|------|
| شروع سریع | `QUICK_START.md` |
| راهنمای کامل | `SETUP_GUIDE.md` |
| چک‌لیست | `DEPLOYMENT_CHECKLIST.md` |
| ویدیو تیزر | `VIDEO_TEASER_FEATURE.md` |
| Transcript | `_transcripts/README.md` |
| ویدیو | `assets/videos/README.md` |
| تغییرات | `CHANGELOG.md` |

---

## ⚡ دستورات Git سریع

```bash
# اضافه کردن همه تغییرات
git add .

# Commit با پیام
git commit -m "توضیحات"

# Push به GitHub
git push

# بررسی وضعیت
git status

# مشاهده تاریخچه
git log --oneline
```

---

## 🎯 چک‌لیست راه‌اندازی

- [ ] فایل‌ها به GitHub آپلود شدند
- [ ] GitHub Pages فعال است (Settings → Pages)
- [ ] لوگو (`logo.webp`) اضافه شد
- [ ] لینک‌های پلتفرم تنظیم شدند
- [ ] اولین اپیزود آماده است
- [ ] فایل MP3 آپلود شد
- [ ] (اختیاری) ویدیو تیزر اضافه شد
- [ ] (اختیاری) Transcript اضافه شد
- [ ] (اختیاری) Mailchimp تنظیم شد
- [ ] سایت تست شد ✓

---

## 📞 پشتیبانی

- **مستندات:** همه فایل‌های `*.md` در پروژه
- **GitHub Issues:** برای گزارش مشکل
- **Instagram:** @shak.podcast

---

**نسخه:** 1.2.0  
**به‌روزرسانی:** اکتبر ۲۰۲۵  

**موفق باشید! 🦁💭**
