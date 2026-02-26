# Quick Reference Guide
# دليل المراجعة السريعة

## Project Structure
```
مشاريع٤/
├── index.html              # Main HTML file (الملف الرئيسي)
├── package.json            # Project metadata
├── README.md              # Full documentation
├── CUSTOMIZATION.md       # Customization guide
├── QUICK_REFERENCE.md     # This file
├── .gitignore            # Git ignore rules
├── src/
│   ├── styles.css        # All styles with CSS variables
│   ├── script.js         # Interactive features
│   └── config.js         # Configuration & dummy data
└── public/
    └── assets/
        ├── moe-logo-white.png    # Dark mode logo
        └── moe-logo-black.png    # Light mode logo
```

## Color Palette

### Dark Mode
| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark Blue | `#0f1419` |
| Cards | Semi-transparent | `rgba(30, 35, 48, 0.4)` |
| Text | Light Gray | `#e8eaef` |
| Accent | Turquoise | `#1abc9c` |
| Success | Green | `#27ae60` |
| Warning | Orange | `#e67e22` |

### Light Mode
| Element | Color | Hex |
|---------|-------|-----|
| Background | Light Gray | `#f5f6fa` |
| Cards | White | `#ffffff` |
| Text | Dark Gray | `#2c3e50` |
| Accent | Dark Teal | `#16a085` |
| Success | Green | `#27ae60` |
| Warning | Orange | `#e67e22` |

## Key Files

### index.html
- **Purpose:** Main dashboard HTML structure
- **Edit:** Add/remove rows, modify content
- **Contains:** Sidebar, Topbar, 4 rows of content

### src/styles.css
- **Purpose:** All styling with CSS variables
- **Edit:** Colors, sizes, spacing, animations
- **Variables:** --bg, --text, --accent, etc.

### src/script.js
- **Purpose:** Theme switching, charts, interactions
- **Edit:** Chart data, event handlers, logic
- **Features:** Dark/Light toggle, Chart.js initialization

### src/config.js
- **Purpose:** Centralized configuration
- **Edit:** KPI values, table data, colors
- **Data:** Dummy data for dashboard

## Common Tasks

### Change Logo
```bash
# Replace these files:
public/assets/moe-logo-white.png  # Dark mode
public/assets/moe-logo-black.png  # Light mode
```

### Change Colors
```css
/* In src/styles.css */
:root {
    --accent: #1abc9c;  /* Change here */
}
```

### Change Dashboard Title
```html
<!-- In index.html -->
<h2 class="sidebar-title">إدارة الأداء الوظيفي</h2>
```

### Update KPI Numbers
```html
<!-- In index.html -->
<div class="kpi-value">47</div>  <!-- Change number -->
```

### Change Chart Data
```javascript
// In src/config.js
charts: {
    daily: {
        data: [8, 12, 15, ...]  // Change values
    }
}
```

### Update Table Data
```javascript
// In src/config.js
tasks: [
    {
        name: 'Task Name',
        project: 'Project',
        // ... edit here
    }
]
```

## Theme System

### How it Works
```
User clicks sun/moon icon
    ↓
setTheme() function called
    ↓
data-theme="light" or "dark" set on <html>
    ↓
CSS variables automatically update
    ↓
Logo changes: white → dark
    ↓
Saved to localStorage
```

### CSS Variables Pattern
```css
/* Define for both themes */
:root {
    --accent: #1abc9c;  /* Dark mode */
}

html[data-theme="light"] {
    --accent: #16a085;  /* Light mode */
}

/* Use anywhere */
.element {
    color: var(--accent);
}
```

## 📊 Charts

### Available Chart Types
- Bar Chart (حركة الإنجاز)
- Line/Area Chart (منحنى الأداء)
- Doughnut Chart (مؤشر الجودة)
- Custom Heatmap (خريطة الضغط)

### Update Chart Data
```javascript
// In script.js or config.js
charts: {
    daily: {
        labels: ['الأحد', 'الإثنين', ...],
        data: [10, 20, ...]
    }
}
```

### Change Chart Type
```javascript
// In script.js
type: 'bar',  // Change to 'line', 'doughnut', 'pie'
```

## 🔍 Heatmap

### How to Configure
- Rows: Departments/Sections
- Columns: Days of week
- Values: Intensity (0 to 1)
- Colors: Auto-gradient from teal → orange

```html
<div class="heatmap-cell" style="--intensity: 0.8;"></div>
```

## 📱 Responsive Breakpoints

```css
/* Desktop (default) */
.sidebar { width: 280px; }

/* Tablet: 1024px and below */
.kpi-cards { grid-template-columns: repeat(2, 1fr); }

/* Mobile: 768px and below */
.app-container { flex-direction: column; }
.sidebar { width: 100%; }
```

## 🔐 localStorage Keys

### Saved Data
```javascript
localStorage.getItem('theme')  // 'dark' or 'light'
```

### Clear Cache
```javascript
localStorage.clear()
```

## 📈 Performance Tips

1. **Minimize Repaints:** Use CSS variables for colors
2. **Debounce Events:** Search input has built-in filtering
3. **Lazy Load:** Use `loading="lazy"` for images
4. **CDN:** Chart.js loads from CDN
5. **Minify:** Use minification tools before production

## 🐛 Debug Mode

### Enable Console Logging
```javascript
// Add to src/script.js
const DEBUG = true;
if (DEBUG) console.log('Theme changed:', theme);
```

### Check Theme
```javascript
// In browser console
document.documentElement.getAttribute('data-theme')
```

### Check Data
```javascript
// In browser console
console.log(DashboardConfig)
```

## 🎓 Common Customizations

### Add New Navigation Item
```html
<!-- In sidebar -->
<li><a href="#new" class="nav-item">🆕 جديد</a></li>
```

### Add New KPI Card
```html
<div class="card kpi-card">
    <!-- Copy from existing card -->
</div>
```

### Add New Chart
```javascript
// 1. Add canvas to HTML
<canvas id="new-chart"></canvas>

// 2. Create initialization function
function initNewChart() { /* ... */ }

// 3. Call on load
document.addEventListener('DOMContentLoaded', initNewChart);
```

### Change Font
```css
body {
    font-family: 'Your Font', sans-serif;
}
```

## 🚀 Deployment Checklist

- [ ] Update data in config.js
- [ ] Change logos in public/assets/
- [ ] Update sidebar title
- [ ] Verify theme switching
- [ ] Test on mobile devices
- [ ] Check all charts load
- [ ] Test search/filter
- [ ] Verify RTL alignment
- [ ] Minify CSS and JS
- [ ] Test in multiple browsers
- [ ] Check performance
- [ ] Setup analytics (optional)

## 📞 Support Links

| Resource | Link |
|----------|------|
| README | README.md |
| Customization | CUSTOMIZATION.md |
| Chart.js Docs | https://www.chartjs.org/ |
| MDN Web Docs | https://developer.mozilla.org/ |
| CSS Variables | https://developer.mozilla.org/en-US/docs/Web/CSS/--* |

## 💡 Tips & Tricks

### Tip 1: Using DevTools
Press `F12` to open DevTools and inspect elements, modify styles live.

### Tip 2: Quick CSS Changes
Edit `src/styles.css` and refresh page - no build needed!

### Tip 3: Testing Theme
Change `data-theme` in Inspector to test instantly.

### Tip 4: Chart.js Data
Access Chart instances via `Chart.instances` in console.

### Tip 5: RTL Testing
Toggle `dir="rtl"` on `<html>` to see RTL effect.

---

**Last Updated:** 24 Feb 2026
**Version:** 1.0.0

---

For detailed information, see README.md and CUSTOMIZATION.md
