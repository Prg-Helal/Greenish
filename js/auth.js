 /**
 * Authentication functionality for Greenish
 * Handles login and signup processes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
});

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save logged in user
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        // Close modal and reload page
        document.getElementById('login-modal').style.display = 'none';
        window.location.reload();
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function handleSignup() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    const country = document.getElementById('country').value;
    const address = document.getElementById('address').value;
    
    // Simple validation
    if (password !== repeatPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);
    
    if (emailExists) {
        alert('Email already exists. Please use a different email.');
        return;
    }
    
    // Create new user
    const newUser = {
        firstName,
        lastName,
        email,
        password,
        country,
        address
    };
    
 // Add new user to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in the new user
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    
    // Redirect to home page
    window.location.href = 'index.html';
}

/**
 * Form validation for signup page
 */
function setupFormValidation() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    // Validate first name
    const firstNameInput = document.getElementById('first-name');
    firstNameInput.addEventListener('blur', function() {
        if (this.value.trim().length < 2) {
            showError(this, 'First name must be at least 2 characters');
        } else {
            clearError(this);
        }
    });

    // Validate last name
    const lastNameInput = document.getElementById('last-name');
    lastNameInput.addEventListener('blur', function() {
        if (this.value.trim().length < 2) {
            showError(this, 'Last name must be at least 2 characters');
        } else {
            clearError(this);
        }
    });

    // Validate email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });

    // Validate password
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('blur', function() {
        if (this.value.length < 6) {
            showError(this, 'Password must be at least 6 characters');
        } else {
            clearError(this);
        }
    });

    // Validate password match
    const repeatPasswordInput = document.getElementById('repeat-password');
    repeatPasswordInput.addEventListener('blur', function() {
        if (this.value !== passwordInput.value) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });

    // Validate country
    const countryInput = document.getElementById('country');
    countryInput.addEventListener('change', function() {
        if (this.value === '') {
            showError(this, 'Please select a country');
        } else {
            clearError(this);
        }
    });

    // Validate address
    const addressInput = document.getElementById('address');
    addressInput.addEventListener('blur', function() {
        if (this.value.trim().length < 10) {
            showError(this, 'Address must be at least 10 characters');
        } else {
            clearError(this);
        }
    });

    // Validate terms checkbox
    const termsInput = document.getElementById('terms');
    termsInput.addEventListener('change', function() {
        if (!this.checked) {
            showError(this, 'You must agree to the terms and conditions');
        } else {
            clearError(this);
        }
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
    
    // Enhanced signup form submission with validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before submission
            let isValid = true;
            const requiredFields = [
                'first-name', 'last-name', 'email', 
                'password', 'repeat-password', 'country', 'address'
            ];
            
            requiredFields.forEach(fieldId => {
                const input = document.getElementById(fieldId);
                if (input.value.trim() === '') {
                    showError(input, 'This field is required');
                    isValid = false;
                }
            });
            
            const termsChecked = document.getElementById('terms').checked;
            if (!termsChecked) {
                showError(document.getElementById('terms'), 'You must agree to the terms and conditions');
                isValid = false;
            }
            
            if (isValid) {
                handleSignup();
            }
        });
    }
});
function updateNavLinks() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const signupLink = document.querySelector('a[href="signup.html"]');
    const loginLink = document.querySelector('a[href="index.html"]');
    
    if (loggedInUser) {
        // إخفاء روابط التسجيل/الدخول فقط
        if (signupLink) signupLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        
        // إظهار باقي الروابط (بما فيها Home)
        document.querySelectorAll('.nav-link').forEach(link => {
            if (!link.href.includes('signup.html')) {
                link.style.display = 'block';
            }
        });
    } else {
        // إظهار جميع الروابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.display = 'block';
        });
    }
}

// استدعاء الدالة عند تحميل الصفحة وعند تغيير حالة التسجيل
document.addEventListener('DOMContentLoaded', updateNavLinks);
window.addEventListener('storage', updateNavLinks);

// إضافة هذه الدوال لتحسين نظام المصادقة
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!validateEmail(email)) {
        showError(document.getElementById('login-email'), 'Please enter a valid email');
        return;
    }
    
    if (!validatePassword(password)) {
        showError(document.getElementById('login-password'), 'Password must be at least 6 characters');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        document.getElementById('login-modal').style.display = 'none';
        
        // إضافة إشعار بتسجيل الدخول بنجاح
        showFeedbackMessage(`Welcome back, ${user.firstName}!`, false);
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        showError(document.getElementById('login-email'), 'Invalid email or password');
        showError(document.getElementById('login-password'), 'Invalid email or password');
    }
}
// في ملف auth.js
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود الحالي ...
    
    // إضافة هذا الجزء الجديد
    const showLoginModal = document.getElementById('show-login-modal');
    if (showLoginModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'flex';
        });
    }
});