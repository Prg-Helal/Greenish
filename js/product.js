// Product data (consistent with cart.js)
const productsData = {
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
            description: 'Natural face cream with aloe vera and shea butter'
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
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Quantity buttons
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('product-quantity');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', () => {
            quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
        });

        plusBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
    }

    // Load product details
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError('Product ID is missing in the URL');
        return;
    }

    let product = null;
    for (const category in productsData) {
        product = productsData[category].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        displayProduct(product);
        updateBreadcrumbs(product);
    } else {
        showError('Product not found');
    }
});

function displayProduct(product) {
    // Update main image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    // Update product info
    const productInfo = document.querySelector('.product-info');
    if (productInfo) {
        productInfo.querySelector('h1').textContent = product.name;
        productInfo.querySelector('.price').textContent = `$${product.price.toFixed(2)}`;
        productInfo.querySelector('.product-description p').textContent = product.description;
    }

    // Update details tab
    const detailsTab = document.getElementById('details-tab');
    if (detailsTab) {
        detailsTab.querySelector('p').textContent = product.description || 'No additional details available.';
    }

    // Update Add to Cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-id', product.id);
    }
}

function showError(message) {
    const container = document.querySelector('.product-details') || document.body;
    container.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem;">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="categories.html" class="btn btn-primary">Back to Categories</a>
        </div>
    `;
}

function updateBreadcrumbs(product) {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    breadcrumbs.innerHTML = `
        <a href="index.html">Home</a> > 
        <a href="categories.html">Categories</a> > 
        <a href="products.html?category=${getProductCategory(product.id)}">${getCategoryName(product.id)}</a> > 
        <span>${product.name}</span>
    `;
}

function getProductCategory(productId) {
    if (productId.includes('bottle')) return 'bottles';
    if (productId.includes('bag')) return 'bags';
    if (productId.includes('skincare')) return 'skincare';
    return 'all';
}

function getCategoryName(productId) {
    if (productId.includes('bottle')) return 'Reusable Bottles';
    if (productId.includes('bag')) return 'Eco Bags';
    if (productId.includes('skincare')) return 'Natural Skincare';
    return 'All Products';
}

function showFeedbackMessage(message, isError = false) {
    const messageBox = document.createElement('div');
    messageBox.className = `feedback-message ${isError ? 'error' : 'success'}`;
    messageBox.textContent = message;

    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.classList.add('fade-out');
        setTimeout(() => messageBox.remove(), 500);
    }, 3000);
}