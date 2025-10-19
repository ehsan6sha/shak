# پوشه Transcripts (متن کامل اپیزودها)

این پوشه حاوی فایل‌های Markdown متن کامل (Transcript) هر اپیزود است.

**نکته مهم:** این پوشه به عنوان یک Jekyll Collection تعریف شده است تا بتوان محتوای آن را در صفحات اپیزود نمایش داد.

## نحوه استفاده:

### ۱. ایجاد فایل Transcript

برای هر اپیزود، یک فایل `.md` در این پوشه ایجاد کنید:

```
_transcripts/episode-1.md
_transcripts/episode-2.md
_transcripts/episode-3.md
```

### ۲. فرمت فایل Transcript

فایل Transcript یک فایل Markdown معمولی است و می‌تواند شامل:

- **تایم‌استمپ‌ها:** از کلاس `transcript-timestamp` استفاده کنید
- **عناوین:** از `###` برای بخش‌های مختلف
- **پاراگراف‌ها:** متن عادی
- **تأکیدها:** **bold** یا *italic*

مثال:

```markdown
### <span class="transcript-timestamp">[00:00]</span> مقدمه

سلام، من احسان هستم...

### <span class="transcript-timestamp">[03:15]</span> بخش اول

در این بخش...
```

### ۳. اضافه کردن Transcript به اپیزود

در فایل اپیزود در پوشه `_posts/`، در front matter، خط زیر را اضافه کنید:

```yaml
---
layout: post
title: "عنوان اپیزود"
date: 2025-10-19
audio_url: "/assets/episodes/1.mp3"
duration: "26:15"
transcript: "episode-1.md"   ← این خط را اضافه کنید
---
```

### ۴. نمایش در وبسایت

بعد از اضافه کردن `transcript: "episode-1.md"` به front matter، به طور خودکار یک بخش Collapsible (قابل باز و بسته شدن) در صفحه اپیزود ظاهر می‌شود که کاربر می‌تواند با کلیک روی آن، متن کامل را مشاهده کند.

## نکات:

- **نام فایل:** می‌توانید هر نامی انتخاب کنید، فقط در front matter به درستی مشخص کنید
- **زبان:** Farsi (RTL) به طور کامل پشتیبانی می‌شود
- **استایل:** از CSS مخصوص که در `assets/css/style.css` تعریف شده استفاده می‌کند
- **Accessibility:** بخش transcript برای SEO و دسترسی‌پذیری عالی است

## مثال کامل:

مثال کامل را در `episode-1.md` ببینید.
