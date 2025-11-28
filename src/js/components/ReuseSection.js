import { setGameCompleted } from "../GameController.js";
import { applyHeroBackgroundSafely, markSectionAsComplete } from "./HeroSection.js"; 
const BOTTLE_TYPES_CONFIG = [
    {
        type: 'A',
        pointValue: 3,
        count: 4,
        imgSrc: './public/img/reuse/bottle_A.svg',
        nameSuffix: 'Soda Besar'
    },
    {
        type: 'B',
        pointValue: 2,
        count: 2,
        imgSrc: './public/img/reuse/bottle_B.svg',
        nameSuffix: 'Air Mineral'
    },
    {
        type: 'C',
        pointValue: 1,
        count: 2,
        imgSrc: './public/img/reuse/bottle_C.svg',
        nameSuffix: 'Jus Kecil'
    }
];

const REUSE_BOTTLE_COUNT = 8;

let generatedBottles = [];
let bottleIndex = 1;

BOTTLE_TYPES_CONFIG.forEach(config => {
    for (let i = 0; i < config.count; i++) {
        generatedBottles.push({
            id: `botol-bekas-${bottleIndex}`,
            type: config.type,
            pointValue: config.pointValue,
            name: `Botol ${config.nameSuffix} #${bottleIndex}`,
            matchId: 'reuse-target',
            imgSrc: config.imgSrc,
            isCollected: false
        });
        bottleIndex++;
    }
});

const REUSE_ITEMS = [
    {
        id: 'reuse-target',
        type: 'correct',
        name: 'Lemari Daur Ulang',
        imgSrc: './public/img/reuse/correct_cabinet.svg',
        matchId: 'botol-bekas',
    },
    ...generatedBottles
];

const CABINET_ITEM = REUSE_ITEMS.find(item => item.id === 'reuse-target');
let BOTTLE_ITEMS = REUSE_ITEMS.filter(item => item.id !== 'reuse-target');
let collectedCount = 0;
let totalPoints = 0;

const soundCorrect = new Audio('./public/music/sound/correct.mp3');
const soundComplete = new Audio('./public/music/sound/complete.mp3');

let touchDraggedItemEl = null;
let cloneEl = null;

function playCorrectSound() {
    try {
        if (soundCorrect) {
            soundCorrect.pause();
            soundCorrect.currentTime = 0;
            soundCorrect.play();
        }
    } catch (e) {
        console.warn("Gagal memutar suara koleksi. Pastikan file audio tersedia.", e);
    }
}

const reuseBottlesContainer = document.getElementById('reuse-bottles-container');
const reuseTargetContainer = document.getElementById('reuse-target-container');
const reuseSection = document.getElementById('reuse-section');
const dropErrorContainer = document.getElementById('reuse-drop-error-message');
const heroSection = document.getElementById('hero-section');

function createItemElement(item, isDraggable = false) {
    const itemElement = document.createElement('div');
    itemElement.dataset.id = item.id;
    itemElement.dataset.matchId = item.matchId || '';

    if (item.pointValue) {
        itemElement.dataset.pointValue = item.pointValue;
    }

    if (isDraggable) {
        itemElement.className = `reuse-item w-16 h-16 p-2 text-center cursor-grab 
                                bg-transparent transition-all duration-300 
                                hover:scale-110 flex flex-col justify-center items-center absolute
                                bottle-drag-source touch-drag-source`;
        itemElement.setAttribute('draggable', true);

        const randomX = Math.random() * 90;
        const randomY = Math.random() * 90;
        itemElement.style.top = `${randomY}%`;
        itemElement.style.left = `${randomX}%`;

        itemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" class="reuse-drag-image w-full h-full object-contain" />
        `;

    } else {
        itemElement.className = `reuse-target w-full p-4 rounded-lg text-center h-full min-h-[150px]
                                bg-green-500 dark:bg-green-700 border-4 border-dashed border-white/50 
                                transition-all duration-300 drop-target flex flex-col justify-center items-center`;
        itemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" class="w-24 h-24 mx-auto mb-2" />
            <p class="text-xl font-bold text-white mb-2">${item.name}</p>
            <p id="total-points-display" class="text-4xl font-extrabold text-yellow-300">${totalPoints} Poin</p>
            <p id="collected-count" class="text-lg font-extrabold text-white/80">${collectedCount} / ${REUSE_BOTTLE_COUNT} Botol Terkumpul</p>
        `;
    }

    return itemElement;
}

function renderItems() {
    const unshuffledBottles = BOTTLE_ITEMS.filter(item => !item.isCollected);

    reuseBottlesContainer.innerHTML = '';
    unshuffledBottles.forEach(item => {
        const itemEl = createItemElement(item, true);
        reuseBottlesContainer.appendChild(itemEl);
    });

    reuseTargetContainer.innerHTML = '';
    const cabinetEl = createItemElement(CABINET_ITEM, false);
    reuseTargetContainer.appendChild(cabinetEl);
}

function showDropError(message) {
    dropErrorContainer.textContent = message;
    dropErrorContainer.classList.remove('hidden');
    dropErrorContainer.classList.add('animate-pulse');
    setTimeout(() => {
        dropErrorContainer.classList.add('hidden');
        dropErrorContainer.classList.remove('animate-pulse');
    }, 3000);
}

function checkCompletion() {
    const allCollected = collectedCount === REUSE_BOTTLE_COUNT;

    const countEl = document.getElementById('collected-count');
    const pointsEl = document.getElementById('total-points-display');

    if (countEl) {
        countEl.textContent = `${collectedCount} / ${REUSE_BOTTLE_COUNT} Botol Terkumpul`;
    }
    if (pointsEl) {
        pointsEl.textContent = `${totalPoints} Poin`;
    }


    if (allCollected) {
        try {
            soundComplete.play();
        } catch (e) {
            console.warn("Gagal memutar suara selesai game.", e);
        }

        reuseBottlesContainer.removeEventListener('dragstart', handleDragStart);
        reuseBottlesContainer.removeEventListener('dragend', handleDragEnd);
        reuseTargetContainer.removeEventListener('dragover', handleDragOver);
        reuseTargetContainer.removeEventListener('dragleave', handleDragLeave);
        reuseTargetContainer.removeEventListener('drop', handleDrop);

        reuseBottlesContainer.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);

        setGameCompleted('reuse');
        handleGameSuccess();
    }
}

function handleGameSuccess() {
    applyHeroBackgroundSafely(['bg-teal-300', 'dark:bg-teal-600', 'bg-gradient-to-br', 'from-cyan-300', 'to-teal-500']);

    markSectionAsComplete('reuse');

    reuseBottlesContainer.classList.add('hidden');
    reuseTargetContainer.classList.add('hidden');

    const newContent = `
        <div class="text-center p-8 bg-teal-50 dark:bg-teal-900 rounded-lg">
            <h3 class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-4">🥳 Selamat! Botol Berhasil Dikumpulkan!</h3>
            <p class="text-3xl font-extrabold text-yellow-500 dark:text-yellow-300 mb-4">TOTAL POIN: ${totalPoints}</p>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                Anda telah berhasil mengumpulkan dan 'menyelamatkan' semua botol bekas. Ini adalah inti dari <b> Reuse </b> 
                Memberi kesempatan kedua pada barang yang sudah ada agar tidak menjadi sampah.
            </p>
            <p class="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Langkah selanjutnya adalah mengubah botol-botol ini menjadi barang baru yang berguna!
            </p>
        </div>
    `;

    const reuseGameWrapper = document.getElementById('reuse-game-wrapper');
    if (reuseGameWrapper) {
        reuseGameWrapper.innerHTML = newContent;
        reuseGameWrapper.classList.remove('grid', 'md:grid-cols-2', 'gap-10');
    }
}


function handleDragStart(e) {
    const bottleElement = e.target.closest('.bottle-drag-source');
    if (!bottleElement) return;

    e.dataTransfer.setData('text/plain', bottleElement.dataset.id);
    bottleElement.classList.add('opacity-40');

    const dragImage = bottleElement.querySelector('.reuse-drag-image');
    if (dragImage) {
        e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
    }
}

function handleDragEnd(e) {
    const bottleElement = e.target.closest('.bottle-drag-source');
    if (bottleElement) {
        bottleElement.classList.remove('opacity-40');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.drop-target');
    if (target) {
        target.classList.add('ring-4', 'ring-blue-400', 'scale-[1.02]');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.drop-target');
    if (target) {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.02]');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const dropTarget = e.target.closest('.drop-target');

    if (!dropTarget) {
        return;
    }

    dropTarget.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.02]');

    processDrop(draggedId);
}


function processDrop(draggedId) {
    const targetItem = CABINET_ITEM;

    const draggedItem = BOTTLE_ITEMS.find(item => item.id === draggedId);

    if (!draggedItem) {
        showDropError(`⚠️ Item yang diseret tidak ditemukan atau sudah dikumpulkan.`);
        return;
    }

    if (draggedItem.isCollected) {
        showDropError(`Botol #${draggedId.split('-').pop()} sudah terkumpul!`);
        return;
    }

    const isMatch = draggedItem.matchId === targetItem.id;

    if (isMatch) {
        const pointEarned = draggedItem.pointValue;
        playCorrectSound();

        draggedItem.isCollected = true;
        collectedCount++;
        totalPoints += pointEarned;

        const sourceItemEl = reuseBottlesContainer.querySelector(`[data-id="${draggedId}"]`);
        if (sourceItemEl) {
            sourceItemEl.remove();
        }

        checkCompletion();
    } else {
        showDropError(`❌ Hanya botol yang bisa dimasukkan ke ${targetItem.name}. Coba lagi!`);
    }
}


function handleTouchStart(e) {
    const touch = e.touches[0];
    touchDraggedItemEl = touch.target.closest('.touch-drag-source');

    if (!touchDraggedItemEl) return;

    e.preventDefault();

    cloneEl = touchDraggedItemEl.cloneNode(true);
    cloneEl.classList.add('fixed', 'opacity-70', 'pointer-events-none', 'z-50', 'touch-clone');
    cloneEl.style.width = touchDraggedItemEl.offsetWidth + 'px';
    cloneEl.style.height = touchDraggedItemEl.offsetHeight + 'px';
    cloneEl.style.transform = 'translate(-50%, -50%)';
    cloneEl.style.transition = 'none';

    cloneEl.style.left = touch.clientX + 'px';
    cloneEl.style.top = touch.clientY + 'px';
    document.body.appendChild(cloneEl);

    touchDraggedItemEl.classList.add('opacity-40');
}

function handleTouchMove(e) {
    if (!cloneEl) return;

    e.preventDefault();

    const touch = e.touches[0];

    cloneEl.style.left = touch.clientX + 'px';
    cloneEl.style.top = touch.clientY + 'px';

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = targetElement ? targetElement.closest('.drop-target') : null;

    document.querySelectorAll('.drop-target').forEach(target => {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.02]');
    });

    if (dropTarget) {
        dropTarget.classList.add('ring-4', 'ring-blue-400', 'scale-[1.02]');
    }
}

function handleTouchEnd(e) {
    if (!cloneEl || !touchDraggedItemEl) return;

    e.preventDefault();

    const lastTouch = e.changedTouches[0];
    const draggedId = touchDraggedItemEl.dataset.id;

    document.body.removeChild(cloneEl);
    cloneEl = null;

    touchDraggedItemEl.classList.remove('opacity-40');
    touchDraggedItemEl = null;

    document.querySelectorAll('.drop-target').forEach(target => {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.02]');
    });

    const targetElement = document.elementFromPoint(lastTouch.clientX, lastTouch.clientY);
    const dropTarget = targetElement ? targetElement.closest('.drop-target') : null;

    if (dropTarget) {
        processDrop(draggedId);
    }
}


export function initializeReuseSection() {
    const bottleContainer = document.getElementById('reuse-bottles-container');
    if (bottleContainer) {
        bottleContainer.style.position = 'relative';
    }

    renderItems();

    reuseBottlesContainer.addEventListener('dragstart', handleDragStart);
    reuseBottlesContainer.addEventListener('dragend', handleDragEnd);

    reuseTargetContainer.addEventListener('dragover', handleDragOver);
    reuseTargetContainer.addEventListener('dragleave', handleDragLeave);
    reuseTargetContainer.addEventListener('drop', handleDrop);

    reuseBottlesContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    checkCompletion();
}