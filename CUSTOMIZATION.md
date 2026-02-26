# دليل التنفيذ والتخصيص
# Implementation & Customization Guide

## 1. التثبيت السريع / Quick Start

### الخطوة 1: نسخ الملفات
```bash
# انسخ جميع ملفات المشروع
cp -r مشاريع٤ /your/destination/path
```

### الخطوة 2: فتح المشروع
```bash
# انتقل إلى مجلد المشروع
cd مشاريع٤

# ابدأ بخادم محلي (اختياري)
python3 -m http.server 8000
# أو
npx http-server
```

### الخطوة 3: فتح في المتصفح
```
http://localhost:8000
# أو افتح index.html مباشرة
```

---

## 2. تخصيص الألوان / Customize Colors

### الطريقة 1: تعديل CSS Variables
في ملف `src/styles.css`، عدّل الألوان في `:root`:

```css
:root {
    --accent: #1abc9c;              /* اللون الأساسي */
    --accent-light: #2dd4bf;        /* اللون الفاتح */
    --success: #27ae60;             /* النجاح */
    --warning: #e67e22;             /* التحذير */
    --danger: #e74c3c;              /* الخطر */
}

html[data-theme="light"] {
    --accent: #16a085;              /* اللون في الوضع النهاري */
    /* ... الألوان الأخرى ... */
}
```

### الطريقة 2: استخدام config.js
عدّل ملف `src/config.js`:

```javascript
themes: {
    dark: {
        accent: '#1abc9c',           // اللون الجديد
        // ... باقي الألوان
    }
}
```

---

## 3. تعديل البيانات / Modify Data

### البيانات الثابتة (في HTML)
عدّل مباشرة في `index.html`:

```html
<!-- تغيير رقم KPI -->
<div class="kpi-value">47</div>  <!-- غيّر الرقم هنا -->

<!-- تغيير اسم المهمة -->
<td>تطوير الواجهة الأمامية</td>  <!-- غيّر النص هنا -->
```

### البيانات الديناميكية (في Script)
عدّل في `src/script.js` أو `src/config.js`:

```javascript
// config.js - تحديث بيانات KPI
kpiCards: [
    {
        id: 'projects',
        label: 'إجمالي المشاريع',
        value: 47,          // غيّر هنا
        change: 12,         // غيّر النسبة
        progress: 78,       // غيّر النسبة المئوية
    }
]

// config.js - تحديث بيانات الجدول
tasks: [
    {
        name: 'اسم المهمة الجديدة',
        project: 'اسم المشروع',
        assignee: 'اسم الموظف',
        status: 'progress',
        progress: 75,
        dueDate: '2026-03-01'
    }
]
```

---

## 4. تعديل الشعار / Customize Logo

### استبدال ملفات الشعار
1. أنشئ صورتك الخاصة (PNG أو SVG)
2. احفظ النسختين:
   - `public/assets/moe-logo-white.png` - للوضع الليلي
   - `public/assets/moe-logo-black.png` - للوضع النهاري
3. تأكد من نسبة أبعاد متساوية (مثلاً 200x200 px)

### تغيير حجم الشعار
في `src/styles.css`:

```css
.logo {
    max-width: 160px;   /* غيّر الحد الأقصى للعرض */
    max-height: 120px;  /* غيّر الحد الأقصى للارتفاع */
}
```

### إضافة تأثيرات على الشعار
في `src/styles.css`:

```css
.logo {
    filter: drop-shadow(0 0 15px rgba(26, 188, 156, 0.3));
    /* غيّر القيمة الأخيرة للتحكم في الإضاءة */
    
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);  /* تكبير عند المرور */
}
```

---

## 5. إضافة صفحات جديدة / Add New Pages

### خطوات إضافة صفحة جديدة:

1. **أنشئ ملف HTML جديد:**
```html
<!-- new-page.html -->
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <title>صفحة جديدة</title>
    <link rel="stylesheet" href="src/styles.css">
</head>
<body>
    <!-- استخدم نفس البنية -->
    <div class="app-container">
        <aside class="sidebar">
            <!-- انسخ من index.html -->
        </aside>
        <main class="main-content">
            <!-- محتواك هنا -->
        </main>
    </div>
    <script src="src/script.js"></script>
</body>
</html>
```

2. **أضف رابطاً في القائمة:**
في `index.html`:
```html
<li><a href="new-page.html" class="nav-item">🆕 صفحتي الجديدة</a></li>
```

---

## 6. تخصيص الرسوم البيانية / Customize Charts

### تغيير نوع الرسم البياني
في `src/script.js`:

```javascript
function initDailyCompletionChart() {
    const ctx = document.getElementById('daily-completion-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',  // غيّر إلى: 'line', 'pie', 'doughnut', إلخ
        // ...
    });
}
```

### تحديث بيانات الرسم البياني
```javascript
// في config.js
charts: {
    daily: {
        labels: ['يوم 1', 'يوم 2', 'يوم 3'],  // غيّر العلامات
        data: [10, 20, 30]  // غيّر البيانات
    }
}
```

### تخصيص ألوان الرسم البياني
```javascript
function initDailyCompletionChart() {
    new Chart(ctx, {
        // ...
        data: {
            datasets: [{
                backgroundColor: '#your-color',  // اللون الجديد
                borderColor: '#your-border-color',
                // ...
            }]
        }
    });
}
```

---

## 7. إضافة الميزات المتقدمة / Advanced Features

### إضافة API Real-Time
في `src/script.js`:

```javascript
// استبدل البيانات التجريبية بـ API
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// استدعاء الدالة عند التحميل
document.addEventListener('DOMContentLoaded', fetchDashboardData);
```

### إضافة نظام الإخطارات
في `src/script.js`:

```javascript
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// استخدام
showNotification('تم حفظ البيانات بنجاح', 'success');
```

### إضافة اختيار تاريخي
في `index.html`:

```html
<div class="work-controls">
    <input type="date" id="start-date" class="filter-input">
    <input type="date" id="end-date" class="filter-input">
    <button onclick="filterByDate()">بحث</button>
</div>
```

في `src/script.js`:

```javascript
function filterByDate() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    // طبّق الفلترة هنا
}
```

---

## 8. تحسين الأداء / Performance Optimization

### تقليل حجم CSS
```bash
# تثبيت أداة CSS minifier
npm install -g csso-cli

# ضغط CSS
csso src/styles.css -o src/styles.min.css
```

### تقليل حجم JavaScript
```bash
# تثبيت أداة JavaScript minifier
npm install -g terser

# ضغط JavaScript
terser src/script.js -o src/script.min.js
```

### تحميل الموارد بكفاءة
في `index.html`:

```html
<!-- تحميل Async للـ Scripts غير الحرجة -->
<script src="src/script.js" defer></script>

<!-- تحميل Lazy للصور -->
<img src="logo.png" loading="lazy">

<!-- استخدام WebP للصور -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.png">
</picture>
```

---

## 9. الاختبار / Testing

### اختبار الثيم
1. انقر على زر تبديل الثيم (☀️/🌙)
2. تحقق من تبديل الألوان والشعار
3. أعد تحميل الصفحة - يجب أن يبقى الثيم المحفوظ

### اختبار البحث والفلترة
1. اكتب نصاً في حقل البحث
2. اختر حالة من القائمة
3. تحقق من تصفية الجدول

### اختبار الرسوم البيانية
1. افتح أدوات المتطور (F12)
2. افحص بيانات الرسم البياني
3. غيّر القيم وأعد التحميل

### اختبار التوافقية
- اختبر في متصفحات مختلفة
- اختبر على الأجهزة المحمولة (استجابة)
- اختبر سرعة التحميل

---

## 10. النشر / Deployment

### النشر على Server
```bash
# 1. قم بضغط الملفات
zip -r dashboard.zip index.html src/ public/

# 2. أرفع الملفات إلى خادمك
scp -r مشاريع٤/ user@server:/var/www/

# 3. عيّن الأذونات الصحيحة
chmod -R 755 /var/www/مشاريع٤
```

### النشر على GitHub Pages
```bash
# 1. أنشئ Repository
git init
git add .
git commit -m "Initial commit"

# 2. اربط مع GitHub
git remote add origin https://github.com/your-username/moe-dashboard.git
git branch -M main
git push -u origin main

# 3. فعّل GitHub Pages
# في الإعدادات: Settings → Pages → Source → main branch
```

### النشر على Netlify
```bash
# 1. ثبّت Netlify CLI
npm install -g netlify-cli

# 2. انشر
netlify deploy --prod --dir=.
```

---

## 11. استكشاف الأخطاء / Troubleshooting

### المشكلة: الشعار لا يظهر
**الحل:**
- تحقق من وجود الملفات في `public/assets/`
- تحقق من أسماء الملفات بدقة (حساسة لحالة الأحرف)
- افحص Console للأخطاء (F12)

### المشكلة: الرسوم البيانية لا تعمل
**الحل:**
- تحقق من تحميل Chart.js من CDN
- افحص بيانات الرسم البياني في Console
- تأكد من صيغة البيانات الصحيحة

### المشكلة: RTL لا يعمل
**الحل:**
- تأكد من `dir="rtl"` في العلامة `<html>`
- استخدم `text-align: right` في CSS
- اختبر على متصفح حديث

### المشكلة: الثيم لا يحفظ
**الحل:**
- افحص LocalStorage في Console
- تحقق من دعم المتصفح لـ LocalStorage
- امسح Cache والـ Cookies وأعد التحميل

---

## 12. موارد إضافية / Additional Resources

### مكتبات مفيدة
- [Chart.js](https://www.chartjs.org/) - الرسوم البيانية
- [Axios](https://axios-http.com/) - طلبات HTTP
- [Moment.js](https://momentjs.com/) - معالجة التواريخ
- [Lodash](https://lodash.com/) - فائدات JavaScript

### أدوات التطوير
- [VS Code](https://code.visualstudio.com/) - محرر النصوص
- [DevTools](https://developer.chrome.com/docs/devtools/) - أدوات المتطور
- [Postman](https://www.postman.com/) - اختبار API

### مراجع مفيدة
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

---

## 13. الدعم والمساعدة / Support

إذا واجهت مشكلة:
1. افحص Console للأخطاء
2. راجع README.md
3. تحقق من البيانات والملفات
4. اتصل بفريق الدعم

---

**تم التحديث:** 24 فبراير 2026
**الإصدار:** 1.0.0
