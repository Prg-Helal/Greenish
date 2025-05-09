document.addEventListener('DOMContentLoaded', function() {
    
    // تأكد من وجود عنصر العرض
    const container = document.getElementById('products-container');
    if (!container) {
        console.error("Container element not found!");
        return;
    }

    // احصل على معلمة category من URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // بيانات المنتجات (يجب أن تكون في ملف منفصل أو من قاعدة بيانات)
    const products = {
        bottles: [
            {
                id: 'bottle1',
                name: 'Stainless Steel Bottle',
                price: 24.99,
                image: 'images/products/bottles/bottle1.jpg',
                description: 'Premium stainless steel bottle'
            },
            {
                id: 'bottle2',
                name: 'Stainless Steel Bottle',
                price: 19.99,
                image: 'images/products/bottles/bottle2.jpg',
                description: 'Premium stainless steel bottle'
            },
            {
                id: 'bottle3',
                name: 'Stainless Steel Bottle',
                price: 44.99,
                image: 'images/products/bottles/bottle3.jpg',
                description: 'Premium stainless steel bottle'
            }
        ],
        bags: [
            {
                id: 'bag1',
                name: 'Organic Cotton Tote',
                price: 35.99,
                image: 'images/products/bags/bag1.jpg',
                description: 'Eco-friendly tote bag'
            },
            {
                id: 'bag2',
                name: 'Organic Cotton Tote',
                price: 15.99,
                image: 'images/products/bags/bag2.jpg',
                description: 'Eco-friendly tote bag'
            },
            {
                id: 'bag3',
                name: 'Organic Cotton Tote',
                price: 65.99,
                image: 'images/products/bags/bag3.jpg',
                description: 'Eco-friendly tote bag'
            }
        ],
        skincare: [
            {
                id: 'skincare1',
                name: 'Organic Face Cream',
                price: 35.99,
                image: 'images/products/skincare/skincare1.jpg',
                description: 'Eco-friendly tote bag'
            },
            {
                id: 'skincare2',
                name: 'Organic Face Cream',
                price: 15.99,
                image: 'images/products/skincare/skincare2.jpg',
                description: 'Natural face cream with aloe vera and shea butter'
            },
            {
                id: 'skincare3',
                name: 'Organic Face Cream',
                price: 65.99,
                image: 'images/products/skincare/skincare3.jpg',
                description: 'Natural face cream with aloe vera and shea butter'
            }
        ],

    };

    // تحقق من وجود القسم
    if (category && products[category]) {
        document.getElementById('category-title').textContent = 
            category.charAt(0).toUpperCase() + category.slice(1);
        
        // عرض المنتجات
        products[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" 
                    onerror="this.src='images/placeholder.jpg'">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <a href="product.html?id=${product.id}" class="btn btn-primary">
                    View Details
                </a>
            `;
            container.appendChild(productCard);
        });
    } else {
        container.innerHTML = `
            <div class="error-message">
                <p>No products found in this category.</p>
                <a href="categories.html" class="btn btn-primary">
                    Back to Categories
                </a>
            </div>
        `;
    }
});

