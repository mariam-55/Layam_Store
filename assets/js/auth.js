const myAdminEmail = "admin@layam.com";
const myAdminPass = "Layam@2026";

function login(email, password) {
    if (email === myAdminEmail && password === myAdminPass) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ name: "المدير", email }));
        alert("مرحباً بك في لوحة التحكم");
        // نحن الآن في pages/login.html لذا ننتقل لـ admin.html في نفس المجلد
        window.location.href = "admin.html"; 
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.removeItem('isAdmin');
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert("تم تسجيل الدخول بنجاح");
        window.location.href = "../index.html";
    } else {
        alert("خطأ في بيانات الدخول!");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? 'login.html' : 'pages/login.html';
}

function updateHeader() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const nav = document.getElementById('user-nav-links');
    
    if (nav && user) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isInPages = window.location.pathname.includes('/pages/');
        
        // ضبط المسارات حسب موقع الصفحة الحالية
        const adminPath = isInPages ? 'admin.html' : 'pages/admin.html';

        nav.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-sm font-bold text-gray-600">${user.name}</span>
                ${isAdmin ? `<a href="${adminPath}" class="text-red-600 text-sm font-bold underline">اللوحة</a>` : ''}
                <button onclick="logout()" class="text-gray-400 hover:text-black transition text-sm font-bold">خروج</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login(document.getElementById('email').value, document.getElementById('password').value);
        });
    }
    updateHeader();
});