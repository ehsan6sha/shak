# 📝 توضیح _config.yml و بهترین روش‌ها

## ❓ سؤالات شما

### 1. `output: false` چیست؟

```yaml
collections:
  transcripts:
    output: false
```

**معنی:**
- Jekyll پوشه `_transcripts/` را به عنوان Collection می‌خواند
- محتوا در `site.transcripts` در دسترس است
- **اما صفحات HTML جداگانه برای هر transcript ساخته نمی‌شود**

**چرا `false`؟**
- Transcripts داخل صفحات اپیزود نمایش داده می‌شوند (embedded)
- نیازی به صفحه جداگانه `/transcripts/episode-1.html` نیست
- صرفه‌جویی در build time و فضا

**مقایسه:**

| `output: true` | `output: false` |
|---------------|----------------|
| می‌سازد: `/transcripts/episode-1.html` | هیچ صفحه‌ای نمی‌سازد |
| برای: Blog posts, صفحات جداگانه | برای: داده‌های داخلی (embedded) |
| مثال: `_posts/` | مثال: `_transcripts/` |

---

### 2. چرا اطلاعات تکراری؟

**قبلاً:**
```yaml
# _config.yml
description: "آیا تا به حال..."
```

```html
<!-- index.html -->
<p>آیا تا به حال...</p>  ← تکرار!
```

**شما حق دارید!** این bad practice بود. 

---

## ✅ راه‌حل: استفاده از Variables

### الان (`_config.yml`):

```yaml
# Site settings
title: "شَک - پادکست فلسفی نیچه"
description: "آیا تا به حال به تمام ارزش‌هایی که به ما آموخته‌اند..."

# Podcast Info
host_name: "احسان"
about_intro: "اینجا پادکست «شَک» است..."
about_host: "من احسان هستم و قرار است..."
about_philosophy: "نیچه خطرناک است..."
```

### الان (`index.html`):

```html
<!-- استفاده از variables -->
<p class="tagline">{{ site.description }}</p>
<p class="highlight">{{ site.about_intro }}</p>
<p>{{ site.about_host }}</p>
<p>{{ site.about_philosophy }}</p>
```

---

## 🎯 مزایا

### ✅ یک منبع حقیقت (Single Source of Truth):
- همه متن‌ها فقط در `_config.yml`
- تغییر در یک جا → اعمال در همه جا

### ✅ نگهداری آسان:
```yaml
# فقط اینجا تغییر دهید:
description: "متن جدید..."
```
↓
همه صفحاتی که از `{{ site.description }}` استفاده می‌کنند، به‌روز می‌شوند!

### ✅ قابلیت استفاده مجدد:
```html
<!-- در هر صفحه -->
<title>{{ site.title }}</title>
<meta name="description" content="{{ site.description }}">
<h1>{{ site.title }}</h1>
```

### ✅ ترجمه آسان‌تر:
در آینده می‌توانید چند `_config` برای زبان‌های مختلف داشته باشید.

---

## 📚 متغیرهای موجود در _config.yml

| متغیر | استفاده | مثال |
|-------|---------|------|
| `site.title` | عنوان سایت | `{{ site.title }}` |
| `site.description` | توضیحات کوتاه | `{{ site.description }}` |
| `site.host_name` | نام هاست | `{{ site.host_name }}` |
| `site.about_intro` | معرفی پادکست | `{{ site.about_intro }}` |
| `site.about_host` | درباره هاست | `{{ site.about_host }}` |
| `site.about_philosophy` | فلسفه پادکست | `{{ site.about_philosophy }}` |
| `site.url` | آدرس سایت | `{{ site.url }}` |
| `site.baseurl` | مسیر پایه | `{{ site.baseurl }}` |

---

## 🔧 نحوه اضافه کردن متغیر جدید

### 1. در `_config.yml`:
```yaml
# اضافه کنید:
instagram_handle: "@shak.podcast"
spotify_url: "https://..."
```

### 2. در HTML استفاده کنید:
```html
<a href="{{ site.spotify_url }}">Spotify</a>
<p>ما را دنبال کنید: {{ site.instagram_handle }}</p>
```

---

## 💡 Best Practices

### ✅ انجام دهید:
- همه متن‌های قابل تغییر را در `_config.yml` قرار دهید
- از `{{ site.variable }}` استفاده کنید
- نام متغیرها را واضح و توصیفی انتخاب کنید
- برای هر بخش، یک دسته (category) ایجاد کنید

### ❌ انجام ندهید:
- متن را hardcode نکنید (مگر اینکه ثابت باشد)
- از نام‌های مبهم استفاده نکنید (`text1`, `content2`)
- اطلاعات را در چند جا تکرار نکنید

---

## 🎯 مثال کامل

### `_config.yml`:
```yaml
# Site Settings
title: "شَک - پادکست فلسفی نیچه"
description: "سفری بی‌پروا به دل فراسوی نیک و بد"

# Social Media
instagram: "@shak.podcast"
spotify: "https://spotify.com/..."
apple_podcasts: "https://podcasts.apple.com/..."

# Podcast Info
host_name: "احسان"
email: "contact@shak.podcast"
```

### در صفحات استفاده کنید:
```html
<!-- Hero -->
<h1>{{ site.title }}</h1>
<p>{{ site.description }}</p>

<!-- Footer -->
<p>تماس: {{ site.email }}</p>
<a href="{{ site.instagram }}">Instagram</a>

<!-- Meta Tags -->
<meta property="og:title" content="{{ site.title }}">
<meta property="og:description" content="{{ site.description }}">
```

---

## 🔄 مقایسه: قبل و بعد

### ❌ قبل (Bad):
```html
<!-- index.html -->
<p>آیا تا به حال به تمام ارزش‌هایی که...</p>
<p>من احسان هستم و...</p>

<!-- about.html -->
<p>آیا تا به حال به تمام ارزش‌هایی که...</p> ← تکرار!
<p>من احسان هستم و...</p> ← تکرار!
```

### ✅ بعد (Good):
```yaml
# _config.yml (فقط یک بار)
description: "آیا تا به حال..."
about_host: "من احسان هستم..."
```

```html
<!-- index.html -->
<p>{{ site.description }}</p>
<p>{{ site.about_host }}</p>

<!-- about.html -->
<p>{{ site.description }}</p> ← از همان منبع!
<p>{{ site.about_host }}</p> ← بدون تکرار!
```

---

## ⚠️ نکته مهم

**بعد از تغییر `_config.yml`:**

```bash
# اگر محلی اجرا می‌کنید، باید restart کنید:
Ctrl+C  # متوقف کردن
bundle exec jekyll serve  # شروع مجدد
```

GitHub Pages به طور خودکار rebuild می‌کند (نیازی به restart نیست).

---

## 📝 خلاصه

1. **`output: false`** → صفحه جداگانه نساز، فقط داده را در دسترس بگذار
2. **Variables در `_config.yml`** → یک منبع حقیقت، بدون تکرار
3. **`{{ site.variable }}`** → استفاده در HTML templates
4. **Best Practice** → همه محتوای قابل تغییر در config

---

**حالا کد شما تمیزتر و قابل نگهداری‌تر است! ✅**
