// ========== AUTHENTICATION SYSTEM ==========
// نظام المصادقة لوزارة التعليم

// قاعدة بيانات المستخدمين
const USERS_DB = {
    'aalfayez@moe.gov.sa': {
        name: 'الجوهرة الفايز',
        email: 'aalfayez@moe.gov.sa',
        password: '123456',
        role: 'user'
    }
};

// التحقق من تسجيل الدخول
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname;
    
    // إذا لم يكن مسجل دخول وليس في صفحة تسجيل الدخول
    if (!currentUser && !currentPage.includes('login.html')) {
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser ? JSON.parse(currentUser) : null;
}

// تسجيل الدخول
function login(email, password) {
    const user = USERS_DB[email];
    
    if (!user) {
        return { success: false, message: 'البريد الإلكتروني غير مسجل' };
    }
    
    if (user.password !== password) {
        return { success: false, message: 'كلمة المرور غير صحيحة' };
    }
    
    // حفظ بيانات المستخدم (بدون كلمة المرور)
    const userData = {
        name: user.name,
        email: user.email,
        role: user.role
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, user: userData };
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// الحصول على المستخدم الحالي
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// تحديث واجهة المستخدم في الشريط العلوي
function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    // تحديث اسم المستخدم في الشريط العلوي
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    
    userNameElements.forEach(el => el.textContent = user.name);
    userEmailElements.forEach(el => el.textContent = user.email);
}

// معالج نموذج تسجيل الدخول
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const feedback = document.getElementById('login-feedback');
        
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            const result = login(email, password);
            
            if (result.success) {
                feedback.textContent = 'جاري تحميل لوحة التحكم...';
                feedback.className = 'login-feedback success';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 500);
            } else {
                feedback.textContent = result.message;
                feedback.className = 'login-feedback error';
            }
        });
    });
} else {
    // في جميع الصفحات الأخرى: التحقق من تسجيل الدخول
    document.addEventListener('DOMContentLoaded', () => {
        checkAuth();
        updateUserUI();
        
        // ربط زر تسجيل الخروج
        const profileBtn = document.querySelector('.profile-btn');
        profileBtn?.addEventListener('click', () => {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                logout();
            }
        });
    });
}
