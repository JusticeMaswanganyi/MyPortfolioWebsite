const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');

// Mobile navigation
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
        });
    });

    // Close the menu if the user returns to desktop width.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 680) {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Theme: dark mode is the default; remember the visitor's choice.
function setTheme(mode) {
    const isLight = mode === 'light';
    document.body.classList.toggle('light-mode', isLight);
    if (themeToggle) {
        themeToggle.textContent = isLight ? '☾' : '☼';
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        themeToggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
    try {
        localStorage.setItem('theme', mode);
    } catch (error) {
        // The site still works if browser storage is unavailable.
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    // Use the dark default when browser storage is unavailable.
}
setTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(nextTheme);
    });
}

// Reveal content as sections enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('show'));
}

// Highlight the navigation link for the section currently in view.
const navLinksList = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
const pageSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window && navLinksList.length) {
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksList.forEach(link => {
                    const active = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', active);
                });
            }
        });
    }, { rootMargin: '-38% 0px -52% 0px' });

    pageSections.forEach(section => navObserver.observe(section));
}

// Back-to-top button
if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle('show', window.scrollY > 450);
    };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    });
}

// Keep the copyright year current.
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
