export function initializeDarkModeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
        htmlElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        htmlElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });
}

export function initializeMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const menuContent = document.getElementById('mobile-menu-content');
    
    if (!button || !menuContent) return;

    const menuIcon = button.querySelector('svg:nth-child(2)');
    const closeIcon = button.querySelector('svg:nth-child(3)');

    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        button.setAttribute('aria-expanded', !isExpanded);
        
        menuContent.classList.toggle('hidden');
        
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    menuContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (!menuContent.classList.contains('hidden')) {
                menuContent.classList.add('hidden');
                
                button.setAttribute('aria-expanded', 'false');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });
    });
}