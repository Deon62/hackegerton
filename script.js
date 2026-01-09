// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (in production, this would send to a server)
        showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
        
        // In production, you would send the data to your server:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        //     contactForm.reset();
        // })
        // .catch(error => {
        //     showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        // });
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Help Contact Form Handling
const helpContactForm = document.getElementById('helpContactForm');
const helpFormMessage = document.getElementById('helpFormMessage');

if (helpContactForm) {
    helpContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(helpContactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showHelpFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showHelpFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission (in production, this would send to a server)
        showHelpFormMessage('Thank you for your message! We will get back to you soon.', 'success');
        helpContactForm.reset();
    });
}

function showHelpFormMessage(message, type) {
    if (helpFormMessage) {
        helpFormMessage.textContent = message;
        helpFormMessage.className = `form-message ${type}`;
        helpFormMessage.style.display = 'block';
        
        // Scroll to message
        helpFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            helpFormMessage.style.display = 'none';
        }, 5000);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current page nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Header scroll effect
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Optimize hero image loading
const heroImage = document.querySelector('.hero-image');
if (heroImage) {
    // Check if image is already loaded (cached)
    if (heroImage.complete && heroImage.naturalHeight !== 0) {
        heroImage.classList.add('loaded');
    } else {
        // Wait for image to load
        heroImage.addEventListener('load', () => {
            heroImage.classList.add('loaded');
        });
        // Fallback: show image after timeout even if load event doesn't fire
        setTimeout(() => {
            heroImage.classList.add('loaded');
        }, 100);
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize scroll animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-fade-in class to all cards and interactive elements
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .trust-item,
        .host-benefit-card,
        .problem-item,
        .differentiator-item,
        .host-step-card,
        .finance-info-card,
        .booking-feature-item,
        .help-contact-form-wrapper,
        .blog-card,
        .car-item,
        .benefit-content,
        .faq-item,
        .host-section-block,
        .content-block,
        .legal-section
    `);
    
    animatedElements.forEach((el, index) => {
        // Skip if element is in a hero section
        if (el.closest('.hero, .about-hero, .fleet-hero, .host-page-hero, .legal-hero, .page-header, .apps-hero')) {
            return;
        }
        
        el.classList.add('scroll-fade-in');
        
        // Add staggered delay for cards in grids (only for direct children)
        const parent = el.parentElement;
        if (parent && (
            parent.classList.contains('features-grid') ||
            parent.classList.contains('trust-grid') ||
            parent.classList.contains('problems-grid') ||
            parent.classList.contains('differentiators-grid') ||
            parent.classList.contains('host-steps-grid') ||
            parent.classList.contains('finances-info-grid') ||
            parent.classList.contains('bookings-features-grid') ||
            parent.classList.contains('blogs-grid') ||
            parent.classList.contains('fleet-grid') ||
            parent.classList.contains('host-benefits')
        )) {
            const siblings = Array.from(parent.children);
            const delayIndex = siblings.indexOf(el) % 3;
            if (delayIndex === 1) el.classList.add('scroll-fade-in-delay-1');
            if (delayIndex === 2) el.classList.add('scroll-fade-in-delay-2');
        }
        
        scrollObserver.observe(el);
    });
    
    // Animate sections (excluding hero sections)
    const sections = document.querySelectorAll(`
        .features,
        .safety-trust,
        .become-host,
        .faq-section,
        .cta,
        .problems-section,
        .differentiators-section,
        .story-section,
        .help-section,
        .blogs-section,
        .host-content-section,
        .fleet-grid-section,
        .content-section
    `);
    
    sections.forEach(section => {
        section.classList.add('scroll-fade-in');
        scrollObserver.observe(section);
    });
    
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        if (!title.closest('.hero, .about-hero, .fleet-hero, .host-page-hero, .legal-hero, .page-header, .apps-hero')) {
            title.classList.add('scroll-fade-in');
            scrollObserver.observe(title);
        }
    });
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// Statistics Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target).toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Fetch and display statistics from Supabase
async function loadStatistics() {
    const accountsElement = document.getElementById('accountsCount');
    const teamsElement = document.getElementById('teamsCount');
    
    if (!accountsElement || !teamsElement) return;
    
    // Show loading state
    accountsElement.textContent = '...';
    teamsElement.textContent = '...';
    
    try {
        // Fetch real data from Supabase
        const [accountsCount, teamsCount] = await Promise.all([
            fetchAccountsCount(),
            fetchTeamsCount()
        ]);
        
        // Animate counters when section is visible
        const statsSection = accountsElement.closest('section');
        if (!statsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(accountsElement, accountsCount);
                    animateCounter(teamsElement, teamsCount);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
        
        // Also update immediately if section is already visible
        if (statsSection.getBoundingClientRect().top < window.innerHeight) {
            animateCounter(accountsElement, accountsCount);
            animateCounter(teamsElement, teamsCount);
        }
        
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Fallback to localStorage or show 0
        const accountsCount = parseInt(localStorage.getItem('hackegerton_accounts') || '0');
        const teamsCount = parseInt(localStorage.getItem('hackegerton_teams') || '0');
        
        if (accountsElement) accountsElement.textContent = accountsCount.toLocaleString();
        if (teamsElement) teamsElement.textContent = teamsCount.toLocaleString();
    }
    
    // Function to update statistics (can be called from registration/login pages)
    window.updateStatistics = async function(accounts, teams) {
        try {
            if (accounts === undefined) {
                accounts = await fetchAccountsCount();
            }
            if (teams === undefined) {
                teams = await fetchTeamsCount();
            }
            
            if (accountsElement) {
                accountsElement.textContent = accounts.toLocaleString();
            }
            if (teamsElement) {
                teamsElement.textContent = teams.toLocaleString();
            }
            
            // Update localStorage as cache
            localStorage.setItem('hackegerton_accounts', accounts);
            localStorage.setItem('hackegerton_teams', teams);
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    };
}

// Fetch accounts count from Supabase
async function fetchAccountsCount() {
    try {
        if (typeof supabaseClient === 'undefined' || !supabaseClient.selectCount) {
            // Fallback if supabase client not available
            return parseInt(localStorage.getItem('hackegerton_accounts') || '0');
        }
        const count = await supabaseClient.selectCount('users', {});
        return count || 0;
    } catch (error) {
        console.error('Error fetching accounts count:', error);
        return parseInt(localStorage.getItem('hackegerton_accounts') || '0');
    }
}

// Fetch teams count from Supabase (hackathon registrations)
async function fetchTeamsCount() {
    try {
        if (typeof supabaseClient === 'undefined' || !supabaseClient.selectCount) {
            // Fallback if supabase client not available
            return parseInt(localStorage.getItem('hackegerton_teams') || '0');
        }
        const count = await supabaseClient.selectCount('hackathon_registrations', {});
        return count || 0;
    } catch (error) {
        console.error('Error fetching teams count:', error);
        return parseInt(localStorage.getItem('hackegerton_teams') || '0');
    }
}

// Load statistics on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    initAccountModal();
    
    // Refresh statistics every 30 seconds to keep data current
    setInterval(() => {
        if (typeof updateStatistics === 'function') {
            updateStatistics();
        }
    }, 30000);
});

// Account Modal and Authentication
function initAccountModal() {
    const profileBtn = document.getElementById('profileBtn');
    const accountModal = document.getElementById('accountModal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!profileBtn || !accountModal) return;
    
    // Check if user is logged in
    function isLoggedIn() {
        return localStorage.getItem('hackegerton_user') !== null;
    }
    
    function getUser() {
        const userStr = localStorage.getItem('hackegerton_user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    function updateModalContent() {
        if (isLoggedIn()) {
            const user = getUser();
            const avatarUrl = user.avatar_url || 'assets/male.png';
            modalTitle.textContent = 'Account';
            modalContent.innerHTML = `
                <div class="account-user-info">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <img src="${avatarUrl}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);">
                        <div>
                            <p class="user-name">${user.nickname || user.email}</p>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">${user.email}</p>
                        </div>
                    </div>
                </div>
                <div class="account-modal-buttons">
                    <a href="checkin.html" class="account-modal-btn account-modal-btn-primary">Hackegerton Check In</a>
                    <button class="account-modal-btn account-modal-btn-danger" onclick="handleLogout()">Logout</button>
                </div>
            `;
        } else {
            modalTitle.textContent = 'Account';
            modalContent.innerHTML = `
                <div class="account-modal-buttons">
                    <a href="login.html" class="account-modal-btn account-modal-btn-primary">Login</a>
                    <a href="register.html" class="account-modal-btn account-modal-btn-secondary">Create Account</a>
                </div>
            `;
        }
    }
    
    // Open modal
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateModalContent();
        accountModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        accountModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accountModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Update modal when page loads
    updateModalContent();
    if (typeof updateProfileButton === 'function') {
        updateProfileButton();
    }
    if (typeof updateNavAccountButton === 'function') {
        updateNavAccountButton();
    }
}

// Logout function
function handleLogout() {
    localStorage.removeItem('hackegerton_user');
    const accountModal = document.getElementById('accountModal');
    if (accountModal) {
        accountModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Update UI
    if (typeof updateProfileButton === 'function') {
        updateProfileButton();
    }
    if (typeof updateNavAccountButton === 'function') {
        updateNavAccountButton();
    }
    if (typeof updateHeroCTAs === 'function') {
        updateHeroCTAs();
    }
    // Reload page to update UI
    window.location.reload();
}

// Make logout function globally available
window.handleLogout = handleLogout;

// Update profile button function (globally available)
function updateProfileButton() {
    const profileBtn = document.getElementById('profileBtn');
    if (!profileBtn) return;
    
    function getUser() {
        const userStr = localStorage.getItem('hackegerton_user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    const user = getUser();
    
    // Update mobile visibility based on login status
    if (user) {
        profileBtn.classList.remove('mobile-hidden');
        profileBtn.classList.add('mobile-visible');
    } else {
        profileBtn.classList.add('mobile-hidden');
        profileBtn.classList.remove('mobile-visible');
    }
    
    if (user && user.avatar_url) {
        // Remove existing content
        profileBtn.innerHTML = '';
        // Add avatar image
        const img = document.createElement('img');
        img.src = user.avatar_url;
        img.alt = 'Profile';
        profileBtn.appendChild(img);
        profileBtn.classList.add('has-avatar');
    } else {
        // Show default icon
        profileBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        `;
        profileBtn.classList.remove('has-avatar');
    }
}

// Make updateProfileButton globally available
window.updateProfileButton = updateProfileButton;

// Update navbar account button
function updateNavAccountButton() {
    const navAccountBtn = document.getElementById('navAccountBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    function getUser() {
        const userStr = localStorage.getItem('hackegerton_user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    const user = getUser();
    if (user && user.nickname) {
        // User is logged in
        if (navAccountBtn) {
            navAccountBtn.textContent = `Hello, ${user.nickname}`;
            navAccountBtn.href = '#';
            navAccountBtn.onclick = function(e) {
                e.preventDefault();
                if (profileBtn) profileBtn.click();
            };
            // Show salutation on mobile when logged in
            navAccountBtn.classList.remove('mobile-hidden');
            navAccountBtn.classList.add('mobile-visible');
        }
        // Show profile button on mobile when logged in
        if (profileBtn) {
            profileBtn.classList.remove('mobile-hidden');
            profileBtn.classList.add('mobile-visible');
        }
    } else {
        // User is logged out
        if (navAccountBtn) {
            navAccountBtn.textContent = 'Create Account';
            navAccountBtn.href = 'register.html';
            navAccountBtn.onclick = null;
            // Show Create Account button on mobile when logged out
            navAccountBtn.classList.remove('mobile-hidden');
            navAccountBtn.classList.remove('mobile-visible');
        }
        // Hide profile button on mobile when logged out
        if (profileBtn) {
            profileBtn.classList.add('mobile-hidden');
            profileBtn.classList.remove('mobile-visible');
        }
    }
}

// Make updateNavAccountButton globally available
window.updateNavAccountButton = updateNavAccountButton;

// Update hero CTAs based on login status
function updateHeroCTAs() {
    function getUser() {
        const userStr = localStorage.getItem('hackegerton_user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    const user = getUser();
    const heroRegisterBtn = document.getElementById('heroRegisterBtn');
    const ctaRegisterBtn = document.getElementById('ctaRegisterBtn');
    
    if (user) {
        // User is logged in - change to Check In
        if (heroRegisterBtn) {
            heroRegisterBtn.textContent = 'Check In';
            heroRegisterBtn.href = 'checkin.html';
        }
        if (ctaRegisterBtn) {
            ctaRegisterBtn.textContent = 'Check In';
            ctaRegisterBtn.href = 'checkin.html';
        }
    } else {
        // User is logged out - show Register Now
        if (heroRegisterBtn) {
            heroRegisterBtn.textContent = 'Register Now';
            heroRegisterBtn.href = 'register.html';
        }
        if (ctaRegisterBtn) {
            ctaRegisterBtn.textContent = 'Register Now';
            ctaRegisterBtn.href = 'register.html';
        }
    }
}

// Make updateHeroCTAs globally available
window.updateHeroCTAs = updateHeroCTAs;

// Update profile button and nav account button on page load if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    updateProfileButton();
    updateNavAccountButton();
    updateHeroCTAs();
});