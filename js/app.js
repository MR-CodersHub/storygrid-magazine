// ================================
// MAGAZINE WEBSITE - MAIN JAVASCRIPT
// ================================

// ================================
// UTILITY FUNCTIONS
// ================================

// Show toast notification
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            ${getToastIcon(type)}
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };
    return icons[type] || icons.info;
}

// ================================
// LOCAL STORAGE MANAGEMENT
// ================================

const Storage = {
    // Get item from localStorage
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Set item in localStorage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all localStorage
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ================================
// AUTHENTICATION SYSTEM
// ================================

const Auth = {
    // Check if user is logged in
    isLoggedIn() {
        return Storage.get('currentUser') !== null;
    },

    // Get current user
    getCurrentUser() {
        return Storage.get('currentUser');
    },

    // Login user
    login(email, password) {
        // Get all users
        const users = Storage.get('users') || [];

        // Check for admin credentials
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const adminUser = {
                id: 'admin',
                email: 'admin@gmail.com',
                name: 'Admin',
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            Storage.set('currentUser', adminUser);
            return { success: true, user: adminUser };
        }

        // Find user in database
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const userData = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role || 'user',
                loginTime: new Date().toISOString()
            };
            Storage.set('currentUser', userData);
            return { success: true, user: userData };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    // Register new user
    register(userData) {
        const users = Storage.get('users') || [];

        // Check if email already exists
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        Storage.set('users', users);

        return { success: true, message: 'Registration successful' };
    },

    // Logout user
    logout() {
        Storage.remove('currentUser');
        window.location.href = '/index.html';
    },

    // Protect page (redirect if not logged in)
    protectPage() {
        if (!this.isLoggedIn()) {
            window.location.href = '/auth/user/login.html';
        }
    },

    // Protect admin page
    protectAdminPage() {
        const user = this.getCurrentUser();
        if (!user || user.role !== 'admin') {
            window.location.href = '/auth/admin/admin-login.html';
        }
    }
};

// ================================
// NAVBAR FUNCTIONALITY
// ================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const profileTrigger = document.querySelector('.navbar-profile-right .profile-trigger');
    const navbarProfile = document.querySelector('.navbar-profile-right');

    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navbarToggle?.addEventListener('click', () => {
        const isOpening = !navbarMenu?.classList.contains('active');
        navbarToggle.classList.toggle('active');
        navbarMenu?.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        // Always scroll menu to top when opening so Home link is visible
        if (isOpening && navbarMenu) {
            navbarMenu.scrollTop = 0;
        }
    });

    // Close menu when a link is clicked
    // Close menu when a link is clicked
    navbarMenu?.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const dropdown = link.closest('.navbar-dropdown');
            const targetHref = link.getAttribute('href');

            // Check if this is the Categories toggle (dropdown trigger link)
            if (dropdown && link.closest('li.navbar-dropdown') && link.getAttribute('href') === '#') {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
                // Scroll menu back to top so Home link stays visible
                if (navbarMenu) {
                    navbarMenu.scrollTop = 0;
                }
                return; // Stop here, do not navigate or close menu
            }

            // Handle mobile categories dropdown
            if (dropdown && window.innerWidth <= 992 && targetHref === '#') {
                e.preventDefault();
                dropdown.classList.toggle('active');
                return;
            }

            // Handle mobile page navigation transitions
            if (window.innerWidth <= 992 && targetHref && !targetHref.startsWith('#')) {
                e.preventDefault();

                // 1. Start close animation
                navbarToggle?.classList.remove('active');
                navbarMenu?.classList.remove('active');
                document.body.classList.remove('no-scroll');

                // 2. Wait for animation (400ms) then navigate
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 400);
            } else {
                // Default immediate close for anchors or desktop
                navbarToggle?.classList.remove('active');
                navbarMenu?.classList.remove('active');
                document.body.classList.remove('no-scroll');
                navbarMenu?.querySelectorAll('.navbar-dropdown').forEach(d => d.classList.remove('active'));
            }
        });
    });

    // Profile dropdown toggle
    profileTrigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        navbarProfile?.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarProfile?.contains(e.target)) {
            navbarProfile?.classList.remove('active');
        }
    });

    // Update navbar based on auth state
    updateNavbar();
}

function updateNavbar() {
    const authOnlyItems = document.querySelectorAll('.auth-only');
    const userOnlyItems = document.querySelectorAll('.user-only');
    const adminOnlyItems = document.querySelectorAll('.admin-only');
    const loggedInOnlyItems = document.querySelectorAll('.logged-in-only');

    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        const isAdmin = user.email === 'admin@gmail.com';

        // Hide auth-only items (Login/Signup)
        authOnlyItems.forEach(item => item.style.display = 'none');

        // Show logout
        loggedInOnlyItems.forEach(item => item.style.display = 'block');

        if (isAdmin) {
            // Show admin dashboard, hide user dashboard
            adminOnlyItems.forEach(item => item.style.display = 'block');
            userOnlyItems.forEach(item => item.style.display = 'none');
        } else {
            // Show user dashboard, hide admin dashboard
            userOnlyItems.forEach(item => item.style.display = 'block');
            adminOnlyItems.forEach(item => item.style.display = 'none');
        }
    } else {
        // Show auth-only items (Login/Signup)
        authOnlyItems.forEach(item => item.style.display = 'block');

        // Hide logged-in items
        loggedInOnlyItems.forEach(item => item.style.display = 'none');
        userOnlyItems.forEach(item => item.style.display = 'none');
        adminOnlyItems.forEach(item => item.style.display = 'none');
    }
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
        showToast('Logged Out', 'You have been successfully logged out', 'success');
    }
}

// ================================
// FORM VALIDATION
// ================================

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showFieldError(input, 'This field is required');
        } else {
            input.classList.remove('error');
            removeFieldError(input);

            // Email validation
            if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
                input.classList.add('error');
                showFieldError(input, 'Please enter a valid email');
            }

            // Password validation
            if (input.type === 'password' && input.value.length < 6) {
                isValid = false;
                input.classList.add('error');
                showFieldError(input, 'Password must be at least 6 characters');
            }
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(input, message) {
    removeFieldError(input);
    const error = document.createElement('div');
    error.className = 'field-error';
    error.style.color = '#dc3545';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.textContent = message;
    input.parentElement.appendChild(error);
}

function removeFieldError(input) {
    const error = input.parentElement.querySelector('.field-error');
    if (error) error.remove();
}

// ================================
// BLOG FUNCTIONALITY
// ================================

const Blog = {
    // Sample blog data
    articles: [
        {
            id: 1,
            title: 'The Art of Minimalist Design',
            excerpt: 'Exploring the principles of minimalism in modern web design and how it enhances user experience.',
            category: 'Design',
            author: 'John Doe',
            date: '2026-01-28',
            image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
            featured: true
        },
        {
            id: 2,
            title: 'Typography Trends for 2026',
            excerpt: 'Discover the latest typography trends that are shaping the digital landscape this year.',
            category: 'Typography',
            author: 'Jane Smith',
            date: '2026-01-25',
            image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800',
            featured: false
        },
        {
            id: 3,
            title: 'Color Psychology in Branding',
            excerpt: 'Understanding how colors influence consumer behavior and brand perception.',
            category: 'Branding',
            author: 'Mike Johnson',
            date: '2026-01-22',
            image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
            featured: true
        },
        {
            id: 4,
            title: 'Responsive Design Best Practices',
            excerpt: 'Essential techniques for creating websites that work seamlessly across all devices.',
            category: 'Development',
            author: 'Sarah Williams',
            date: '2026-01-20',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
            featured: false
        },
        {
            id: 5,
            title: 'The Future of Web Animations',
            excerpt: 'How modern CSS and JavaScript are revolutionizing web animations and interactions.',
            category: 'Development',
            author: 'Tom Brown',
            date: '2026-01-18',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            featured: false
        },
        {
            id: 6,
            title: 'Building Accessible Websites',
            excerpt: 'A comprehensive guide to making your website accessible to all users.',
            category: 'Accessibility',
            author: 'Emily Davis',
            date: '2026-01-15',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
            featured: true
        }
    ],

    // Filter articles by category
    filterByCategory(category) {
        if (category === 'all') return this.articles;
        return this.articles.filter(article => article.category === category);
    },

    // Search articles
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.articles.filter(article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery) ||
            article.category.toLowerCase().includes(lowerQuery)
        );
    },

    // Get article by ID
    getById(id) {
        return this.articles.find(article => article.id === parseInt(id));
    },

    // Get featured articles
    getFeatured() {
        return this.articles.filter(article => article.featured);
    },

    // Get recent articles
    getRecent(limit = 3) {
        return this.articles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
};

// Initialize blog search and filter
function initBlog() {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const blogGrid = document.getElementById('blogGrid');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const results = Blog.search(e.target.value);
            renderBlogArticles(results, blogGrid);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const results = Blog.filterByCategory(e.target.value);
            renderBlogArticles(results, blogGrid);
        });
    }

    // Initial render
    if (blogGrid) {
        renderBlogArticles(Blog.articles, blogGrid);
    }
}

function renderBlogArticles(articles, container) {
    if (!container) return;

    if (articles.length === 0) {
        container.innerHTML = '<p class="text-center">No articles found.</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <article class="card">
            <img src="${article.image}" alt="${article.title}" class="card-img">
            <div class="card-body">
                <div class="flex-between" style="margin-bottom: 1rem;">
                    <span class="badge badge-orange">${article.category}</span>
                    <span style="font-size: 0.875rem; color: var(--medium-gray);">${formatDate(article.date)}</span>
                </div>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-text">${article.excerpt}</p>
                <a href="blog-details.html?id=${article.id}" class="btn btn-outline btn-sm">Read More</a>
            </div>
        </article>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ================================
// CONTACT FORM
// ================================

function handleContactForm(event) {
    event.preventDefault();

    if (!validateForm('contactForm')) {
        showToast('Validation Error', 'Please fill in all required fields correctly', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Save to localStorage
    const contacts = Storage.get('contacts') || [];
    contacts.push({
        id: 'contact_' + Date.now(),
        ...data,
        submittedAt: new Date().toISOString()
    });
    Storage.set('contacts', contacts);

    // Show success message
    showToast('Success', 'Your message has been sent successfully!', 'success');

    // Reset form
    event.target.reset();
}

// ================================
// NEWSLETTER SUBSCRIPTION
// ================================

function handleNewsletterForm(event) {
    event.preventDefault();

    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        showToast('Invalid Email', 'Please enter a valid email address', 'error');
        return;
    }

    // Save to localStorage
    const subscribers = Storage.get('newsletter') || [];

    if (subscribers.includes(email)) {
        showToast('Already Subscribed', 'This email is already subscribed', 'warning');
        return;
    }

    subscribers.push(email);
    Storage.set('newsletter', subscribers);

    showToast('Success', 'Thank you for subscribing to our newsletter!', 'success');
    emailInput.value = '';
}

// ================================
// IMAGE PLACEHOLDER HANDLING
// ================================

function initImagePlaceholders() {
    const categoryPlaceholders = {
        'Tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        'Culture': 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=800&q=80',
        'Living': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        'Travel': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        'Science': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
        'Design': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        'Business': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80'
    };

    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        img.onerror = function () {
            // Find parent card to determine category from badge or context
            const parentCard = img.closest('.trending-card, .pick-item, .article-card');
            const badge = parentCard?.querySelector('.badge')?.textContent.trim();
            const title = parentCard?.querySelector('h3, h4, h5')?.textContent.toLowerCase() || '';

            // Infer category if badge is missing
            let category = badge;
            if (!category) {
                if (title.includes('tech') || title.includes('digital') || title.includes('ai')) category = 'Tech';
                else if (title.includes('design') || title.includes('canvas')) category = 'Design';
                else if (title.includes('urban') || title.includes('living') || title.includes('nomad')) category = 'Living';
                else if (title.includes('culture') || title.includes('people')) category = 'Culture';
                else if (title.includes('science') || title.includes('solar')) category = 'Science';
            }

            const fallback = categoryPlaceholders[category] || categoryPlaceholders['default'];

            if (this.src !== fallback) {
                this.src = fallback;
                this.style.objectFit = 'cover';
                console.warn('Image failed to load, using placeholder for category:', category || 'default');
            }
        };

        // Trigger error if image is already broken but event listener wasn't attached yet
        if (img.complete && img.naturalHeight === 0) {
            img.onerror();
        }
    });
}

// ================================
// INITIALIZE ON PAGE LOAD
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Force immediate scroll position reset and manual restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Force reset mobile menu state
    document.body.classList.remove('no-scroll');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle?.classList.remove('active');
    navbarMenu?.classList.remove('active');
    navbarMenu?.querySelectorAll('.navbar-dropdown').forEach(d => d.classList.remove('active'));

    initNavbar();
    initBlog();
    initImagePlaceholders();

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Export for use in other scripts
window.Auth = Auth;
window.Storage = Storage;
window.Blog = Blog;
window.showToast = showToast;
window.handleLogout = handleLogout;
window.validateForm = validateForm;
window.handleContactForm = handleContactForm;
window.handleNewsletterForm = handleNewsletterForm;
