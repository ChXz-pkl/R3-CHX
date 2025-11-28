const R3_DATA = [
    {
        id: 'reduce',
        title: 'Reduce',
        description: 'Kurangi penggunaan barang-barang yang tidak perlu. Memilih produk yang tahan lama dan mengurangi limbah adalah langkah awal yang sangat penting untuk planet kita.',
        bgColor: 'bg-lime-700',
        bgEffect: 'bg-gradient-to-r from-lime-700 to-lime-800',
        svgPath: './public/img/reduce.svg',
        initialPosition: 'top-4 left-1/2 -translate-x-1/2',
    },
    {
        id: 'reuse',
        title: 'Reuse',
        description: 'Gunakan kembali barang-barang yang sudah ada. Mengubah botol bekas menjadi tempat pensil atau tas belanja kain adalah cara kreatif untuk mengurangi sampah.',
        bgColor: 'bg-teal-600',
        bgEffect: 'bg-gradient-to-r from-teal-600 to-teal-700',
        svgPath: './public/img/reuse.svg',
        initialPosition: 'top-1/2 right-4 -translate-y-1/2',
    },
    {
        id: 'recycle',
        title: 'Recycle',
        description: 'Olah kembali material menjadi produk baru. Daur ulang kertas, plastik, dan kaca membantu menghemat sumber...',
        bgColor: 'bg-green-800',
        bgEffect: 'bg-gradient-to-r from-green-800 to-green-900',
        svgPath: './public/img/recycle.svg',
        initialPosition: 'bottom-4 left-1/2 -translate-x-1/2',
    },
];

const ALL_BACKGROUND_CLASSES = [
    'bg-green-900', 'bg-gradient-to-br', 'from-green-900', 'to-gray-800', 
    'bg-lime-700', 'bg-gradient-to-r', 'from-lime-700', 'to-lime-800',    
    'bg-teal-600', 'from-teal-600', 'to-teal-700',                        
    'bg-green-800', 'from-green-800', 'to-green-900',                     
    
    'bg-green-300', 'dark:bg-green-600', 'from-green-300', 'to-green-500', 
    'bg-teal-300', 'dark:bg-teal-600', 'from-cyan-300', 'to-teal-500',    
    'dark:bg-gray-800', 
    
    'from-lime-400', 'to-green-600', 'bg-red-700', 'bg-blue-600', 'bg-pink-500', 
    'bg-green-700', 'bg-amber-600', 'from-red-700', 'to-red-800',
    'from-blue-600', 'to-blue-700', 'from-pink-500', 'to-pink-600',
    'from-green-700', 'to-green-800', 'to-cyan-700',
    'from-amber-600', 'to-orange-700', 'dark:bg-green-800',
];

const INITIAL_DATA = {
    title: '3R: Reduce, Reuse, Recycle',
    description: 'Selamat datang! Website ini didedikasikan untuk mengedukasi dan mendorong praktik 3R (Reduce, Reuse, Recycle) sebagai solusi keberlanjutan. Pelajari bagaimana Anda bisa membuat perbedaan dalam kehidupan sehari-hari.',
    bgColor: 'bg-green-900',
    bgEffect: 'bg-gradient-to-br from-green-900 to-gray-800',
    contentChanged: false
};


let currentRIndex = 0;
let R_Order = R3_DATA.map((_, index) => index);
let autoRotateInterval;
let resetTimeout;
let isInteractiveMode = false;

const heroSection = document.getElementById('hero-section');
const contentTitle = document.getElementById('hero-content-title');
const contentDescription = document.getElementById('hero-content-description');
const logoCircle = document.getElementById('logo-circle');
const crossHatch = document.getElementById('cross-hatch');
const logoItems = document.querySelectorAll('.logo-item');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadSvgImage(element, path) {
    element.innerHTML = `<img src="${path}" alt="${element.dataset.id} logo" class="w-16 h-16 text-white transition-transform duration-700" />`;
}

export function applyHeroBackgroundSafely(newClasses) {
    if (heroSection) {
        
        heroSection.classList.remove(...ALL_BACKGROUND_CLASSES);
        
        
        heroSection.classList.add(...newClasses);
    }
}

export function markSectionAsComplete(sectionId) {
    
    const item = document.querySelector(`.logo-item[data-id="${sectionId}"]`);
    if (item) {
        const logo = item.querySelector('.logo-svg');
        if (logo) {
            
            logo.classList.add('brightness-[1.5]', 'ring-4', 'ring-yellow-400', 'p-2', 'rounded-full');
            
            logo.classList.remove('brightness-75', 'brightness-125'); 
        }
    }
}

function updateHeroContent(data) {
    const allBgClassesString = R3_DATA.map(r => r.bgColor + ' ' + r.bgEffect).join(' ') + ' ' + INITIAL_DATA.bgColor + ' ' + INITIAL_DATA.bgEffect;
    heroSection.classList.remove(...allBgClassesString.split(' '));

    const newClasses = [data.bgColor, ...data.bgEffect.split(' ')];
    heroSection.classList.add(...newClasses);

    if (data.contentChanged) {
        contentTitle.textContent = data.title;
        contentDescription.textContent = data.description;
    } else {
        contentTitle.textContent = INITIAL_DATA.title;
        contentDescription.textContent = INITIAL_DATA.description;
    }
}

function resetAllLogoPositions() {
    logoItems.forEach(item => {
        const rData = R3_DATA.find(r => r.id === item.dataset.id);
        if (!rData) return;
        const positionClasses = rData.initialPosition.split(' ');
        const imgElement = item.querySelector('img');

        item.classList.remove(
            'ring-4', 'ring-white', 'scale-[1.5]', 'scale-110', 'opacity-100',
            'top-1/2', 'left-1/2', 'right-4', 'bottom-4', 'top-4',
            '-translate-x-1/2', '-translate-y-1/2'
        );

        item.classList.add(...positionClasses);
        item.classList.remove('opacity-50');

        if (imgElement) {
            imgElement.style.transform = 'rotate(0deg)';
        }
    });
    logoCircle.classList.add('border-8', 'border-white', 'border-opacity-30');
    crossHatch.classList.remove('opacity-0');
}

function setActiveLogoLoop(activeId) {
    logoItems.forEach(item => {
        const imgElement = item.querySelector('img');

        item.classList.add('opacity-50');
        item.classList.remove('scale-110');

        if (imgElement) {
            imgElement.style.transform = 'rotate(0deg)';
        }

        if (item.dataset.id === activeId) {
            item.classList.remove('opacity-50');
            item.classList.add('scale-110');

            if (imgElement) {
                imgElement.style.transform = 'rotate(360deg)';
            }
        }
    });
}

function setActiveLogoInteractive(activeId) {
    logoCircle.classList.remove('border-8', 'border-white', 'border-opacity-30');
    crossHatch.classList.add('opacity-0');

    logoItems.forEach(item => {
        const rData = R3_DATA.find(r => r.id === item.dataset.id);
        const positionClasses = rData.initialPosition.split(' ');
        const imgElement = item.querySelector('img');

        item.classList.remove('ring-4', 'ring-white', 'scale-[1.5]', 'scale-110', 'opacity-100',
            'top-1/2', 'left-1/2', 'right-4', 'bottom-4', 'top-4',
            '-translate-x-1/2', '-translate-y-1/2');

        if (imgElement) {
            imgElement.style.transform = 'rotate(0deg)';
        }

        if (item.dataset.id !== activeId) {
            item.classList.add(...positionClasses);
            item.classList.add('opacity-50');
        } else {
            item.classList.add('scale-[1.5]', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'opacity-100');
        }
    });
}

function startAutoRotate() {
    if (isInteractiveMode) return;

    clearInterval(autoRotateInterval);

    resetAllLogoPositions();

    shuffleArray(R_Order);
    currentRIndex = 0;

    const initialR = R3_DATA[R_Order[currentRIndex]];
    updateHeroContent(INITIAL_DATA);

    updateHeroContent({ ...initialR, contentChanged: false });
    setActiveLogoLoop(initialR.id);

    autoRotateInterval = setInterval(() => {
        currentRIndex = (currentRIndex + 1) % R3_DATA.length;
        const nextR = R3_DATA[R_Order[currentRIndex]];

        updateHeroContent({ ...nextR, contentChanged: false });
        setActiveLogoLoop(nextR.id);

    }, 5000);
}

function startResetTimeout() {
    clearTimeout(resetTimeout);
    isInteractiveMode = true;

    resetTimeout = setTimeout(() => {
        isInteractiveMode = false;
        startAutoRotate();

    }, 5000);
}

function handleLogoClick(event) {
    const clickedItem = event.target.closest('.logo-item');
    if (!clickedItem) return;

    if (isInteractiveMode) return;

    const clickedId = clickedItem.dataset.id;
    const selectedR = R3_DATA.find(r => r.id === clickedId);

    clearInterval(autoRotateInterval);

    if (selectedR) {
        updateHeroContent({ ...selectedR, contentChanged: true });
        setActiveLogoInteractive(selectedR.id);

        startResetTimeout();
    }
}


export function initializeHeroSection() {
    R3_DATA.forEach(r => {
        const itemElement = document.getElementById(`logo-${r.id}`);
        if (itemElement) {
            loadSvgImage(itemElement, r.svgPath);
        }
    });

    resetAllLogoPositions();
    updateHeroContent(INITIAL_DATA);

    logoCircle.addEventListener('click', handleLogoClick);

    startAutoRotate();
}