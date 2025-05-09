// بيانات المنتجات (يجب أن تكون متطابقة مع بياناتك الفعلية)
const allProducts = [
    { id: 'bottle1', name: 'Stainless Steel Bottle', category: 'bottles', image: 'images/products/bottles/bottle1.jpg' },
    { id: 'bottle2', name: 'Glass Water Bottle', category: 'bottles', image: 'images/products/bottles/bottle2.jpg' },
    { id: 'bag1', name: 'Organic Cotton Tote', category: 'bags', image: 'images/products/bags/bag1.jpg' },
    { id: 'skincare1', name: 'Organic Face Cream', category: 'skincare', image: 'images/products/skincare/skincare1.jpg' }
];

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!searchInput) return;

    // تفعيل الاقتراحات عند الكتابة
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        showSuggestions(query);
    });

    // تفعيل البحث عند الضغط على Enter
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value.trim());
        }
    });

    // تفعيل البحث عند النقر على زر البحث
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value.trim());
    });

    // إخفاء الاقتراحات عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });

    function showSuggestions(query) {
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const results = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        ).slice(0, 5); // عرض أول 5 نتائج فقط

        displaySuggestions(results);
    }

    function displaySuggestions(results) {
        suggestionsContainer.innerHTML = '';

        if (results.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="search-suggestion-item">
                    No products found
                </div>
            `;
            suggestionsContainer.style.display = 'block';
            return;
        }

        results.forEach(product => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'search-suggestion-item';
            suggestionItem.dataset.id = product.id;
            suggestionItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="40">
                <div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${getCategoryName(product.category)}</div>
                </div>
            `;
            
            // عند النقر على الاقتراح
            suggestionItem.addEventListener('click', function() {
                window.location.href = `product.html?id=${product.id}`;
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });

        suggestionsContainer.style.display = 'block';
    }

    function performSearch(query) {
        if (query.length < 1) return;
        localStorage.setItem('searchQuery', query);
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }

    function getCategoryName(category) {
        const categoryNames = {
            bottles: 'Reusable Bottles',
            bags: 'Eco Bags',
            skincare: 'Natural Skincare'
        };
        return categoryNames[category] || 'All Products';
    }
});