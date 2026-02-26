/**
 * Dashboard Configuration File
 * وزارة التعليم - لوحة التحكم
 * Ministry of Education - Dashboard Config
 */

const DashboardConfig = {
    // ========== APPLICATION SETTINGS ==========
    app: {
        name: 'إدارة الأداء الوظيفي',
        subtitle: 'لوحة التحكم',
        version: '1.0.0',
        lastUpdated: '2026-02-24',
    },

    // ========== THEME CONFIGURATION ==========
    themes: {
        dark: {
            bg: '#0f1419',
            bgSecondary: '#1a1f2e',
            card: 'rgba(30, 35, 48, 0.4)',
            text: '#e8eaef',
            textMuted: '#a0a4b0',
            accent: '#1abc9c',
            accentLight: '#2dd4bf',
            accentGlow: 'rgba(26, 188, 156, 0.2)',
            border: 'rgba(255, 255, 255, 0.1)',
            glow: '0 0 20px rgba(26, 188, 156, 0.15)',
            success: '#27ae60',
            warning: '#e67e22',
            danger: '#e74c3c',
            info: '#3498db',
        },
        light: {
            bg: '#f5f6fa',
            bgSecondary: '#ffffff',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#2c3e50',
            textMuted: '#7f8c8d',
            accent: '#16a085',
            accentLight: '#1abc9c',
            accentGlow: 'rgba(22, 160, 133, 0.1)',
            border: 'rgba(0, 0, 0, 0.08)',
            glow: 'none',
            success: '#27ae60',
            warning: '#e67e22',
            danger: '#c0392b',
            info: '#2980b9',
        }
    },

    // ========== NAVIGATION ITEMS ==========
    navigation: [
        {
            icon: '',
            label: 'لوحة التحكم',
            href: '#dashboard',
            id: 'dashboard'
        },
        {
            icon: '',
            label: 'المهام',
            href: '#tasks',
            id: 'tasks'
        },
        {
            icon: '',
            label: 'الأهداف',
            href: '#goals',
            id: 'goals'
        },
        {
            icon: '',
            label: 'المشاريع',
            href: '#projects',
            id: 'projects'
        },
        {
            icon: '',
            label: 'الفريق',
            href: '#team',
            id: 'team'
        },
        {
            icon: '',
            label: 'التقارير',
            href: '#reports',
            id: 'reports'
        },
        {
            icon: '',
            label: 'الإعدادات',
            href: '#settings',
            id: 'settings'
        }
    ],

    // ========== KPI CARDS DATA ==========
    kpiCards: [
        {
            id: 'projects',
            label: 'إجمالي المشاريع',
            value: 47,
            change: 12,
            progress: 78,
            ringColor: 'accent'
        },
        {
            id: 'goals',
            label: 'الأهداف النشطة',
            value: 23,
            change: 8,
            progress: 85,
            ringColor: 'accent'
        },
        {
            id: 'tasks',
            label: 'مهام هذا الأسبوع',
            value: 156,
            change: 15,
            progress: 62,
            ringColor: 'accent'
        },
        {
            id: 'overdue',
            label: 'المتأخر',
            value: 9,
            change: -3,
            progress: 15,
            ringColor: 'warning'
        }
    ],

    // ========== CHART DATA ==========
    charts: {
        daily: {
            labels: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            data: [8, 12, 15, 10, 18, 14, 20]
        },
        performance: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6', 'الأسبوع 7', 'الأسبوع 8'],
            completed: [45, 52, 48, 65, 75, 82, 88, 92],
            inProgress: [55, 48, 52, 35, 25, 18, 12, 8]
        },
        quality: {
            percentage: 92
        }
    },

    // ========== HEATMAP CONFIGURATION ==========
    heatmap: {
        days: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        departments: ['القسم 1', 'القسم 2', 'القسم 3', 'القسم 4'],
        data: [
            [0.8, 0.6, 0.9, 0.4, 0.7, 0.5],
            [0.5, 0.7, 0.3, 0.8, 0.4, 0.6],
            [0.6, 0.4, 0.7, 0.5, 0.9, 0.3],
            [0.7, 0.8, 0.4, 0.6, 0.5, 0.8],
        ]
    },

    // ========== STATUS BADGES ==========
    statuses: {
        active: {
            label: 'نشط',
            color: 'accent',
            class: 'badge-active'
        },
        progress: {
            label: 'قيد التنفيذ',
            color: 'info',
            class: 'badge-progress'
        },
        done: {
            label: 'مكتملة',
            color: 'success',
            class: 'badge-done'
        },
        overdue: {
            label: 'متأخر',
            color: 'warning',
            class: 'badge-overdue'
        },
        blocked: {
            label: 'مسدود',
            color: 'danger',
            class: 'badge-blocked'
        }
    },

    // ========== DUMMY DATA FOR TABLES ==========
    tasks: [
        {
            name: 'تطوير الواجهة الأمامية',
            project: 'نظام الإدارة',
            assignee: 'الجوهرة الفايز',
            status: 'progress',
            progress: 75,
            dueDate: '2026-02-28'
        },
        {
            name: 'اختبار قاعدة البيانات',
            project: 'نظام الإدارة',
            assignee: 'نورة العتيبي',
            status: 'done',
            progress: 100,
            dueDate: '2026-02-24'
        },
        {
            name: 'توثيق الـ API',
            project: 'نظام الإدارة',
            assignee: 'الجوهرة الفايز',
            status: 'overdue',
            progress: 45,
            dueDate: '2026-02-15'
        },
        {
            name: 'تحسين الأداء',
            project: 'التحسين المستمر',
            assignee: 'نورة العتيبي',
            status: 'active',
            progress: 30,
            dueDate: '2026-03-10'
        },
        {
            name: 'إعداد الاختبارات',
            project: 'ضمان الجودة',
            assignee: 'الجوهرة الفايز',
            status: 'progress',
            progress: 60,
            dueDate: '2026-03-05'
        },
        {
            name: 'مراجعة الأمان',
            project: 'نظام الإدارة',
            assignee: 'نورة العتيبي',
            status: 'blocked',
            progress: 20,
            dueDate: '2026-02-26'
        },
        {
            name: 'دعم المستخدمين',
            project: 'التدريب',
            assignee: 'الجوهرة الفايز',
            status: 'done',
            progress: 100,
            dueDate: '2026-02-20'
        }
    ],

    goals: [
        {
            name: 'تحسين رضا الموظفين',
            duration: 'ربع سنة',
            owner: 'الجوهرة الفايز',
            progress: 85,
            status: 'progress',
            dueDate: '2026-03-31'
        },
        {
            name: 'زيادة الإنتاجية',
            duration: 'ربع سنة',
            owner: 'نورة العتيبي',
            progress: 70,
            status: 'active',
            dueDate: '2026-03-31'
        }
    ],

    projects: [
        {
            name: 'نظام الإدارة الجديد',
            team: 'الجوهرة الفايز، نورة العتيبي',
            owner: 'الجوهرة الفايز',
            progress: 65,
            status: 'progress',
            dueDate: '2026-04-30'
        },
        {
            name: 'تطبيق الجوال',
            team: 'الجوهرة الفايز، نورة العتيبي',
            owner: 'نورة العتيبي',
            progress: 40,
            status: 'active',
            dueDate: '2026-05-15'
        }
    ],

    updates: [
        {
            task: 'تطوير الواجهة - الجوهرة الفايز',
            status: 'done',
            date: 'اليوم'
        },
        {
            task: 'اختبار قاعدة البيانات - نورة العتيبي',
            status: 'progress',
            date: 'أمس'
        },
        {
            task: 'توثيق الـ API - الجوهرة الفايز',
            status: 'overdue',
            date: 'منذ يومين'
        },
        {
            task: 'تحسين الأداء - نورة العتيبي',
            status: 'blocked',
            date: 'منذ 3 أيام'
        },
        {
            task: 'إعداد الاختبارات - الجوهرة الفايز',
            status: 'active',
            date: 'منذ أسبوع'
        }
    ],

    // ========== QUALITY METRICS ==========
    qualityMetrics: {
        rework: '5.2%',
        approvalTime: '1.3 يوم',
        firstTimeOk: '94.8%'
    },

    // ========== UI SETTINGS ==========
    ui: {
        sidebarWidth: '280px',
        cardRadius: '16px',
        borderRadius: '10px',
        animationDuration: '0.3s',
        transitionEasing: 'ease'
    },

    // ========== API ENDPOINTS (Future) ==========
    api: {
        baseUrl: 'https://api.ministry.edu/api',
        timeout: 5000,
        retryAttempts: 3
    }
};

// Export for use in scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardConfig;
}
