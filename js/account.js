/**
 * Account page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(loggedInUser);
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Display profile info
    document.getElementById('profile-info').innerHTML = `
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
    `;
    
    // Display address info
    document.getElementById('address-info').innerHTML = `
        <p><strong>Country:</strong> ${user.country}</p>
        <p><strong>Address:</strong> ${user.address}</p>
    `;
    
    // Display orders (from localStorage)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => 
        order.customer.email === user.email
    );
    
    const ordersList = document.getElementById('orders-list');
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p>You have no orders yet.</p>';
    } else {
        let ordersHTML = '';
        userOrders.forEach(order => {
            ordersHTML += `
                <div class="order-card">
                    <h4>Order #${order.id}</h4>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${order.total}</p>
                    <p><strong>Status:</strong> Completed</p>
                    <a href="#" class="btn btn-outline">View Details</a>
                </div>
            `;
        });
        ordersList.innerHTML = ordersHTML;
    }
    
    // Edit profile button
    document.getElementById('edit-profile').addEventListener('click', function() {
        document.getElementById('profile-info').innerHTML = `
            <form id="edit-profile-form">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" value="${user.firstName}" id="edit-first-name" required>
                </div>
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" value="${user.lastName}" id="edit-last-name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="${user.email}" id="edit-email" required>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" id="cancel-edit-profile" class="btn btn-outline">Cancel</button>
            </form>
        `;
        
        document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
        
        document.getElementById('cancel-edit-profile').addEventListener('click', function() {
            location.reload();
        });
    });
    
    // Edit address button
    document.getElementById('edit-address').addEventListener('click', function() {
        document.getElementById('address-info').innerHTML = `
            <form id="edit-address-form">
                <div class="form-group">
                    <label>Country</label>
                    <select id="edit-country" required>
                        <option value="US" ${user.country === 'US' ? 'selected' : ''}>United States</option>
                        <option value="UK" ${user.country === 'UK' ? 'selected' : ''}>United Kingdom</option>
                        <option value="CA" ${user.country === 'CA' ? 'selected' : ''}>Canada</option>
                        <option value="AU" ${user.country === 'AU' ? 'selected' : ''}>Australia</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <textarea id="edit-address" rows="4" required>${user.address}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" id="cancel-edit-address" class="btn btn-outline">Cancel</button>
            </form>
        `;
        
        document.getElementById('edit-address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddressChanges();
        });
        
        document.getElementById('cancel-edit-address').addEventListener('click', function() {
            location.reload();
        });
    });
});

function saveProfileChanges() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Update user data
    loggedInUser.firstName = document.getElementById('edit-first-name').value;
    loggedInUser.lastName = document.getElementById('edit-last-name').value;
    loggedInUser.email = document.getElementById('edit-email').value;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
    }
    
    // Save changes
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Profile updated successfully!');
    location.reload();
}

function saveAddressChanges() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Update user data
    loggedInUser.country = document.getElementById('edit-country').value;
    loggedInUser.address = document.getElementById('edit-address').value;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser;
    }
    
    // Save changes
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Address updated successfully!');
    location.reload();
}