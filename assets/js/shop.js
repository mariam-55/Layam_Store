// البيانات الافتراضية
const defaultData = [
    { id: 1, name: "قميص كلاسيك أبيض", price: 150, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500", desc: "قميص قطني 100% بتصميم عصري يناسب جميع المناسبات الرسمية والكاجوال." },
    { id: 2, name: "حذاء رياضي أسود", price: 280, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500", desc: "حذاء مريح جداً للمشي الطويل، مصمم بتقنية امتصاص الصدمات لتوفير أقصى درجات الراحة." },
    { id: 3, name: "ساعة فاخرة", price: 450, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500", desc: "ساعة يد كلاسيكية فاخرة بقرص من الكريستال المقاوم للخدش وسوار جلدي أصلي." },
    { id: 4, name: "حقيبة جلدية", price: 320, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=500", desc: "حقيبة مصنوعة من الجلد الطبيعي المتين، تحتوي على عدة جيوب لتنظيم أغراضك اليومية بسهولة." }
];

// جلب المنتجات
function getProducts() {
    let stored = localStorage.getItem('products');
    if (!stored || JSON.parse(stored).length === 0) {
        localStorage.setItem('products', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(stored);
}

// عرض المنتجات في الصفحة الرئيسية
async function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-500 font-bold animate-pulse">جاري تحميل المنتجات الفاخرة...</p>
        </div>
    `;

    const products = await new Promise(resolve => {
        setTimeout(() => resolve(getProducts()), 800);
    });

    grid.innerHTML = products.map(p => `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition group relative">
            <button onclick="addToWishlist(${p.id})" class="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-red-600 hover:text-white transition shadow-sm text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <div class="relative h-72 overflow-hidden bg-gray-100 cursor-pointer" onclick="goToDetail(${p.id})">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="${p.name}">
                <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span class="bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">مشاهدة التفاصيل</span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2 truncate">${p.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-red-600 font-black text-2xl">${p.price} <small class="text-xs">ر.س</small></span>
                    <button onclick="addToCart(${p.id})" class="bg-black text-white p-2 rounded-xl hover:bg-red-600 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.goToDetail = (id) => {
    window.location.href = `pages/product-detail.html?id=${id}`;
};

window.addToCart = (id) => {
    const products = getProducts();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = products.find(p => p.id === id);
    if (item) {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`تم إضافة ${item.name} إلى السلة!`);
    }
};

window.addToWishlist = (id) => {
    const products = getProducts();
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = products.find(p => p.id === id);
    if (item && !wishlist.some(w => w.id === id)) {
        wishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`تمت إضافة ${item.name} إلى المفضلة ❤️`);
    } else {
        alert('المنتج موجود بالفعل في المفضلة!');
    }
};

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        countEl.innerText = cart.length;
    }
}

// مؤقت العرض الحصري
function startFlashSaleTimer() {
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');
    if (!hEl) return;

    // تحديد وقت انتهاء العرض (بعد 24 ساعة من الآن كمثال)
    let endTime = localStorage.getItem('saleEndTime');
    if (!endTime) {
        endTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('saleEndTime', endTime);
    }

    const update = () => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
            localStorage.removeItem('saleEndTime');
            hEl.innerText = "00"; mEl.innerText = "00"; sEl.innerText = "00";
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        hEl.innerText = h.toString().padStart(2, '0');
        mEl.innerText = m.toString().padStart(2, '0');
        sEl.innerText = s.toString().padStart(2, '0');
    };

    setInterval(update, 1000);
    update();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    startFlashSaleTimer();
});