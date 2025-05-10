/**
 * Main JavaScript file for Greenish e-commerce website
 * Handles common functionality across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Update cart count on all pages
    updateCartCount();
    
    // Login modal functionality
    const accountLink = document.getElementById('account-link');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (accountLink && loginModal) {
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal && e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
    
    // Check if user is logged in
    checkLoginStatus();
});

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Check if user is logged in and update UI
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const accountLink = document.getElementById('account-link');
    const linksContainer = document.getElementById('logout');
    const cartLink = document.getElementById('cart-link');
    
    if (loggedInUser && accountLink) {
        const user = JSON.parse(loggedInUser);
        accountLink.textContent = `Hi, ${user.firstName}`;
        
        // إضافة زر الخروج
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.id = 'logout-btn';
        logoutBtn.style.marginLeft = '10px';
        logoutBtn.style.color = '#dc3545';
        
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
        
        // accountLink.parentNode.insertBefore(logoutBtn, accountLink.nextSibling);
        cartLink.append(accountLink)
        linksContainer.appendChild(logoutBtn)
        // تحديث الروابط بعد تسجيل الدخول
        updateNavLinks();
    }
}

// Simple page transition
document.querySelectorAll('a').forEach(link => {
    if (link.href && !link.href.startsWith('javascript:') && 
        !link.href.startsWith('mailto:') && 
        !link.href.startsWith('tel:') &&
        link.hostname === window.location.hostname) {
        link.addEventListener('click', function(e) {
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                document.body.classList.add('page-transition');
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    }
});
// Add this to main.js to handle 404 errors
window.addEventListener('DOMContentLoaded', function() {
    // Check if current page is 404.html but the path exists in our pages
    if (window.location.pathname.includes('404.html')) {
        const validPages = [
            'index.html', 'signup.html', 'about.html', 
            'contact.html', 'categories.html', 'product.html', 
            'cart.html', 'account.html', 'reset-password.html'
        ];
        
        const currentPath = window.location.pathname.split('/').pop();
        if (validPages.includes(currentPath)) {
            window.location.href = currentPath;
        }
    }
});
// إضافة وظيفة البحث
const searchForm = document.querySelector('.search-bar');
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = this.querySelector('input').value.trim();
        if (query) {
            localStorage.setItem('searchQuery', query);
            window.location.href = 'products.html?search=' + encodeURIComponent(query);
        }
    });
}
// في نهاية ملف main.js
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        e.preventDefault();
        const itemId = e.target.closest('.cart-item').getAttribute('data-id');
        
        // إزالة المنتج من السلة
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // إعادة تحميل السلة
        displayCartItems();
        updateCartCount();
        
        // إظهار رسالة تأكيد
        showFeedbackMessage('Product removed from cart');
    }
});