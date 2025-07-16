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
        language: "Français",
        loading: "Chargement...",
        no_products: "Aucun produit trouvé",
        filter_all: "Tous",
        filter_active: "Actifs",
        filter_inactive: "Inactifs",
        filter_featured: "Mis en avant",
        bulk_actions: "Actions groupées",
        select_all: "Tout sélectionner",
        export_data: "Exporter les données",
        import_data: "Importer les données"
    },
    en: {
        dashboard: "Dashboard",
        settings: "Settings",
        logout: "Logout",
        my_products: "My Products",
        manage_products: "Manage all your products from this page",
        add_new_product: "Add new product",
        search_product: "Search product...",
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
        language: "English",
        loading: "Loading...",
        no_products: "No products found",
        filter_all: "All",
        filter_active: "Active",
        filter_inactive: "Inactive",
        filter_featured: "Featured",
        bulk_actions: "Bulk actions",
        select_all: "Select all",
        export_data: "Export data",
        import_data: "Import data"
    }
};

// Application state
let currentLanguage = 'fr';
let currentProductToDelete = null;
let products = [];
let filteredProducts = [];
let selectedProducts = new Set();
let currentFilter = 'all';
let isLoading = false;
let searchTimeout = null;

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
    createAdvancedUI();
    loadProducts();
    updateLanguage();
    setupSearchAndSort();
    initializeAnimations();
    setupKeyboardShortcuts();
});

// Create advanced UI elements
function createAdvancedUI() {
    createFilterTabs();
    createBulkActionsBar();
    createLoadingOverlay();
    createAdvancedSearch();
    createStatsCards();
}

// Create filter tabs
function createFilterTabs() {
    const toolbar = document.querySelector('.toolbar');
    const filterTabs = document.createElement('div');
    filterTabs.className = 'filter-tabs';
    filterTabs.innerHTML = `
        <button class="filter-tab active" data-filter="all">
            <span data-key="filter_all">Tous</span>
            <span class="tab-count" id="count-all">0</span>
        </button>
        <button class="filter-tab" data-filter="active">
            <span data-key="filter_active">Actifs</span>
            <span class="tab-count" id="count-active">0</span>
        </button>
        <button class="filter-tab" data-filter="inactive">
            <span data-key="filter_inactive">Inactifs</span>
            <span class="tab-count" id="count-inactive">0</span>
        </button>
        <button class="filter-tab" data-filter="featured">
            <span data-key="filter_featured">Mis en avant</span>
            <span class="tab-count" id="count-featured">0</span>
        </button>
    `;
    
    toolbar.parentNode.insertBefore(filterTabs, toolbar);
    
    // Add event listeners
    filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => handleFilterChange(tab.dataset.filter));
    });
}

// Create bulk actions bar
function createBulkActionsBar() {
    const toolbar = document.querySelector('.toolbar');
    const bulkBar = document.createElement('div');
    bulkBar.className = 'bulk-actions-bar';
    bulkBar.innerHTML = `
        <div class="bulk-left">
            <label class="bulk-checkbox">
                <input type="checkbox" id="selectAll">
                <span class="checkmark"></span>
                <span data-key="select_all">Tout sélectionner</span>
            </label>
            <span class="selected-count">0 sélectionnés</span>
        </div>
        <div class="bulk-right">
            <button class="btn btn-outline bulk-activate">
                <i class="fas fa-toggle-on"></i>
                Activer
            </button>
            <button class="btn btn-outline bulk-deactivate">
                <i class="fas fa-toggle-off"></i>
                Désactiver
            </button>
            <button class="btn btn-outline bulk-delete">
                <i class="fas fa-trash"></i>
                Supprimer
            </button>
            <button class="btn btn-primary export-btn">
                <i class="fas fa-download"></i>
                <span data-key="export_data">Exporter</span>
            </button>
        </div>
    `;
    
    toolbar.parentNode.insertBefore(bulkBar, toolbar);
    
    // Add event listeners
    document.getElementById('selectAll').addEventListener('change', handleSelectAll);
    bulkBar.querySelector('.bulk-activate').addEventListener('click', () => handleBulkAction('activate'));
    bulkBar.querySelector('.bulk-deactivate').addEventListener('click', () => handleBulkAction('deactivate'));
    bulkBar.querySelector('.bulk-delete').addEventListener('click', () => handleBulkAction('delete'));
    bulkBar.querySelector('.export-btn').addEventListener('click', handleExportData);
}

// Create loading overlay
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p data-key="loading">Chargement...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Create advanced search
function createAdvancedSearch() {
    const searchBox = document.querySelector('.search-box');
    const advancedSearch = document.createElement('div');
    advancedSearch.className = 'advanced-search';
    advancedSearch.innerHTML = `
        <button class="advanced-search-toggle">
            <i class="fas fa-sliders-h"></i>
        </button>
        <div class="advanced-search-panel">
            <div class="search-filters">
                <div class="filter-group">
                    <label>Prix minimum</label>
                    <input type="number" id="minPrice" placeholder="0">
                </div>
                <div class="filter-group">
                    <label>Prix maximum</label>
                    <input type="number" id="maxPrice" placeholder="100000">
                </div>
                <div class="filter-group">
                    <label>Date de création</label>
                    <input type="date" id="dateFilter">
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-primary apply-filters">Appliquer</button>
                <button class="btn btn-outline clear-filters">Effacer</button>
            </div>
        </div>
    `;
    
    searchBox.appendChild(advancedSearch);
    
    // Add event listeners
    const toggle = advancedSearch.querySelector('.advanced-search-toggle');
    const panel = advancedSearch.querySelector('.advanced-search-panel');
    
    toggle.addEventListener('click', () => {
        panel.classList.toggle('show');
        toggle.classList.toggle('active');
    });
    
    advancedSearch.querySelector('.apply-filters').addEventListener('click', applyAdvancedFilters);
    advancedSearch.querySelector('.clear-filters').addEventListener('click', clearAdvancedFilters);
}

// Create stats cards
function createStatsCards() {
    const pageHeader = document.querySelector('.page-header');
    const statsCards = document.createElement('div');
    statsCards.className = 'stats-cards';
    statsCards.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="fas fa-box"></i>
            </div>
            <div class="stat-content">
                <div class="stat-number" id="totalProducts">0</div>
                <div class="stat-label">Total Produits</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
                <div class="stat-number" id="activeProducts">0</div>
                <div class="stat-label">Produits Actifs</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon warning">
                <i class="fas fa-eye"></i>
            </div>
            <div class="stat-content">
                <div class="stat-number" id="totalViews">0</div>
                <div class="stat-label">Vues Totales</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon primary">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-content">
                <div class="stat-number" id="totalOrders">0</div>
                <div class="stat-label">Commandes</div>
            </div>
        </div>
    `;
    
    pageHeader.appendChild(statsCards);
}

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
    
    // Search and sort with debouncing
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.sortSelect.addEventListener('change', handleSort);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window resize for responsive handling
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Language Management
function toggleLanguage() {
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    updateLanguage();
    updateDirection();
    showNotification(`Language changed to ${currentLanguage === 'fr' ? 'Français' : 'English'}`, 'info');
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
    
    // Update selected count
    updateSelectedCount();
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
    
    // Add animation
    if (elements.dropdownMenu.classList.contains('show')) {
        elements.dropdownMenu.style.animation = 'slideDown 0.3s ease-out';
    }
}

// Product Management
function loadProducts() {
    showLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
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
                date: "2025-01-15",
                featured: true,
                active: true,
                category: "Accessories",
                tags: ["luxury", "watch", "premium"]
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
                date: "2025-01-12",
                featured: false,
                active: false,
                category: "Bags",
                tags: ["leather", "handmade", "bag"]
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
                date: "2025-01-08",
                featured: true,
                active: true,
                category: "Fragrance",
                tags: ["oriental", "natural", "premium"]
            },
            {
                id: 4,
                name: "Bijoux Artisanaux",
                description: "Collection de bijoux faits main avec des matériaux précieux et un design unique.",
                price: 15000,
                currency: "DZD",
                image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
                views: 567,
                orders: 12,
                date: "2025-01-10",
                featured: false,
                active: true,
                category: "Jewelry",
                tags: ["handmade", "jewelry", "unique"]
            }
        ];
        
        filteredProducts = [...products];
        renderProducts();
        updateStats();
        updateFilterCounts();
        showLoading(false);
        
        // Add entrance animation
        animateProductCards();
    }, 1000);
}

function renderProducts(productsToRender = filteredProducts) {
    elements.productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        showEmptyState();
        return;
    }
    
    productsToRender.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        elements.productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const isSelected = selectedProducts.has(product.id);
    
    card.innerHTML = `
        <div class="product-header">
            <label class="product-checkbox">
                <input type="checkbox" ${isSelected ? 'checked' : ''} data-product-id="${product.id}">
                <span class="checkmark"></span>
            </label>
            <div class="product-menu">
                <button class="menu-btn">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <div class="product-menu-dropdown">
                    <button data-action="duplicate" data-product-id="${product.id}">
                        <i class="fas fa-copy"></i>
                        Dupliquer
                    </button>
                    <button data-action="archive" data-product-id="${product.id}">
                        <i class="fas fa-archive"></i>
                        Archiver
                    </button>
                </div>
            </div>
        </div>
        
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            ${product.featured ? `
                <div class="product-badge featured">
                    <i class="fas fa-star"></i>
                    <span data-key="featured">${translations[currentLanguage].featured}</span>
                </div>
            ` : ''}
            <div class="product-overlay">
                <button class="overlay-btn preview-btn" data-action="preview" data-product-id=
