# شَک - پادکست فلسفی نیچه

<div dir="rtl">

وبسایت رسمی پادکست **شَک** - سفری با نیچه به فراسوی نیک و بد

## ✨ ویژگی‌های کلیدی

- 🎨 **طراحی تیره و جذاب** با پالت رنگی الهام‌گرفته از نیچه
- 📱 **کاملاً ریسپانسیو** و بهینه برای موبایل
- ▶️ **پلیر صوتی سفارشی** با امکان پخش مستقیم
- 🔄 **تشخیص خودکار اپیزودها** از پوشه GitHub
- 🌐 **پشتیبانی کامل از RTL** برای زبان فارسی
- 🔗 **لینک به پلتفرم‌های مختلف** (Spotify, Apple, YouTube, etc.)
- 📧 **سیستم خبرنامه** با Mailchimp
- 📝 **صفحات جزئیات اپیزود** با صوت‌های مرتبط
- 🚀 **میزبانی رایگان** روی GitHub Pages

## 📚 محتویات

- [نصب سریع](#نصب-سریع)
- [راهنمای کامل راه‌اندازی](SETUP_GUIDE.md)
- [افزودن اپیزود جدید](#افزودن-اپیزود-جدید)
- [پیکربندی](#پیکربندی)

## 🚀 نصب سریع

### ۱. Clone کردن یا دانلود

```bash
git clone https://github.com/YOUR_USERNAME/shak-podcast.git
cd shak-podcast
```

### ۲. آپلود به GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### ۳. فعال‌سازی GitHub Pages

1. به **Settings** > **Pages** بروید
2. Source را روی **GitHub Actions** قرار دهید
3. منتظر بمانید تا build تمام شود (۲-۵ دقیقه)

سایت شما در `https://YOUR_USERNAME.github.io/YOUR_REPO/` آماده است! 🎉

## 📝 افزودن اپیزود جدید

### روش ساده (مستقیم از GitHub):

1. **آپلود MP3:** به `assets/episodes/` بروید و فایل `N.mp3` را آپلود کنید
2. **ایجاد پست:** در `_posts/` یک فایل جدید با نام `YYYY-MM-DD-episode-N.md` ایجاد کنید

```markdown
---
layout: post
title: "عنوان اپیزود"
date: 2025-10-19
audio_url: "/assets/episodes/N.mp3"
duration: "XX:XX"
episode_number: N
related_audios:
  - name: "نام منبع"
    author: "نویسنده"
    link: "https://example.com"
    description: "توضیحات"
---

محتوای اپیزود شما...
```

3. **Commit** کنید و GitHub Pages به طور خودکار سایت را به‌روزرسانی می‌کند!

## ⚙️ پیکربندی

### لینک‌های پلتفرم

فایل `index.html` را ویرایش کنید و لینک‌های واقعی خود را قرار دهید:

```html
<a href="YOUR_SPOTIFY_LINK" class="platform-link spotify">
<a href="YOUR_APPLE_LINK" class="platform-link apple">
<a href="YOUR_YOUTUBE_LINK" class="platform-link youtube">
<a href="https://instagram.com/YOUR_HANDLE" class="social-link instagram">
```

### خبرنامه (Mailchimp)

1. در [Mailchimp](https://mailchimp.com) یک حساب بسازید
2. کد فرم را در بخش Newsletter در `index.html` قرار دهید

### تنظیمات سایت

فایل `_config.yml` را ویرایش کنید:

```yaml
title: "عنوان سایت شما"
description: "توضیحات پادکست"
baseurl: "/REPO_NAME"  # اگر لازم است
url: "https://USERNAME.github.io"
```

## 🖥️ اجرای محلی (اختیاری)

برای پیش‌نمایش قبل از انتشار:

```bash
# نصب وابستگی‌ها
bundle install

# اجرای سرور محلی
bundle exec jekyll serve

# مشاهده در: http://localhost:4000
```

## 📁 ساختار پروژه

```
shak/
├── _config.yml              # تنظیمات Jekyll
├── _layouts/                # قالب‌های HTML
│   ├── default.html
│   └── post.html
├── _posts/                  # اپیزودها (Markdown)
│   └── YYYY-MM-DD-episode-N.md
├── _data/                   # داده‌های ساختاریافته
│   └── episodes/
│       └── N.json
├── assets/
│   ├── css/
│   │   └── style.css        # استایل‌ها
│   ├── js/
│   │   └── player.js        # پلیر صوتی
│   ├── episodes/            # فایل‌های MP3
│   │   └── N.mp3
│   └── images/
│       └── favicon.svg
├── index.html               # صفحه اصلی
├── .github/workflows/       # GitHub Actions
│   └── jekyll.yml
└── README.md
```

## 🎨 سفارشی‌سازی طراحی

رنگ‌ها در `assets/css/style.css` قابل تغییر هستند:

```css
:root {
    --bg-dark: #1a1a1a;           /* پس‌زمینه اصلی */
    --text-light: #f4f4f4;         /* متن */
    --accent-red: #8c2b2b;         /* رنگ اصلی (قرمز) */
    --accent-gold: #b08f5c;        /* رنگ فرعی (طلایی) */
}
```

## 📖 راهنمای کامل

برای راهنمای گام‌به‌گام کامل، [SETUP_GUIDE.md](SETUP_GUIDE.md) را مطالعه کنید.

## ❓ عیب‌یابی

### سایت نمایش داده نمی‌شود؟
- به **Actions** tab بروید و build را بررسی کنید
- خطاهای YAML یا Markdown را چک کنید

### اپیزود جدید نمایش داده نمی‌شود؟
- تاریخ فایل را بررسی کنید (نباید در آینده باشد)
- منتظر تکمیل build بمانید (۲-۵ دقیقه)
- Cache مرورگر را پاک کنید

### پلیر کار نمی‌کند؟
- مسیر فایل MP3 را چک کنید
- Console مرورگر (F12) را بررسی کنید

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

## 🤝 مشارکت

Issue و Pull Request خوش آمدید!

---

**ساخته شده با ❤️ برای فیلسوفان شجاع**

</div>
