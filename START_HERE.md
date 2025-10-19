# 🎙️ شروع از اینجا - پادکست شَک

## خوش آمدید! 👋

این پوشه حاوی یک وبسایت **کامل و آماده** برای پادکست فارسی شما است.

---

## 📌 سه قدم برای راه‌اندازی

### 1️⃣ آپلود به GitHub (۵ دقیقه)
```
GitHub.com → New Repository → آپلود فایل‌ها → Commit
```

### 2️⃣ فعال‌سازی GitHub Pages (۱ دقیقه)
```
Settings → Pages → Source: GitHub Actions → Save
```

### 3️⃣ صبر کنید (۲-۳ دقیقه)
```
Actions → منتظر علامت ✓ سبز → سایت آماده است!
```

**آدرس سایت شما:** `https://USERNAME.github.io/REPO/`

---

## 📚 کدام راهنما برای من مناسب است؟

| اگر می‌خواهید... | این راهنما را بخوانید |
|-------------------|------------------------|
| **فقط سریع شروع کنم** | [QUICK_START.md](QUICK_START.md) |
| **توضیحات کامل گام‌به‌گام** | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| **چک‌لیست قدم‌به‌قدم** | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| **جزئیات تکنیکال پروژه** | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| **مرجع کلی** | [README.md](README.md) |

---

## 🎯 چه چیزی ساخته شده؟

یک وبسایت **تک‌صفحه‌ای، مدرن، RTL** با این بخش‌ها:

✅ **Hero Section** - لوگوی بزرگ "شَک" با افکت شکاف  
✅ **About** - معرفی پادکست  
✅ **Featured Episode** - پلیر جدیدترین اپیزود  
✅ **Archive** - کارت‌های تمام اپیزودها  
✅ **Subscribe** - لینک به Spotify, Apple, YouTube, etc.  
✅ **Newsletter** - فرم عضویت (Mailchimp)  

### ویژگی‌های کلیدی:

- 🎨 **طراحی تیره** (پس‌زمینه: #1a1a1a، قرمز: #8c2b2b، طلایی: #b08f5c)
- 🌐 **RTL کامل** با فونت Vazirmatn
- ▶️ **پلیر سفارشی** با نوار پیشرفت و کنترل‌های کامل
- 📱 **Responsive** برای موبایل، تبلت، دسکتاپ
- 🔄 **تشخیص خودکار اپیزودها** از پوشه `_posts`
- 📝 **صفحات جداگانه** برای هر اپیزود با صوت‌های مرتبط
- 🚀 **GitHub Pages** - میزبانی رایگان

---

## 📁 ساختار فایل‌ها

```
shak/
├── 📄 START_HERE.md              ← شما اینجا هستید!
├── 📄 QUICK_START.md             ← شروع سریع (۵ دقیقه)
├── 📄 SETUP_GUIDE.md             ← راهنمای کامل
├── 📄 DEPLOYMENT_CHECKLIST.md   ← چک‌لیست گام‌به‌گام
├── 📄 README.md                  ← مرجع اصلی
│
├── 📄 index.html                 ← صفحه اصلی سایت
├── 📄 _config.yml                ← تنظیمات Jekyll
│
├── 📂 _layouts/                  ← قالب‌های HTML
│   ├── default.html              ← قالب اصلی
│   └── post.html                 ← قالب صفحه اپیزود
│
├── 📂 _posts/                    ← اپیزودهای شما
│   ├── 2025-10-19-episode-1.md  ← اپیزود نمونه
│   └── TEMPLATE.md               ← الگو برای اپیزودهای جدید
│
├── 📂 assets/
│   ├── css/style.css             ← استایل‌های RTL
│   ├── js/player.js              ← پلیر صوتی
│   ├── episodes/                 ← فایل‌های MP3 اینجا
│   └── images/favicon.svg        ← آیکون سایت
│
└── 📂 .github/workflows/         ← GitHub Actions
    └── jekyll.yml                ← خودکار deployment
```

---

## 🚀 اولین کاری که باید انجام دهم؟

### گزینه ۱: فقط می‌خواهم ببینم چگونه کار می‌کند
1. به [QUICK_START.md](QUICK_START.md) بروید
2. دستورالعمل‌های ساده را دنبال کنید
3. در ۵ دقیقه سایت آماده می‌شود!

### گزینه ۲: می‌خواهم همه چیز را بفهمم
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) را باز کنید
2. گام‌به‌گام پیش بروید
3. تمام جزئیات توضیح داده شده است

### گزینه ۳: می‌خواهم یک چک‌لیست داشته باشم
1. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) را پرینت کنید
2. هر کاری انجام دادید، تیک بزنید
3. در انتها، همه چیز آماده است!

---

## ❓ سؤالات متداول

### Q: آیا باید برنامه‌نویس باشم؟
**A:** خیر! کافی است بتوانید فایل‌ها را آپلود کنید و چند تنظیم ساده انجام دهید.

### Q: هزینه دارد؟
**A:** خیر! GitHub Pages کاملاً رایگان است.

### Q: چقدر طول می‌کشد؟
**A:** اولین راه‌اندازی: ۱۰-۱۵ دقیقه. افزودن اپیزود جدید: ۲-۳ دقیقه.

### Q: فایل MP3 من بزرگ است (>100MB)؟
**A:** آن را روی SoundCloud یا Archive.org آپلود کنید و لینک مستقیم را استفاده کنید.

### Q: می‌توانم طراحی را تغییر دهم؟
**A:** بله! رنگ‌ها در `assets/css/style.css` قابل تغییر هستند.

### Q: اگر مشکلی داشتم چطور؟
**A:** بخش عیب‌یابی در `README.md` یا `SETUP_GUIDE.md` را ببینید.

---

## 📝 افزودن اپیزود جدید (خلاصه)

بعد از راه‌اندازی اولیه، برای هر اپیزود جدید:

```markdown
1. آپلود فایل MP3:
   assets/episodes/2.mp3

2. ایجاد فایل پست:
   _posts/2025-10-20-episode-2.md
   
   (از TEMPLATE.md کپی کنید و ویرایش کنید)

3. Commit کنید
   → سایت خودکار به‌روز می‌شود!
```

---

## 🎨 شخصی‌سازی (خلاصه)

### باید انجام شود:
- [ ] لینک‌های Spotify, Apple, YouTube در `index.html`
- [ ] لینک Instagram در `index.html`
- [ ] آپلود اولین MP3 در `assets/episodes/1.mp3`

### اختیاری:
- [ ] فرم Mailchimp در `index.html`
- [ ] رنگ‌ها در `assets/css/style.css`
- [ ] دامنه سفارشی در `CNAME`

---

## 🔗 لینک‌های مفید

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Mailchimp](https://mailchimp.com/)

---

## 📞 پشتیبانی

**ترتیب توصیه شده برای حل مشکل:**

1. ✅ ابتدا `SETUP_GUIDE.md` → بخش عیب‌یابی
2. ✅ سپس `README.md` → بخش Troubleshooting
3. ✅ Console مرورگر (F12) → بررسی خطاها
4. ✅ GitHub Actions → بررسی build logs
5. ✅ Issue در GitHub → اگر همچنان مشکل دارید

---

## ✨ آماده‌اید؟

یکی از این گزینه‌ها را انتخاب کنید:

| هدف من | فایل بعدی |
|---------|-----------|
| 🚀 **شروع سریع** | [QUICK_START.md](QUICK_START.md) |
| 📖 **راهنمای کامل** | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| ✓ **چک‌لیست** | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| 🔍 **جزئیات تکنیکال** | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |

---

<div align="center">

## 🦁 شک کنید، بپرسید، و جرأت داشته باشید

**موفق باشید در سفر فلسفی خود با نیچه!**

---

*ساخته شده با ❤️ برای پادکست شَک*

</div>
