/**
 * Shopping cart functionality for Greenish
 * Handles cart operations using localStorage
 */

// Debounce function to prevent multiple rapid clicks
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart count on page load
    updateCartCount();

    // Add to cart buttons (single event listener for all buttons)
    const handleAddToCart = debounce(function(event) {
        const button = event.target.closest('.add-to-cart');
        if (!button) return;

        const productId = button.getAttribute('data-id');
        // Check for quantity input in product.html or products.html
        const quantityInput = document.getElementById('product-quantity') || 
                             button.closest('.product-card')?.querySelector('.product-quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

        if (!productId) {
            console.error('Product ID is missing from button');
            showFeedbackMessage('Error: Product ID missing', true);
            return;
        }

        addToCart(productId, quantity);
    }, 300);

    // Attach event listener to document for all .add-to-cart buttons
    document.addEventListener('click', handleAddToCart);

    // Display cart items on cart page
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    // Handle quantity changes in cart
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.quantity-btn');
        if (!button) return;

        const itemId = button.closest('.cart-item').getAttribute('data-id');
        const isPlus = button.classList.contains('plus');
        updateQuantity(itemId, isPlus);
    });

    // Handle quantity input changes in cart
    document.addEventListener('change', function(event) {
        const input = event.target.closest('.cart-item input[type="number"]');
        if (!input) return;

        const itemId = input.closest('.cart-item').getAttribute('data-id');
        updateQuantity(itemId, null, parseInt(input.value));
    });

    // Handle remove item buttons
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.remove-item');
        if (!button) return;

        const itemId = button.closest('.cart-item').getAttribute('data-id');
        removeFromCart(itemId);
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart.length > 0) {
                document.getElementById('checkout-modal').style.display = 'flex';
            }
        });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            completeOrder();
        });
    }

    // Close checkout modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('checkout-modal').style.display = 'none';
        });
    }
});

// Product data (consistent with index.html, product.html, cart.html, products.html)
const products = {
    // Products from products.html and product.html
    'bottle1': {
        id: 'bottle1',
        name: 'Stainless Steel Bottle',
        price: 24.99,
        image: 'images/products/bottles/bottle1.jpg'
    },
    'bottle2': {
        id: 'bottle2',
        name: 'Stainless Steel Bottle',
        price: 19.99,
        image: 'images/products/bottles/bottle2.jpg'
    },
    'bottle3': {
        id: 'bottle3',
        name: 'Stainless Steel Bottle',
        price: 44.99,
        image: 'images/products/bottles/bottle3.jpg'
    },
    'bag1': {
        id: 'bag1',
        name: 'Organic Cotton Tote',
        price: 35.99,
        image: 'images/products/bags/bag1.jpg'
    },
    'bag2': {
        id: 'bag2',
        name: 'Organic Cotton Tote',
        price: 15.99,
        image: 'images/products/bags/bag2.jpg'
    },
    'bag3': {
        id: 'bag3',
        name: 'Organic Cotton Tote',
        price: 65.99,
        image: 'images/products/bags/bag3.jpg'
    },
    'skincare1': {
        id: 'skincare1',
        name: 'Organic Face Cream',
        price: 35.99,
        image: 'images/products/skincare/skincare1.jpg'
    },
    'skincare2': {
        id: 'skincare2',
        name: 'Organic Face Cream',
        price: 15.99,
        image: 'images/products/skincare/skincare2.jpg'
    },
    'skincare3': {
        id: 'skincare3',
        name: 'Organic Face Cream',
        price: 65.99,
        image: 'images/products/skincare/skincare3.jpg'
    },
    // Products from index.html and cart.html ("You Might Also Like")
    '1': {
        id: '1',
        name: 'Reusable Water Bottle',
        price: 24.99,
        image: 'images/products/bottles/bottle2.jpg'
    },
    '2': {
        id: '2',
        name: 'Sustainable Tote Bag',
        price: 19.99,
        image: 'images/products/bags/bag1.jpg'
    },
    '3': {
        id: '3',
        name: 'Organic Skincare Set',
        price: 34.99,
        image: 'images/products/skincare/skincare1.jpg'
    },
    '4': {
        id: '4',
        name: 'Reusable Coffee Cup',
        price: 22.99,
        image: 'images/products/bags/bag1.jpg'
    }
};

function addToCart(productId, quantity = 1) {
    try {
        console.log('[Debug] Adding to cart:', productId, 'Qty:', quantity);

        if (!productId || !quantity || quantity < 1) {
            throw new Error('Invalid product ID or quantity');
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = products[productId];

        if (!product) {
            throw new Error('Product not found in database');
        }

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('[Debug] Updated Cart:', cart);

        showFeedbackMessage(`${product.name} added to cart!`);
        updateCartCount();

        // Add pulse animation to cart link
        const cartLink = document.querySelector('.cart-link');
        if (cartLink) {
            cartLink.classList.add('pulse');
            setTimeout(() => cartLink.classList.remove('pulse'), 1000);
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        showFeedbackMessage('Failed to add item. Please try again.', true);
    }
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = cartItemsContainer.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        updateCartSummary();
        return;
    }

    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;

    // Clear existing items
    cartItemsContainer.querySelectorAll('.cart-item').forEach(item => item.remove());

    // Add each item to the cart
    cart.forEach(item => {
        // Use item data directly from cart to avoid dependency on products object
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);

        // Fallback image if item.image is missing or invalid
        const imageSrc = item.image || 'images/placeholder.jpg';

        cartItem.innerHTML = `
            <img src="${imageSrc}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <span class="remove-item">Remove</span>
                </div>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners to new elements
    // document.querySelectorAll('.quantity-btn').forEach(button => {
    //     button.addEventListener('click', function() {
    //         const itemId = this.closest('.cart-item').getAttribute('data-id');
    //         const isPlus = this.classList.contains('plus');
    //         updateQuantity(itemId, isPlus);
    //     });
    // });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.cart-item').getAttribute('data-id');
            removeFromCart(itemId);
        });
    });

    updateCartSummary();
}

function updateQuantity(itemId, isPlus = null, newQuantity = null) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === itemId);

    if (!item) return;

    if (newQuantity !== null && newQuantity >= 1) {
        item.quantity = newQuantity;
    } else if (isPlus) {
        item.quantity++;
    } else {
        item.quantity = Math.max(1, item.quantity - 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    
    // تصفية المصفوفة لإزالة المنتج المطلوب
    cart = cart.filter(item => item.id !== itemId);
    
    // حفظ السلة المحدثة
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // إعادة عرض السلة
    displayCartItems();
    
    // تحديث العداد
    updateCartCount();
    
    // إظهار رسالة تأكيد
    showFeedbackMessage('Product removed from cart');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = total;
    });
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

    const freeShippingNote = document.querySelector('.free-shipping-note');
    if (freeShippingNote) {
        if (subtotal >= 50) {
            freeShippingNote.innerHTML = '<strong>You\'ve qualified for free shipping!</strong>';
        } else {
            const amountNeeded = (50 - subtotal).toFixed(2);
            freeShippingNote.textContent = `Add $${amountNeeded} more to qualify for free shipping`;
        }
    }
}

function completeOrder() {
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const address = document.getElementById('checkout-address').value;
    const paymentMethod = document.getElementById('checkout-payment').value;

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: { name, email, address },
        paymentMethod,
        items: JSON.parse(localStorage.getItem('cart')),
        total: document.getElementById('cart-total').textContent
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();

    document.getElementById('checkout-modal').style.display = 'none';
    document.getElementById('order-confirmation').style.display = 'flex';

    const confirmation = document.querySelector('.confirmation-container');
    confirmation.innerHTML = `
        <h2>Thank You for Your Order, ${name}!</h2>
        <p>Your order #${order.id} has been placed successfully.</p>
        <p>A confirmation has been sent to ${email}.</p>
        <p>Total: ${order.total}</p>
        <a href="index.html" class="btn btn-primary">Continue Shopping</a>
    `;
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
// إضافة هذه الدالة لعرض تأكيد إضافة المنتج للسلة
function showAddToCartFeedback(productName) {
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    feedback.innerHTML = `
        <div class="cart-feedback-content">
            <p>${productName} added to cart!</p>
            <a href="cart.html" class="btn btn-small">View Cart</a>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 500);
    }, 3000);
}