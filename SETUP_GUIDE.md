# راهنمای راه‌اندازی کامل پادکست شَک

این راهنما به شما کمک می‌کند تا وبسایت پادکست خود را روی GitHub Pages راه‌اندازی کنید.

## ۱. آماده‌سازی اولیه

### الف) ایجاد مخزن GitHub

1. به [GitHub](https://github.com) بروید و وارد حساب خود شوید
2. روی دکمه **New Repository** کلیک کنید
3. نام مخزن را وارد کنید (مثلاً `shak-podcast`)
4. مخزن را **Public** قرار دهید
5. روی **Create Repository** کلیک کنید

### ب) آپلود فایل‌ها به GitHub

دو روش وجود دارد:

#### روش ۱: از طریق رابط وب GitHub (ساده‌تر)

1. روی **uploading an existing file** کلیک کنید
2. تمام فایل‌های این پوشه را بکشید و در صفحه GitHub رها کنید
3. روی **Commit changes** کلیک کنید

#### روش ۲: از طریق Git (پیشنهادی)

در ترمینال، این دستورات را اجرا کنید:

```bash
cd /path/to/shak
git init
git add .
git commit -m "Initial commit: Shak podcast website"
git branch -M main
git remote add origin https://github.com/USERNAME/shak-podcast.git
git push -u origin main
```

(USERNAME را با نام کاربری GitHub خود جایگزین کنید)

## ۲. فعال‌سازی GitHub Pages

1. در مخزن GitHub خود، به **Settings** بروید
2. از منوی سمت چپ، روی **Pages** کلیک کنید
3. در قسمت **Source**، گزینه **GitHub Actions** را انتخاب کنید
4. صفحه را ذخیره کنید

GitHub به طور خودکار شروع به ساخت سایت شما می‌کند. این فرآیند ۲-۵ دقیقه طول می‌کشد.

## ۳. بررسی وضعیت ساخت

1. به تب **Actions** در مخزن خود بروید
2. باید یک workflow به نام "Deploy Jekyll site to Pages" را ببینید
3. منتظر بمانید تا علامت سبز (✓) نمایش داده شود

## ۴. مشاهده وبسایت

بعد از موفقیت‌آمیز بودن ساخت، وبسایت شما در این آدرس در دسترس خواهد بود:

```
https://USERNAME.github.io/shak-podcast/
```

اگر از دامنه سفارشی استفاده می‌کنید، فایل `CNAME` را ویرایش کنید.

## ۵. افزودن اپیزود جدید

### مرحله ۱: آماده کردن فایل MP3

1. فایل MP3 اپیزود خود را آماده کنید (مثلاً `2.mp3`)
2. به مخزن GitHub بروید
3. به پوشه `assets/episodes/` بروید
4. روی **Add file > Upload files** کلیک کنید
5. فایل MP3 را آپلود کنید

### مرحله ۲: ایجاد فایل JSON اطلاعات

1. به پوشه `_data/episodes/` بروید
2. روی **Add file > Create new file** کلیک کنید
3. نام فایل را `2.json` قرار دهید
4. محتوای زیر را کپی و ویرایش کنید:

```json
{
  "episode_number": 2,
  "title": "اپیزود دوم: عنوان اپیزود",
  "description": "توضیحات اپیزود",
  "duration": "XX:XX",
  "publish_date": "تاریخ انتشار",
  "audio_file": "2.mp3",
  "related_audios": [
    {
      "name": "نام صوت مرتبط",
      "author": "نام نویسنده",
      "link": "https://example.com/link",
      "description": "توضیحات"
    }
  ]
}
```

5. روی **Commit changes** کلیک کنید

### مرحله ۳: ایجاد فایل پست

1. به پوشه `_posts/` بروید
2. روی **Add file > Create new file** کلیک کنید
3. نام فایل را با فرمت `YYYY-MM-DD-episode-N.md` قرار دهید (مثلاً `2025-10-20-episode-2.md`)
4. محتوای زیر را کپی و ویرایش کنید:

```markdown
---
layout: post
title: "اپیزود دوم: عنوان اپیزود"
date: 2025-10-20
audio_url: "/assets/episodes/2.mp3"
duration: "XX:XX"
episode_number: 2
related_audios:
  - name: "نام صوت مرتبط"
    author: "نام نویسنده"
    link: "https://example.com"
    description: "توضیحات"
---

## عنوان بخش

محتوای اپیزود شما اینجا قرار می‌گیرد...

### بخش فرعی

* نکته اول
* نکته دوم

---

## نقل‌قول‌های کلیدی:

> نقل‌قول شما اینجا

---

پایان اپیزود
```

5. روی **Commit changes** کلیک کنید

### مرحله ۴: انتشار

بعد از commit کردن، GitHub Pages به طور خودکار سایت را دوباره می‌سازد و اپیزود جدید شما در چند دقیقه نمایش داده می‌شود!

## ۶. پیکربندی لینک‌های پلتفرم و شبکه‌های اجتماعی

فایل `index.html` را ویرایش کنید و لینک‌های پلتفرم‌ها را با لینک‌های واقعی پادکست خود جایگزین کنید:

```html
<a href="YOUR_SPOTIFY_LINK" class="platform-link spotify" ...>
<a href="YOUR_APPLE_PODCASTS_LINK" class="platform-link apple" ...>
<a href="YOUR_YOUTUBE_LINK" class="platform-link youtube" ...>
```

همچنین لینک اینستاگرام را ویرایش کنید:

```html
<a href="https://instagram.com/YOUR_INSTAGRAM" class="social-link instagram" ...>
```

## ۷. راه‌اندازی خبرنامه (Mailchimp)

1. به [Mailchimp.com](https://mailchimp.com) بروید و یک حساب رایگان ایجاد کنید
2. یک **Audience** جدید ایجاد کنید
3. به **Audience > Signup forms > Embedded forms** بروید
4. کد HTML فرم را کپی کنید
5. در فایل `index.html`، بخش Newsletter را پیدا کنید:

```html
<!-- Mailchimp Embed Form -->
<div class="newsletter-form">
    <!-- کد Mailchimp خود را اینجا قرار دهید -->
</div>
```

6. کد فرم Mailchimp را جایگزین کنید
7. استایل فرم را طبق سبک سایت تنظیم کنید

## ۸. اجرای محلی (اختیاری)

اگر می‌خواهید سایت را قبل از انتشار روی کامپیوتر خود ببینید:

### نصب Ruby و Jekyll

**Windows:**
1. [RubyInstaller](https://rubyinstaller.org/) را دانلود و نصب کنید
2. در CMD یا PowerShell:

```bash
gem install bundler jekyll
cd path/to/shak
bundle install
bundle exec jekyll serve
```

**macOS/Linux:**

```bash
# macOS
brew install ruby
gem install bundler jekyll

# Linux (Ubuntu/Debian)
sudo apt-get install ruby-full build-essential
gem install bundler jekyll

# سپس
cd path/to/shak
bundle install
bundle exec jekyll serve
```

3. به `http://localhost:4000` بروید

## ۹. نکات مهم

### حجم فایل MP3

GitHub فایل‌های بیشتر از ۱۰۰ مگابایت را قبول نمی‌کند. اگر فایل‌های شما بزرگ‌تر هستند:

1. **گزینه ۱:** فایل‌های MP3 را روی یک سرویس میزبانی فایل (مثل SoundCloud, Archive.org) آپلود کنید و لینک مستقیم را استفاده کنید
2. **گزینه ۲:** فایل‌های صوتی را با نرخ بیت کمتر فشرده‌سازی کنید (۹۶ kbps برای پادکست کافی است)

### استفاده از baseurl

اگر نام مخزن شما چیزی غیر از نام کاربری شماست، باید `baseurl` را در `_config.yml` تنظیم کنید:

```yaml
baseurl: "/shak-podcast"  # نام مخزن شما
```

### دامنه سفارشی

اگر دامنه شخصی دارید:

1. فایل `CNAME` را ویرایش کنید و دامنه خود را وارد کنید:
   ```
   podcast.example.com
   ```

2. در تنظیمات DNS دامنه خود، یک رکورد CNAME ایجاد کنید که به `USERNAME.github.io` اشاره کند

## ۱۰. پشتیبانی و عیب‌یابی

### سایت نمایش داده نمی‌شود؟

1. به تب **Actions** بروید و بررسی کنید که build موفق بوده است
2. اگر خطا دارد، روی build کلیک کنید و پیام خطا را بخوانید
3. معمولاً خطاها مربوط به Syntax در فایل‌های Markdown یا YAML هستند

### اپیزود جدید نمایش داده نمی‌شود؟

1. بررسی کنید که تاریخ در نام فایل و Front Matter یکسان باشد
2. مطمئن شوید که فایل در پوشه `_posts` است
3. منتظر بمانید تا build جدید تمام شود (۲-۵ دقیقه)

### پلیر کار نمی‌کند؟

1. مطمئن شوید که مسیر فایل MP3 درست است
2. بررسی کنید که فایل MP3 واقعاً آپلود شده است
3. Console مرورگر را باز کنید (F12) و خطاها را بررسی کنید

---

## موفق باشید! 🎙️

اگر سؤالی دارید یا به کمک نیاز دارید، می‌توانید یک Issue در GitHub ایجاد کنید.

**یادتان باشد: شک کنید، بپرسید، و جرأت داشته باشید! 💭**
