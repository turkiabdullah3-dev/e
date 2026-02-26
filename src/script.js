// ========== THEME MANAGEMENT ==========
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    if (!htmlElement) return;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeUI(theme);
}

function updateThemeUI(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? 'نهار' : 'ليل';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

initTheme();

// ========== TAB SWITCHING ==========
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            if (tabId) {
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    // إعادة تطبيق الفلاتر على الجدول الجديد
                    filterTable();
                    updateNextTaskCounter();
                }
            }
        });
    });
}

// ========== SEARCH & FILTER ==========
const searchInput = document.querySelector('.search-input');
const filterSelect = document.querySelector('.filter-select');
const quickFilterButtons = document.querySelectorAll('.quick-filter-btn');

function getActiveWorkTable() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) {
        return document.querySelector('.work-table tbody');
    }
    return activeTab.querySelector('.work-table tbody');
}

function filterTable() {
    if (!searchInput || !filterSelect) {
        return;
    }
    
    const workTable = getActiveWorkTable();
    if (!workTable) {
        return;
    }
    
    const searchText = searchInput.value.toLowerCase();
    const statusFilter = filterSelect.value;
    const rows = workTable.querySelectorAll('tr');

    rows.forEach(row => {
        const taskName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        const statusBadge = row.querySelector('.badge');
        const badgeClass = statusBadge?.className || '';

        let statusMatch = true;
        if (statusFilter) {
            const statusMap = {
                'active': 'badge-active',
                'progress': 'badge-progress',
                'done': 'badge-done',
                'overdue': 'badge-overdue',
                'blocked': 'badge-blocked',
            };
            statusMatch = badgeClass.includes(statusMap[statusFilter]);
        }

        const searchMatch = taskName.includes(searchText);

        if (searchMatch && statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

if (searchInput) searchInput.addEventListener('input', filterTable);
if (filterSelect) filterSelect.addEventListener('change', filterTable);

if (quickFilterButtons.length > 0 && filterSelect) {
    quickFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter') || '';
            filterSelect.value = filterValue;
            filterTable();
            quickFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// ========== NEXT TASK COUNTER ==========
function updateNextTaskCounter() {
    const nextTaskName = document.getElementById('nextTaskName');
    const counterDays = document.getElementById('counterDays');
    const counterHours = document.getElementById('counterHours');
    const counterMinutes = document.getElementById('counterMinutes');
    const counterSeconds = document.getElementById('counterSeconds');
    const nextTaskDescription = document.getElementById('nextTaskDescription');
    const nextTaskStatus = document.getElementById('nextTaskStatus');

    if (!nextTaskName || !counterDays || !counterHours || !counterMinutes || !counterSeconds) {
        return;
    }

    const workTable = getActiveWorkTable();
    if (!workTable) {
        return;
    }

    const rows = workTable.querySelectorAll('tr:not([style*="display: none"])');
    
    if (rows.length === 0) {
        return;
    }

    let nearestTask = null;
    let nearestDate = null;

    rows.forEach(row => {
        const statusBadge = row.querySelector('.badge');
        const status = statusBadge?.textContent.trim();
        
        if (status === 'نشط' || status === 'قيد التنفيذ') {
            const dateCell = row.cells[5]?.textContent.trim();
            if (dateCell) {
                const taskDate = parseDateString(dateCell);
                if (taskDate && taskDate > new Date()) {
                    if (!nearestDate || taskDate < nearestDate) {
                        nearestDate = taskDate;
                        nearestTask = {
                            name: row.cells[0]?.textContent.trim(),
                            project: row.cells[2]?.textContent.trim(),
                            responsible: row.cells[1]?.textContent.trim(),
                            status: status,
                            date: taskDate
                        };
                    }
                }
            }
        }
    });

    if (nearestTask) {
        updateCounterDisplay(nearestTask);
        startCountdown(nearestTask.date);
    } else {
        nextTaskName.textContent = 'لا توجد مهام قادمة';
        nextTaskDescription.textContent = 'جميع المهام مكتملة أو لا توجد مواعيد قادمة';
        nextTaskStatus.textContent = '--';
        counterDays.textContent = '00';
        counterHours.textContent = '00';
        counterMinutes.textContent = '00';
        counterSeconds.textContent = '00';
    }
}

function parseDateString(dateStr) {
    try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

function updateCounterDisplay(task) {
    document.getElementById('nextTaskName').textContent = task.name;
    document.getElementById('nextTaskDescription').textContent = `${task.project} - المسؤول: ${task.responsible}`;
    
    const statusBadge = document.getElementById('nextTaskStatus');
    statusBadge.textContent = task.status;
    statusBadge.className = 'status-badge';
    if (task.status === 'قيد التنفيذ') {
        statusBadge.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    } else {
        statusBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
}

function startCountdown(targetDate) {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    function updateTimer() {
        const daysEl = document.getElementById('counterDays');
        const hoursEl = document.getElementById('counterHours');
        const minutesEl = document.getElementById('counterMinutes');
        const secondsEl = document.getElementById('counterSeconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            if (window.countdownInterval) {
                clearInterval(window.countdownInterval);
            }
            return;
        }

        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    window.countdownInterval = setInterval(updateTimer, 1000);
}

// ========== HEATMAP TOOLTIPS ==========
const heatmapCells = document.querySelectorAll('.heatmap-cell');

heatmapCells.forEach(cell => {
    cell.addEventListener('mouseenter', function() {
        const intensity = parseFloat(this.style.getPropertyValue('--intensity')) || 0.5;
        const intensityPercent = Math.round(intensity * 100);
        const labels = ['منخفض جدًا', 'منخفض', 'متوسط', 'عالي', 'عالي جدًا'];
        const intensityLevel = labels[Math.floor(intensity * 4)];

        this.title = `${intensityLevel} (${intensityPercent}%)`;
    });
});

// ========== INITIALIZE ON LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    updateNextTaskCounter();
});

// ========== NAVIGATION ==========
const navItems = document.querySelectorAll('.nav-item');

function setActiveNavFromPath() {
    if (navItems.length === 0) return;

    const path = window.location.pathname.split('/').pop();
    let matched = false;

    navItems.forEach(item => {
        const href = item.getAttribute('href') || '';
        const isPageLink = href.endsWith('.html');
        const isActive = isPageLink && href === path;

        item.classList.toggle('active', isActive);
        if (isActive) matched = true;
    });

    if (!matched) {
        navItems.forEach(item => {
            const href = item.getAttribute('href') || '';
            if (href === 'index.html') {
                item.classList.add('active');
            }
        });
    }
}

if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href') || '';
            if (href.startsWith('#')) {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

setActiveNavFromPath();

// ========== SMOOTH PAGE TRANSITIONS ==========
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a, .topbar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth transition for actual page navigation (not anchors or external links)
            if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
                e.preventDefault();
                const targetUrl = href;
                
                // Show loader
                const loader = document.getElementById('page-loader');
                if (loader) {
                    loader.classList.add('active');
                }
                
                // Navigate after short delay to show loader
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });
});

// Hide loader when page loads
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.remove('active');
    }
});

// ========== NOTIFICATIONS PANEL ==========
const notificationBtn = document.querySelector('.notification-btn');

if (notificationBtn) {
    const notifications = [
        {
            sender: 'إدارة الجودة',
            message: 'تم إغلاق 8 تظلمات جديدة في القسم.',
            time: 'قبل 10 دقائق',
            unread: true,
        },
        {
            sender: 'إدارة المشاريع',
            message: 'تم تحديث مؤشر الأداء للأسبوع الحالي.',
            time: 'قبل ساعة',
            unread: true,
        },
        {
            sender: 'قسم المتابعة',
            message: 'مطلوب مراجعة تقرير التظلمات الشهري.',
            time: 'أمس',
            unread: false,
        },
    ];

    const panel = document.createElement('div');
    panel.className = 'notification-panel';

    const unreadCount = notifications.filter(item => item.unread).length;
    const headerHtml = `
        <div class="notification-header">
            <div class="notification-title">الإشعارات</div>
            <div class="notification-count">${notifications.length} إشعار</div>
        </div>
    `;

    const listHtml = notifications.length
        ? `
            <div class="notification-list">
                ${notifications
                    .map(
                        (item) => `
                            <div class="notification-item ${item.unread ? 'unread' : ''}">
                                <div class="notification-meta">
                                    <span class="notification-sender">${item.sender}</span>
                                    <span class="notification-time">${item.time}</span>
                                </div>
                                <div class="notification-message">${item.message}</div>
                            </div>
                        `,
                    )
                    .join('')}
            </div>
        `
        : `<div class="notification-empty">لا توجد إشعارات جديدة</div>`;

    panel.innerHTML = headerHtml + listHtml;
    document.body.appendChild(panel);

    if (unreadCount > 0) {
        notificationBtn.style.position = 'relative';
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
        notificationBtn.appendChild(badge);
    }

    const positionPanel = () => {
        const rect = notificationBtn.getBoundingClientRect();
        const top = rect.bottom + 10;
        const left = Math.min(
            window.innerWidth - panel.offsetWidth - 16,
            Math.max(16, rect.left)
        );
        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
        panel.style.right = 'auto';
    };

    const closePanel = () => {
        panel.classList.remove('open');
    };

    notificationBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            positionPanel();
        }
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !notificationBtn.contains(event.target)) {
            closePanel();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closePanel();
        }
    });

    window.addEventListener('resize', () => {
        if (panel.classList.contains('open')) {
            positionPanel();
        }
    });
}

// ========== LOGIN & ACCOUNT ==========
const loginForm = document.getElementById('login-form');
const loginFeedback = document.getElementById('login-feedback');
const profileButton = document.querySelector('.profile-btn');

const demoUsers = [
    { email: 'admin@moe.gov.sa', password: '123456', name: 'مدير النظام' },
    { email: 'user@moe.gov.sa', password: '123456', name: 'مستخدم الوزارة' },
];

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('authUser');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const setStoredUser = (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
};

const clearStoredUser = () => {
    localStorage.removeItem('authUser');
};

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const email = emailInput?.value.trim().toLowerCase();
        const password = passwordInput?.value || '';

        const matchedUser = demoUsers.find(
            (user) => user.email === email && user.password === password,
        );

        if (!matchedUser) {
            if (loginFeedback) {
                loginFeedback.textContent = 'بيانات الدخول غير صحيحة. جرّب admin@moe.gov.sa / 123456';
                loginFeedback.className = 'login-feedback visible error';
            }
            return;
        }

        setStoredUser({ name: matchedUser.name, email: matchedUser.email });
        if (loginFeedback) {
            loginFeedback.textContent = 'تم تسجيل الدخول بنجاح...';
            loginFeedback.className = 'login-feedback visible success';
        }
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 600);
    });
}

if (profileButton) {
    const user = getStoredUser();
    if (user?.name) {
        profileButton.textContent = `الحساب: ${user.name}`;
        profileButton.title = 'تسجيل الخروج';
    }

    profileButton.addEventListener('click', () => {
        const currentUser = getStoredUser();
        if (currentUser) {
            const confirmLogout = window.confirm('هل تريد تسجيل الخروج؟');
            if (confirmLogout) {
                clearStoredUser();
                window.location.href = 'login.html';
            }
            return;
        }
        window.location.href = 'login.html';
    });
}

// ========== ADVANCED FEATURES ==========

// 1. Last Updated Timestamp
function initLastUpdated() {
    const updateElements = document.querySelectorAll('[data-last-updated]');
    updateElements.forEach(el => {
        const time = new Date();
        const timeStr = time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        el.textContent = `آخر تحديث: ${timeStr}`;
    });
    // Update every 30 seconds
    setInterval(() => {
        updateElements.forEach(el => {
            const time = new Date();
            const timeStr = time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
            el.textContent = `آخر تحديث: ${timeStr}`;
        });
    }, 30000);
}

// 2. Count-up Animation for Numbers
function animateCountUp(element, target, duration = 1500, isFraction = false, suffix = '') {
    if (!element) return;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (isFraction && typeof target === 'number' && target < 100) {
                element.textContent = target.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(target) + suffix;
            }
            clearInterval(timer);
        } else {
            if (isFraction && current < 100) {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }
    }, 16);
}

// 3. Real-time Data Refresh
function refreshDataWithLoader() {
    const loader = document.createElement('div');
    loader.className = 'data-loader';
    loader.innerHTML = '<span>جاري التحديث...</span><div class="spinner"></div>';
    loader.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, var(--accent), var(--accent-light)); color: white; padding: 12px 20px; border-radius: 10px; z-index: 1000; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);';
    document.body.appendChild(loader);
    
    // Simulate data refresh
    setTimeout(() => {
        loader.remove();
        
        // Count overdue tasks
        const overdueTasks = document.querySelectorAll('.badge-overdue').length;
        const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        
        // Show success notification with details
        if (overdueTasks > 0) {
            showNotification(`✅ تم تحديث البيانات في ${time} - ⚠️ ${overdueTasks} متأخرات`, 'info');
        } else {
            showNotification(`✅ تم تحديث جميع البيانات بنجاح في ${time}`, 'success');
        }
        
        // Re-animate KPI values after refresh
        setTimeout(() => {
            const kpiProjects = document.getElementById('kpi-projects');
            if (kpiProjects) animateCountUp(kpiProjects, 47, 800);
            
            const kpiCompletion = document.getElementById('kpi-completion');
            if (kpiCompletion) animateCountUp(kpiCompletion, 94.7, 800, true, '%');
            
            const kpiGoals = document.getElementById('kpi-goals');
            if (kpiGoals) animateCountUp(kpiGoals, 18, 800);
            
            const kpiOverdue = document.getElementById('kpi-overdue');
            if (kpiOverdue) animateCountUp(kpiOverdue, 9, 800);
        }, 300);
    }, 1500);
}

// 4. Notification System
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 14px 20px;
        border-radius: 10px;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    if (type === 'success') {
        notif.style.background = 'linear-gradient(135deg, #27ae60, #52be80)';
        notif.style.color = 'white';
    } else if (type === 'error') {
        notif.style.background = 'linear-gradient(135deg, #e74c3c, #ec7063)';
        notif.style.color = 'white';
    } else if (type === 'warning') {
        notif.style.background = 'linear-gradient(135deg, #f39c12, #f5b041)';
        notif.style.color = 'white';
    } else {
        notif.style.background = 'linear-gradient(135deg, #3498db, #5dade2)';
        notif.style.color = 'white';
    }
    
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3500);
}

// 5. KPI Badge Notification System
function addNotificationBadge() {
    const notifBtn = document.querySelector('.notification-btn');
    if (!notifBtn) return;
    
    // Check for overdue tasks
    const overdueTasks = document.querySelectorAll('.badge-overdue').length;
    if (overdueTasks > 0) {
        let badge = notifBtn.querySelector('.notif-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notif-badge';
            badge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #e74c3c; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);';
            notifBtn.style.position = 'relative';
            notifBtn.appendChild(badge);
        }
        badge.textContent = overdueTasks;
    }
}

// 6. PDF Export Function
function exportToPDF() {
    const element = document.querySelector('.content');
    if (!element) return;
    
    const opt = {
        margin: 10,
        filename: `Report-${new Date().toLocaleDateString('ar-SA')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Check if html2pdf is available
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save();
        showNotification('تم تصدير التقرير بنجاح 📄', 'success');
    } else {
        // Fallback: Print dialog
        window.print();
        showNotification('استخدم Ctrl+P للطباعة', 'info');
    }
}

// 7. Multiple Countdown Timers
function initMultipleCountdowns() {
    const workTable = getActiveWorkTable();
    if (!workTable) {
        return;
    }

    const rows = workTable.querySelectorAll('tr');
    const countdownData = [];
    
    rows.forEach((row, idx) => {
        if (idx < 3) {  // Only first 3
            const taskName = row.cells[0]?.textContent;
            const dateCell = row.cells[5]?.textContent;
            const status = row.querySelector('.badge')?.textContent;
            
            if (taskName && dateCell && status === 'متأخر') {
                countdownData.push({
                    name: taskName,
                    date: new Date(dateCell),
                    index: idx
                });
            }
        }
    });
}

// 8. Initialize All Advanced Features
function initAdvancedFeatures() {
    // Start all features
    initLastUpdated();
    addNotificationBadge();
    initCountdownTimers(); // Enhanced countdown timers for overdue tasks
    
    // Add Export and Print buttons to topbar
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions) {
        // Get logged-in user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userName = currentUser.name || 'المستخدم';
        
        // Profile section with picture and name
        const profileContainer = document.createElement('div');
        profileContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 10px;
            position: relative;
        `;
        
        // Profile picture
        const profilePic = document.createElement('div');
        profilePic.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent), var(--accent-light));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        `;
        profilePic.textContent = userName.charAt(0);
        profilePic.title = userName;
        
        // User name display
        const userNameSpan = document.createElement('span');
        userNameSpan.style.cssText = `
            color: var(--text);
            font-size: 13px;
            font-weight: 600;
            display: none;
        `;
        userNameSpan.textContent = userName;
        
        // Logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = '🚪 تسجيل خروج';
        logoutBtn.className = 'logout-btn';
        logoutBtn.style.cssText = `
            padding: 10px 14px;
            font-size: 15px;
        `;
        
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            showNotification('تم تسجيل الخروج بنجاح', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
        
        // Hover effects are handled by CSS
        
        // Show/hide user name on hover
        profileContainer.addEventListener('mouseenter', () => {
            userNameSpan.style.display = 'inline';
        });
        
        profileContainer.addEventListener('mouseleave', () => {
            userNameSpan.style.display = 'none';
        });
        
        profileContainer.appendChild(profilePic);
        profileContainer.appendChild(userNameSpan);
        topbarActions.insertBefore(profileContainer, topbarActions.firstChild);
        
        // Export PDF button
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '📥 تصدير';
        exportBtn.className = 'export-btn';
        exportBtn.addEventListener('click', exportToPDF);
        topbarActions.appendChild(exportBtn);
        
        // Print button
        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️ طباعة';
        printBtn.className = 'print-btn';
        printBtn.addEventListener('click', () => {
            window.print();
            showNotification('جاري فتح نافذة الطباعة...', 'info');
        });
        topbarActions.appendChild(printBtn);
        
        if (sidebar && topbar) {
            // Add menu button to topbar
            const menuBtn = document.createElement('button');
            menuBtn.textContent = '☰';
            menuBtn.style.cssText = 'position: absolute; left: 20px; background: transparent; border: none; font-size: 24px; color: var(--accent); cursor: pointer; padding: 0; z-index: 1001;';
            
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
            
            topbar.style.position = 'relative';
            topbar.insertBefore(menuBtn, topbar.firstChild);
            
            // Close sidebar when clicking on a link
            const navLinks = sidebar.querySelectorAll('.nav-item');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                });
            });
        }
    }
    
    // Count-up animations on KPI values
    setTimeout(() => {
        // Projects count
        const kpiProjects = document.getElementById('kpi-projects');
        if (kpiProjects) animateCountUp(kpiProjects, 47, 1500);
        
        // Completion rate (percentage)
        const kpiCompletion = document.getElementById('kpi-completion');
        if (kpiCompletion) animateCountUp(kpiCompletion, 94.7, 1500, true, '%');
        
        // Goals count
        const kpiGoals = document.getElementById('kpi-goals');
        if (kpiGoals) animateCountUp(kpiGoals, 18, 1500);
        
        // Overdue count
        const kpiOverdue = document.getElementById('kpi-overdue');
        if (kpiOverdue) animateCountUp(kpiOverdue, 9, 1500);
    }, 300);
    
    // Notification button handler
    const notifBtn = document.querySelector('.notification-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            const overdueTasks = document.querySelectorAll('.badge-overdue').length;
            const totalNotifications = overdueTasks + 2; // Added extra notifications
            
            if (overdueTasks > 0) {
                showNotification(`⚠️ لديك ${overdueTasks} مهام متأخرة تحتاج اهتمام فوري`, 'warning');
            } else {
                showNotification('✅ لا توجد مهام متأخرة - كل شيء على الجدول الزمني المخطط', 'success');
            }
        });
    }
    
    // Add event listeners
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 تحديث البيانات';
    refreshBtn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; padding: 12px 20px; background: linear-gradient(135deg, var(--accent), var(--accent-light)); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; z-index: 1000; box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3); transition: all 0.3s ease;';
    
    refreshBtn.addEventListener('mouseenter', () => {
        refreshBtn.style.transform = 'translateY(-4px)';
        refreshBtn.style.boxShadow = '0 8px 20px rgba(26, 188, 156, 0.4)';
    });
    
    refreshBtn.addEventListener('mouseleave', () => {
        refreshBtn.style.transform = 'translateY(0)';
        refreshBtn.style.boxShadow = '0 4px 12px rgba(26, 188, 156, 0.3)';
    });
    
    refreshBtn.addEventListener('click', refreshDataWithLoader);
    document.body.appendChild(refreshBtn);
}

// 7. Countdown Timers for Overdue Tasks
function initCountdownTimers() {
    const overdueBadges = document.querySelectorAll('.badge-overdue');
    let countdownCount = 0;
    
    overdueBadges.forEach((badge, index) => {
        if (countdownCount >= 3) return; // Only top 3
        countdownCount++;
        
        const row = badge.closest('.work-row') || badge.closest('tr');
        if (!row) return;
        
        // Create countdown timer
        const countdown = document.createElement('div');
        countdown.className = 'countdown-timer';
        countdown.style.cssText = `
            display: inline-block;
            margin-right: 8px;
            padding: 4px 8px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            animation: pulse 1s infinite;
        `;
        
        // Set countdown time (24 hours for first, 12 hours for second, 6 hours for third)
        const hours = [24, 12, 6][index] || 24;
        let timeRemaining = hours * 60 * 60; // Convert to seconds
        
        const updateCountdown = () => {
            const h = Math.floor(timeRemaining / 3600);
            const m = Math.floor((timeRemaining % 3600) / 60);
            const s = timeRemaining % 60;
            countdown.textContent = `⏰ ${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            
            if (timeRemaining > 0) {
                timeRemaining--;
            } else {
                countdown.style.animation = 'none';
                showNotification('انتبه! مهمة متأخرة قد انتهت الفترة المخصصة لها', 'error');
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
        
        // Add red highlighting to the row
        row.style.borderLeft = '4px solid #e74c3c';
        row.style.background = 'rgba(231, 76, 60, 0.05)';
        
        // Prepend countdown to row
        const firstCell = row.querySelector('td') || row.querySelector('div');
        if (firstCell) {
            firstCell.insertBefore(countdown, firstCell.firstChild);
        }
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedFeatures);
} else {
    initAdvancedFeatures();
}
