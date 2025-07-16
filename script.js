// Translation data
const translations = {
    fr: {
        dashboard: "Tableau de bord",
        settings: "Paramètres",
        logout: "Déconnexion",
        my_products: "Mes Produits",
        manage_products: "Gérez tous vos produits depuis cette page",
        add_new_product: "Ajouter un nouveau produit",
        search_product: "Rechercher un produit...",
        newest: "Plus récent",
        price_low: "Prix croissant",
        price_high: "Prix décroissant",
        most_viewed: "Plus vues",
        featured: "Mis en avant",
        landing_page: "Page de destination",
        copy_link: "Copier le lien",
        active: "Activé",
        inactive: "Désactivé",
        edit: "Modifier",
        refresh: "Actualiser",
        delete: "Supprimer",
        confirm_delete: "Confirmer la suppression",
        delete_confirmation: "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
        cancel: "Annuler",
        link_copied: "Lien copié !",
        product_activated: "Produit activé",
        product_deactivated: "Produit désactivé",
        product_refreshed: "Produit actualisé",
        product_deleted: "Produit supprimé avec succès",
        language: "Français"
    },
    en: {
        dashboard: "Dashboard",
        settings: "Settings",
        logout: "Logout",
        my_products: "My Products",
        manage_products: "Manage all your products from this page",
        add_new_product: "Add new product",
        search_product: "Search for a product...",
        newest: "Newest",
        price_low: "Price ascending",
        price_high: "Price descending",
        most_viewed: "Most viewed",
        featured: "Featured",
        landing_page: "Landing page",
        copy_link: "Copy link",
        active: "Active",
        inactive: "Inactive",
        edit: "Edit",
        refresh: "Refresh",
        delete: "Delete",
        confirm_delete: "Confirm deletion",
        delete_confirmation: "Are you sure you want to delete this product? This action is irreversible.",
        cancel: "Cancel",
        link_copied: "Link copied!",
        product_activated: "Product activated",
        product_deactivated: "Product deactivated",
        product_refreshed: "Product refreshed",
        product_deleted: "Product deleted successfully",
        language: "English"
    }
};

// Application state
let currentLanguage = 'fr';
let currentProductToDelete = null;
let products = [];

// DOM Elements
const elements = {
    langToggle: document.getElementById('langToggle'),
    langText: document.getElementById('langText'),
    menuToggle: document.getElementById('menuToggle'),
    dropdownMenu: document.getElementById('dropdownMenu'),
    deleteModal: document.getElementById('deleteModal'),
    modalClose: document.getElementById('modalClose'),
    cancelDelete: document.getElementById('cancelDelete'),
    confirmDelete: document.getElementById('confirmDelete'),
    searchInput: document.querySelector('.search-input'),
    sortSelect: document.querySelector('.sort-select'),
    addProductBtn: document.querySelector('.add-product-btn'),
    productsGrid: document.querySelector('.products-grid')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadProducts();
    updateLanguage();
    setupSearchAndSort();
});

// Event Listeners Setup
function initializeEventListeners() {
    // Language toggle
    elements.langToggle.addEventListener('click', toggleLanguage);
    
    // User menu toggle
    elements.menuToggle.addEventListener('click', toggleUserMenu);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!elements.menuToggle.contains(e.target) && !elements.dropdownMenu.contains(e.target)) {
            elements.dropdownMenu.classList.remove('show');
        }
    });
    
    // Modal controls
    elements.modalClose.addEventListener('click', closeDeleteModal);
    elements.cancelDelete.addEventListener('click', closeDeleteModal);
    elements.confirmDelete.addEventListener('click', confirmDeleteProduct);
    
    // Close modal when clicking overlay
    elements.deleteModal.addEventListener('click', function(e) {
        if (e.target === elements.deleteModal) {
            closeDeleteModal();
        }
    });
    
    // Add product button
    elements.addProductBtn.addEventListener('click', handleAddProduct);
    
    // Search and sort
    elements.searchInput.addEventListener('input', handleSearch);
    elements.sortSelect.addEventListener('change', handleSort);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Language Management
function toggleLanguage() {
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    updateLanguage();
    updateDirection();
}

function updateLanguage() {
    const translation = translations[currentLanguage];
    
    // Update language button text
    elements.langText.textContent = translation.language;
    
    // Update all elements with data-key attributes
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translation[key]) {
            element.textContent = translation[key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (translation[key]) {
            element.placeholder = translation[key];
        }
    });
}

function updateDirection() {
    const html = document.documentElement;
    if (currentLanguage === 'en') {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'fr');
    }
}

// User Menu Management
function toggleUserMenu() {
    elements.dropdownMenu.classList.toggle('show');
}

// Product Management
function loadProducts() {
    // Simulate loading products from API
    products = [
        {
            id: 1,
            name: "Montre Élégante Premium",
            description: "Une montre de luxe avec un design moderne et élégant, parfaite pour toutes les occasions.",
            price: 25000,
            currency: "DZD",
            image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            views: 1234,
            orders: 45,
            date: "15 Jan 2025",
            featured: true,
            active: true
        },
        {
            id: 2,
            name: "Sac à Main en Cuir Véritable",
            description: "Sac à main artisanal en cuir véritable, spacieux et durable avec plusieurs compartiments.",
            price: 18500,
            currency: "DZD",
            image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            views: 892,
            orders: 23,
            date: "12 Jan 2025",
            featured: false,
            active: false
        },
        {
            id: 3,
            name: "Parfum Oriental Authentique",
            description: "Parfum oriental aux notes boisées et florales, fabriqué avec des ingrédients naturels de haute qualité.",
            price: 32000,
            currency: "DZD",
            image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            views: 2156,
            orders: 78,
            date: "08 Jan 2025",
            featured: true,
            active: true
        }
    ];
    
    renderProducts();
}

function renderProducts(productsToRender = products) {
    elements.productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        elements.productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            ${product.featured ? `
                <div class="product-badge featured">
                    <i class="fas fa-star"></i>
                    <span data-key="featured">${translations[currentLanguage].featured}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price.toLocaleString()} <span class="currency">${product.currency}</span></div>
            
            <div class="product-stats">
                <div class="stat-item">
                    <i class="fas fa-eye"></i>
                    <span>${product.views.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-shopping-cart"></i>
                    <span>${product.orders}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-calendar"></i>
                    <span>${product.date}</span>
                </div>
            </div>
        </div>
        
        <div class="product-actions">
            <div class="action-row">
                <button class="btn btn-link landing-btn" data-action="landing" data-product-id="${product.id}">
                    <i class="fas fa-globe"></i>
                    <span data-key="landing_page">${translations[currentLanguage].landing_page}</span>
                </button>
                <button class="btn btn-copy copy-link-btn" data-action="copy" data-product-id="${product.id}">
                    <i class="fas fa-copy"></i>
                    <span data-key="copy_link">${translations[currentLanguage].copy_link}</span>
                </button>
            </div>
            
            <div class="action-row">
                <button class="btn btn-toggle ${product.active ? 'active' : 'inactive'} toggle-btn" data-action="toggle" data-product-id="${product.id}">
                    <i class="fas fa-toggle-${product.active ? 'on' : 'off'}"></i>
                    <span data-key="${product.active ? 'active' : 'inactive'}">${product.active ? translations[currentLanguage].active : translations[currentLanguage].inactive}</span>
                </button>
                <button class="btn btn-edit edit-btn" data-action="edit" data-product-id="${product.id}">
                    <i class="fas fa-edit"></i>
                    <span data-key="edit">${translations[currentLanguage].edit}</span>
                </button>
            </div>
            
            <div class="action-row">
                <button class="btn btn-refresh refresh-btn" data-action="refresh" data-product-id="${product.id}">
                    <i class="fas fa-sync-alt"></i>
                    <span data-key="refresh">${translations[currentLanguage].refresh}</span>
                </button>
                <button class="btn btn-delete delete-btn" data-action="delete" data-product-id="${product.id}">
                    <i class="fas fa-trash"></i>
                    <span data-key="delete">${translations[currentLanguage].delete}</span>
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to action buttons
    addProductActionListeners(card, product);
    
    return card;
}

function addProductActionListeners(card, product) {
    const buttons = card.querySelectorAll('[data-action]');
    
    buttons.forEach(button => {
        const action = button.getAttribute('data-action');
        const productId = parseInt(button.getAttribute('data-product-id'));
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleProductAction(action, productId, button);
        });
    });
}

function handleProductAction(action, productId, button) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    switch (action) {
        case 'landing':
            handleLandingPage(product);
            break;
        case 'copy':
            handleCopyLink(product, button);
            break;
        case 'toggle':
            handleToggleProduct(product, button);
            break;
        case 'edit':
            handleEditProduct(product);
            break;
        case 'refresh':
            handleRefreshProduct(product, button);
            break;
        case 'delete':
            handleDeleteProduct(product);
            break;
    }
}

function handleLandingPage(product) {
    // Simulate opening landing page
    const landingUrl = `https://youzinelegancia.com/product/${product.id}`;
    window.open(landingUrl, '_blank');
}

function handleCopyLink(product, button) {
    const productUrl = `https://youzinelegancia.com/product/${product.id}`;
    
    navigator.clipboard.writeText(productUrl).then(() => {
        showNotification(translations[currentLanguage].link_copied, 'success');
        
        // Visual feedback
        const originalText = button.querySelector('span').textContent;
        const originalIcon = button.querySelector('i').className;
        
        button.querySelector('i').className = 'fas fa-check';
        button.querySelector('span').textContent = translations[currentLanguage].link_copied;
        
        setTimeout(() => {
            button.querySelector('i').className = originalIcon;
            button.querySelector('span').textContent = originalText;
        }, 2000);
    }).catch(() => {
        showNotification('Erreur lors de la copie', 'error');
    });
}

function handleToggleProduct(product, button) {
    product.active = !product.active;
    
    // Update button appearance
    const icon = button.querySelector('i');
    const text = button.querySelector('span');
    
    if (product.active) {
        button.className = 'btn btn-toggle active toggle-btn';
        icon.className = 'fas fa-toggle-on';
        text.textContent = translations[currentLanguage].active;
        text.setAttribute('data-key', 'active');
        showNotification(translations[currentLanguage].product_activated, 'success');
    } else {
        button.className = 'btn btn-toggle inactive toggle-btn';
        icon.className = 'fas fa-toggle-off';
        text.textContent = translations[currentLanguage].inactive;
        text.setAttribute('data-key', 'inactive');
        showNotification(translations[currentLanguage].product_deactivated, 'info');
    }
}

function handleEditProduct(product) {
    // Simulate opening edit modal/page
    showNotification(`Modification du produit: ${product.name}`, 'info');
    // Here you would typically open an edit modal or navigate to edit page
}

function handleRefreshProduct(product, button) {
    // Add loading animation
    const icon = button.querySelector('i');
    const originalClass = icon.className;
    
    icon.className = 'fas fa-spinner fa-spin';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        icon.className = originalClass;
        button.disabled = false;
        
        // Simulate updating product stats
        product.views += Math.floor(Math.random() * 100);
        product.orders += Math.floor(Math.random() * 5);
        
        // Re-render the product card
        const productCard = document.querySelector(`[data-product-id="${product.id}"]`);
        const newCard = createProductCard(product);
        productCard.replaceWith(newCard);
        
        showNotification(translations[currentLanguage].product_refreshed, 'success');
    }, 1500);
}

function handleDeleteProduct(product) {
    currentProductToDelete = product;
    elements.deleteModal.classList.add('show');
}

function closeDeleteModal() {
    elements.deleteModal.classList.remove('show');
    currentProductToDelete = null;
}

function confirmDeleteProduct() {
    if (!currentProductToDelete) return;
    
    // Remove product from array
    products = products.filter(p => p.id !== currentProductToDelete.id);
    
    // Remove product card from DOM
    const productCard = document.querySelector(`[data-product-id="${currentProductToDelete.id}"]`);
    if (productCard) {
        productCard.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            productCard.remove();
        }, 300);
    }
    
    showNotification(translations[currentLanguage].product_deleted, 'success');
    closeDeleteModal();
}

function handleAddProduct() {
    showNotification('Ouverture du formulaire d\'ajout de produit...', 'info');
    // Here you would typically open an add product modal or navigate to add page
}

// Search and Sort Functionality
function setupSearchAndSort() {
    // Initial setup is done in initializeEventListeners
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
}

function handleSort(e) {
    const sortValue = e.target.value;
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'price_low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'most_viewed':
            sortedProducts.sort((a, b) => b.views - a.views);
            break;
    }
    
    renderProducts(sortedProducts);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('click', () => notification.remove());
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        if (elements.deleteModal.classList.contains('show')) {
            closeDeleteModal();
        }
        if (elements.dropdownMenu.classList.contains('show')) {
            elements.dropdownMenu.classList.remove('show');
        }
    }
    
    // Ctrl/Cmd + N for new product
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleAddProduct();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;
document.head.appendChild(style);

// Export functions for potential external use
window.YouzinElegancia = {
    toggleLanguage,
    showNotification,
    loadProducts,
    handleProductAction
};
