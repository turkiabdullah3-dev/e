/**
 * نظام ربط البيانات الديناميكي
 * Dynamic Data Binding System
 * يربط البيانات من config.js مع جميع صفحات الموقع
 */

class DataBinding {
    constructor() {
        this.config = window.DashboardConfig || {};
        this.currentPage = this.detectPage();
        this.init();
    }

    init() {
        console.log('🔗 نظام ربط البيانات جاهز');
        this.bindAllData();
        this.setupAutoRefresh();
    }

    detectPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path.endsWith('مشاريع٤/')) return 'dashboard';
        if (path.includes('tasks.html')) return 'tasks';
        if (path.includes('goals.html')) return 'goals';
        if (path.includes('projects.html')) return 'projects';
        if (path.includes('team.html')) return 'team';
        if (path.includes('reports.html')) return 'reports';
        if (path.includes('performance.html')) return 'performance';
        if (path.includes('charts.html')) return 'charts';
        return 'dashboard';
    }

    bindAllData() {
        // ربط بيانات عامة لجميع الصفحات
        this.bindAppInfo();
        
        // ربط بيانات خاصة بكل صفحة
        switch(this.currentPage) {
            case 'dashboard':
                this.bindDashboardData();
                break;
            case 'tasks':
                this.bindTasksData();
                break;
            case 'goals':
                this.bindGoalsData();
                break;
            case 'projects':
                this.bindProjectsData();
                break;
            case 'performance':
                this.bindPerformanceData();
                break;
            case 'charts':
                this.bindChartsData();
                break;
        }

        console.log(`✅ تم ربط بيانات صفحة: ${this.currentPage}`);
    }

    bindAppInfo() {
        // ربط معلومات التطبيق في الهيدر
        const appName = document.querySelector('[data-bind="app-name"]');
        const appSubtitle = document.querySelector('[data-bind="app-subtitle"]');
        
        if (appName) appName.textContent = this.config.app?.name || 'إدارة الأداء الوظيفي';
        if (appSubtitle) appSubtitle.textContent = this.config.app?.subtitle || 'لوحة التحكم';
    }

    bindDashboardData() {
        // ربط بطاقات KPI
        this.bindKPICards();
        
        // ربط جدول المهام
        this.bindTasksTable();
        
        // ربط التحديثات الأخيرة
        this.bindUpdates();
        
        // عرض شريط تنبيه المهام المتأخرة
        this.showOverdueAlert();
    }

    bindKPICards() {
        const cards = this.config.kpiCards || [];
        
        cards.forEach((card, index) => {
            const cardElement = document.querySelector(`[data-kpi="${card.id}"]`);
            if (cardElement) {
                const valueEl = cardElement.querySelector('.kpi-value');
                const labelEl = cardElement.querySelector('.kpi-label');
                const changeEl = cardElement.querySelector('.kpi-change');
                const progressEl = cardElement.querySelector('.kpi-progress');
                
                if (valueEl) valueEl.textContent = this.formatNumber(card.value);
                if (labelEl) labelEl.textContent = card.label;
                if (changeEl) {
                    changeEl.textContent = card.change > 0 ? `+${card.change}%` : `${card.change}%`;
                    changeEl.className = card.change > 0 ? 'kpi-change positive' : 'kpi-change negative';
                }
                if (progressEl) {
                    const progressBar = progressEl.querySelector('.progress-bar');
                    if (progressBar) progressBar.style.width = `${card.progress}%`;
                }
            }
        });
    }

    bindTasksData() {
        const tasks = this.config.tasks || [];
        const tbody = document.querySelector('[data-bind="tasks-tbody"]');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        tasks.forEach(task => {
            const row = this.createTaskRow(task);
            tbody.appendChild(row);
        });
    }

    bindTasksTable() {
        const tasks = (this.config.tasks || []).slice(0, 5); // أول 5 مهام
        const tbody = document.querySelector('[data-bind="dashboard-tasks-tbody"]');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        tasks.forEach(task => {
            const row = this.createTaskRow(task);
            tbody.appendChild(row);
        });
    }

    createTaskRow(task) {
        const row = document.createElement('tr');
        const statusInfo = this.config.statuses[task.status] || this.config.statuses.active;
        const isOverdue = task.status === 'overdue';
        
        // إضافة كلاس خاص للمهام المتأخرة
        if (isOverdue) {
            row.classList.add('overdue-task-row');
        }
        
        row.innerHTML = `
            <td>
                <strong>${task.name}</strong>
                <div class="task-project">${task.project}</div>
            </td>
            <td>${task.assignee}</td>
            <td>
                <span class="badge ${statusInfo.class}">${statusInfo.label}</span>
            </td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${task.progress}%"></div>
                    <span class="progress-text">${task.progress}%</span>
                </div>
            </td>
            <td class="task-date">${this.formatDate(task.dueDate)}</td>
        `;
        
        return row;
    }

    bindGoalsData() {
        const goals = this.config.goals || [];
        const tbody = document.querySelector('[data-bind="goals-tbody"]');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        goals.forEach(goal => {
            const row = this.createGoalRow(goal);
            tbody.appendChild(row);
        });
    }

    createGoalRow(goal) {
        const row = document.createElement('tr');
        const statusInfo = this.config.statuses[goal.status] || this.config.statuses.active;
        
        row.innerHTML = `
            <td><strong>${goal.name}</strong></td>
            <td>${goal.duration}</td>
            <td>${goal.owner}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${goal.progress}%"></div>
                    <span class="progress-text">${goal.progress}%</span>
                </div>
            </td>
            <td>
                <span class="badge ${statusInfo.class}">${statusInfo.label}</span>
            </td>
        `;
        
        return row;
    }

    bindProjectsData() {
        const projects = this.config.projects || [];
        const tbody = document.querySelector('[data-bind="projects-tbody"]');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        projects.forEach(project => {
            const row = this.createProjectRow(project);
            tbody.appendChild(row);
        });
    }

    createProjectRow(project) {
        const row = document.createElement('tr');
        const statusInfo = this.config.statuses[project.status] || this.config.statuses.active;
        
        row.innerHTML = `
            <td><strong>${project.name}</strong></td>
            <td>${project.team}</td>
            <td>${project.owner}</td>
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${project.progress}%"></div>
                    <span class="progress-text">${project.progress}%</span>
                </div>
            </td>
            <td>
                <span class="badge ${statusInfo.class}">${statusInfo.label}</span>
            </td>
            <td class="task-date">${this.formatDate(project.dueDate)}</td>
        `;
        
        return row;
    }

    bindUpdates() {
        const updates = this.config.updates || [];
        const container = document.querySelector('[data-bind="updates-list"]');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        updates.forEach(update => {
            const item = this.createUpdateItem(update);
            container.appendChild(item);
        });
    }

    createUpdateItem(update) {
        const div = document.createElement('div');
        div.className = 'update-item';
        const statusInfo = this.config.statuses[update.status] || this.config.statuses.active;
        
        div.innerHTML = `
            <div class="update-content">
                <span class="update-task">${update.task}</span>
                <span class="badge ${statusInfo.class} badge-small">${statusInfo.label}</span>
            </div>
            <div class="update-date">${update.date}</div>
        `;
        
        return div;
    }

    bindPerformanceData() {
        // ربط بيانات صفحة الأداء
        const qualityEl = document.querySelector('[data-bind="quality-percentage"]');
        if (qualityEl && this.config.charts?.quality) {
            qualityEl.textContent = `${this.config.charts.quality.percentage}%`;
        }
    }

    bindChartsData() {
        // البيانات جاهزة في config.charts
        // سيتم استخدامها مباشرة من قبل مكتبة الرسوم البيانية
        console.log('📊 بيانات الرسوم البيانية جاهزة من config.js');
    }

    // وظائف مساعدة
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return `متأخر ${Math.abs(diffDays)} يوم`;
        if (diffDays === 0) return 'اليوم';
        if (diffDays === 1) return 'غداً';
        if (diffDays <= 7) return `بعد ${diffDays} أيام`;
        
        return dateString;
    }

    setupAutoRefresh() {
        // تحديث البيانات تلقائياً كل 30 ثانية
        setInterval(() => {
            this.bindAllData();
            console.log('🔄 تم تحديث البيانات تلقائياً');
        }, 30000);
    }

    // عرض شريط تنبيه المهام المتأخرة
    showOverdueAlert() {
        const tasks = this.config.tasks || [];
        const overdueTasks = tasks.filter(task => task.status === 'overdue');
        const alertBar = document.getElementById('overdue-alert');
        const countEl = document.getElementById('overdue-count');
        
        if (overdueTasks.length > 0 && alertBar) {
            countEl.textContent = overdueTasks.length;
            alertBar.style.display = 'block';
            console.log(`⚠️ ${overdueTasks.length} مهام متأخرة`);
        } else if (alertBar) {
            alertBar.style.display = 'none';
        }
    }

    // API لتحديث البيانات يدوياً
    refresh() {
        this.bindAllData();
    }

    // API للحصول على بيانات محددة
    getData(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    // API لتحديث بيانات محددة
    updateData(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.config);
        
        if (target) {
            target[lastKey] = value;
            this.bindAllData();
        }
    }
}

// تهيئة نظام ربط البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.dataBinding = new DataBinding();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataBinding;
}
