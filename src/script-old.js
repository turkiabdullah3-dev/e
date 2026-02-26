// ========== THEME MANAGEMENT ==========
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

// Set theme with null checks
function setTheme(theme) {
    if (!htmlElement) return;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeUI(theme);
}

// Update theme UI
function updateThemeUI(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? 'نهار' : 'ليل';
    }
}

// Theme toggle event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
}

// Initialize theme on load
initTheme();

// ========== CHART CONFIGURATION ==========
const chartConfig = {
    dark: {
        textColor: '#e8eaef',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        accentColor: '#1abc9c',
        accentLight: '#2dd4bf',
        backgroundColor: 'rgba(30, 35, 48, 0.4)',
    },
    light: {
        textColor: '#2c3e50',
        gridColor: 'rgba(0, 0, 0, 0.08)',
        accentColor: '#16a085',
        accentLight: '#1abc9c',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    }
};

function getChartConfig() {
    return htmlElement.getAttribute('data-theme') === 'dark' ? chartConfig.dark : chartConfig.light;
}

// ========== CHART.JS DEFAULTS ==========
function initChartDefaults() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet');
        return;
    }
    Chart.defaults.color = getChartConfig().textColor;
    Chart.defaults.borderColor = getChartConfig().gridColor;
}

// ========== DAILY COMPLETION CHART (Line Chart) ==========
function initDailyCompletionChart() {
    console.log('initDailyCompletionChart called');
    const chartElement = document.getElementById('daily-completion-chart');
    if (!chartElement) {
        console.warn('Daily completion chart element not found');
        return;
    }
    console.log('Chart element found, creating chart...');
    
    // If Chart.js is available, use it
    if (typeof Chart !== 'undefined') {
        const ctx = chartElement.getContext('2d');
        const config = getChartConfig();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'اليوم'],
                datasets: [
                    {
                        label: 'المهام المنجزة',
                        data: [12, 19, 15, 22, 18, 24, 28],
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        borderColor: config.accentColor,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: config.accentColor,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    },
                    {
                        label: 'المهام المخطط لها',
                        data: [15, 20, 18, 20, 20, 25, 30],
                        backgroundColor: 'rgba(100, 116, 139, 0.05)',
                        borderColor: 'rgba(100, 116, 139, 0.6)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(100, 116, 139, 0.6)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: config.textColor,
                            padding: 16,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.datasetIndex === 0) {
                                    const planned = context.raw;
                                    return `نسبة الإنجاز: ${Math.round((planned / 30) * 100)}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 35,
                        grid: {
                            color: config.gridColor,
                        },
                        ticks: {
                            color: config.textColor,
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: config.textColor,
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully');
    } else {
        // Fallback: Simple canvas drawing
        drawSimpleChart(chartElement, [12, 19, 15, 22, 18, 24, 28], 'المهام المنجزة');
    }
}

// ========== PERFORMANCE CHART (Area Chart) ==========
function initPerformanceChart() {
    const chartElement = document.getElementById('performance-chart');
    if (!chartElement) {
        console.warn('Performance chart element not found');
        return;
    }
    
    // If Chart.js is available, use it
    if (typeof Chart !== 'undefined') {
        const ctx = chartElement.getContext('2d');
        const config = getChartConfig();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6', 'الأسبوع 7', 'الأسبوع 8'],
                datasets: [
                    {
                        label: 'منجز',
                        data: [45, 52, 48, 65, 75, 82, 88, 92],
                        borderColor: config.accentColor,
                        backgroundColor: `rgba(26, 188, 156, 0.1)`,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: config.accentColor,
                        pointBorderColor: config.backgroundColor,
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                    {
                        label: 'قيد التنفيذ/متأخر',
                        data: [55, 48, 52, 35, 25, 18, 12, 8],
                        borderColor: '#e67e22',
                        backgroundColor: `rgba(230, 126, 34, 0.1)`,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointBackgroundColor: '#e67e22',
                        pointBorderColor: config.backgroundColor,
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: config.textColor,
                            padding: 16,
                            usePointStyle: true,
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: config.gridColor,
                        },
                        ticks: {
                            color: config.textColor,
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: config.textColor,
                        }
                    }
                }
            }
        });
    } else {
        // Fallback: Simple canvas drawing
        drawSimpleChart(chartElement, [45, 52, 48, 65, 75, 82, 88, 92], 'منحنى الأداء');
    }
}

// ========== QUALITY INDICATOR CHART (Doughnut Chart) ==========
function initQualityChart() {
    const chartElement = document.getElementById('quality-chart');
    if (!chartElement) {
        console.warn('Quality chart element not found');
        return;
    }
    
    // If Chart.js is available, use it
    if (typeof Chart !== 'undefined') {
        const ctx = chartElement.getContext('2d');
        const config = getChartConfig();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['مكتملة من أول مرة'],
                datasets: [
                    {
                        data: [92, 8],
                        backgroundColor: [
                            config.accentColor,
                            config.gridColor,
                        ],
                        borderColor: [config.backgroundColor],
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    } else {
        // Fallback: Simple canvas drawing
        drawSimpleChart(chartElement, [92], 'مؤشر الجودة');
    }
}

// Update charts when theme changes
function updateChartTheme() {
    const config = getChartConfig();
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = config.textColor;
        Chart.defaults.borderColor = config.gridColor;
    }
}

// ========== TAB SWITCHING ==========
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            if (tabId) {
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            }
        });
    });
}

// ========== SEARCH & FILTER ==========
const searchInput = document.querySelector('.search-input');
const filterSelect = document.querySelector('.filter-select');
const workTable = document.querySelector('.work-table tbody');

function filterTable() {
    if (!searchInput || !filterSelect || !workTable) {
        console.warn('Search/Filter elements not found');
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

searchInput.addEventListener('input', filterTable);
filterSelect.addEventListener('change', filterTable);

// ========== NEXT TASK COUNTER ==========
function updateNextTaskCounter() {
    // Wait for elements to be ready
    const nextTaskName = document.getElementById('nextTaskName');
    const counterDays = document.getElementById('counterDays');
    const counterHours = document.getElementById('counterHours');
    const counterMinutes = document.getElementById('counterMinutes');
    const counterSeconds = document.getElementById('counterSeconds');
    const nextTaskDescription = document.getElementById('nextTaskDescription');
    const nextTaskStatus = document.getElementById('nextTaskStatus');

    if (!nextTaskName || !counterDays || !counterHours || !counterMinutes || !counterSeconds) {
        console.warn('Counter elements not found, retrying...');
        setTimeout(updateNextTaskCounter, 100);
        return;
    }

    const rows = document.querySelectorAll('.work-table tbody tr');
    
    if (rows.length === 0) {
        console.warn('Work table rows not found, retrying...');
        setTimeout(updateNextTaskCounter, 100);
        return;
    }

    let nearestTask = null;
    let nearestDate = null;

    // Find the nearest deadline from active/progress tasks
    rows.forEach(row => {
        const statusBadge = row.querySelector('.badge');
        const status = statusBadge?.textContent.trim();
        
        // Only consider active or in-progress tasks
        if (status === 'نشط' || status === 'قيد التنفيذ') {
            const dateCell = row.cells[5]?.textContent.trim(); // Column 6 is the deadline
            if (dateCell) {
                const taskDate = parseDateString(dateCell);
                if (taskDate && taskDate > new Date()) {
                    if (!nearestDate || taskDate < nearestDate) {
                        nearestDate = taskDate;
                        nearestTask = {
                            name: row.cells[0]?.textContent.trim(),
                            project: row.cells[1]?.textContent.trim(),
                            responsible: row.cells[2]?.textContent.trim(),
                            status: status,
                            date: taskDate
                        };
                    }
                }
            }
        }
    });

    // Update counter display
    if (nearestTask) {
        updateCounterDisplay(nearestTask);
        startCountdown(nearestTask.date);
    } else {
        // No upcoming tasks
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
    // Parse date format: "2026-03-15" or similar
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
    // Clear any existing interval
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

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    window.countdownInterval = setInterval(updateTimer, 1000); // Update every second
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
// Charts will be initialized from HTML script tag after Chart.js loads
// This DOMContentLoaded is kept as fallback
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Backup initialization');
    // Only initialize if not already done by HTML script
    if (window.chartsInitialized) {
        console.log('Charts already initialized');
        return;
    }
    
    if (typeof Chart !== 'undefined') {
        window.chartsInitialized = true;
        console.log('Chart.js loaded, initializing charts from DOMContentLoaded...');
        initChartDefaults();
        initDailyCompletionChart();
        initPerformanceChart();
        initQualityChart();
    }
    updateNextTaskCounter();
});

// ========== SIMPLE CHART FALLBACK ==========
function drawSimpleChart(canvas, data, label) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data) + 5;
    
    // Clear canvas
    ctx.fillStyle = getChartConfig().backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = getChartConfig().gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw data points and lines
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = getChartConfig().textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const labels = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'اليوم'];
    labels.forEach((lbl, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        ctx.fillText(lbl, x, height - padding + 20);
    });
    
    // Draw title
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, padding, 20);
}

// ========== NAVIGATION ==========
const navItems = document.querySelectorAll('.nav-item');

if (navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}
