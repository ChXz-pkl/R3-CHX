import { setGameCompleted } from "../GameController.js";
import { applyHeroBackgroundSafely, markSectionAsComplete } from "./HeroSection.js"; 
const ALL_RECYCLE_PRODUCTS = [
    {
        id: 'new-book',
        name: 'Buku Baru',
        imgSrc: './public/img/recycle/product/book.svg',
        materials: ['kertas-bekas', 'kardus-bekas'],
        isCrafted: false,
    },
    {
        id: 'plastic-lumber',
        name: 'Kayu Plastik',
        imgSrc: './public/img/recycle/product/plastic_lumber.svg',
        materials: ['botol-hdpe', 'botol-pet'],
        isCrafted: false,
    },
    {
        id: 'glass-tile',
        name: 'Ubin Kaca',
        imgSrc: './public/img/recycle/product/glass_tile.svg',
        materials: ['kaca-botol', 'kaca-piring'],
        isCrafted: false,
    },
    {
        id: 'metal-bar',
        name: 'Batang Logam',
        imgSrc: './public/img/recycle/product/metal_bar.svg',
        materials: ['kaleng-aluminium', 'kaleng-besi'],
        isCrafted: false,
    },
    {
        id: 'compost',
        name: 'Kompos',
        imgSrc: './public/img/recycle/product/compost.svg',
        materials: ['sisa-sayuran', 'kulit-buah'],
        isCrafted: false,
    },
    {
        id: 'yarn',
        name: 'Benang Daur Ulang',
        imgSrc: './public/img/recycle/product/yarn.svg',
        materials: ['kain-bekas', 'plastik-film'],
        isCrafted: false,
    },
    {
        id: 'oil-paint',
        name: 'Cat Minyak',
        imgSrc: './public/img/recycle/product/oil_paint.svg',
        materials: ['minyak-jelantah', 'ampas-kopi'],
        isCrafted: false,
    },
    {
        id: 'brick',
        name: 'Batu Bata',
        imgSrc: './public/img/recycle/product/brick.svg',
        materials: ['serbuk-kayu', 'styrofoam-bekas'],
        isCrafted: false,
    },
    {
        id: 'new-paper',
        name: 'Kertas Daur Ulang',
        imgSrc: './public/img/recycle/product/paper_new.svg',
        materials: ['kertas-bekas', 'kain-bekas'],
        isCrafted: false,
    },
    {
        id: 'insulation',
        name: 'Material Isolasi',
        imgSrc: './public/img/recycle/product/insulation.svg',
        materials: ['kardus-bekas', 'plastik-film'],
        isCrafted: false,
    },
    {
        id: 'new-bottle',
        name: 'gelas Kaca',
        imgSrc: './public/img/recycle/product/glass_bottle_new.svg',
        materials: ['kaca-botol', 'kaleng-aluminium'],
        isCrafted: false,
    },
    {
        id: 'plastic-fuel',
        name: 'Bahan Bakar Plastik',
        imgSrc: './public/img/recycle/product/plastic_fuel.svg',
        materials: ['botol-hdpe', 'minyak-jelantah'],
        isCrafted: false,
    },
];

const BASE_MATERIALS = [
    { id: 'kertas-bekas', name: 'Kertas', imgSrc: './public/img/recycle/material/paper.svg', isUsed: false },
    { id: 'kardus-bekas', name: 'Kardus', imgSrc: './public/img/recycle/material/cardboard.svg', isUsed: false },
    { id: 'botol-hdpe', name: 'HDPE', imgSrc: './public/img/recycle/material/hdpe.svg', isUsed: false },
    { id: 'botol-pet', name: 'PET', imgSrc: './public/img/recycle/material/pet.svg', isUsed: false },
    { id: 'kaca-botol', name: 'Botol Kaca', imgSrc: './public/img/recycle/material/glass_bottle.svg', isUsed: false },
    { id: 'kaca-piring', name: 'Piring Kaca', imgSrc: './public/img/recycle/material/glass_plate.svg', isUsed: false },
    { id: 'kaleng-aluminium', name: 'Alumunium', imgSrc: './public/img/recycle/material/aluminum.svg', isUsed: false },
    { id: 'kaleng-besi', name: 'Besi', imgSrc: './public/img/recycle/material/tin.svg', isUsed: false },
    { id: 'sisa-sayuran', name: 'Sayuran', imgSrc: './public/img/recycle/material/vegetable.svg', isUsed: false },
    { id: 'kulit-buah', name: 'Kulit Buah', imgSrc: './public/img/recycle/material/fruit_peel.svg', isUsed: false },
    { id: 'kain-bekas', name: 'Kain', imgSrc: './public/img/recycle/material/fabric.svg', isUsed: false },
    { id: 'plastik-film', name: 'Plastik Film', imgSrc: './public/img/recycle/material/film.svg', isUsed: false },
    { id: 'minyak-jelantah', name: 'Minyak', imgSrc: './public/img/recycle/material/oil.svg', isUsed: false },
    { id: 'ampas-kopi', name: 'Ampas Kopi', imgSrc: './public/img/recycle/material/coffee.svg', isUsed: false },
    { id: 'serbuk-kayu', name: 'Serbuk Kayu', imgSrc: './public/img/recycle/material/wood_shaving.svg', isUsed: false },
    { id: 'styrofoam-bekas', name: 'Styrofoam', imgSrc: './public/img/recycle/material/styrofoam.svg', isUsed: false },
];


let machineSlots = [null, null];
let productsCraftedCount = 0;
let totalHitCounter = 0;
let hintTriggerCounter = 0;
const TARGET_PRODUCTS_COUNT = 6;
let ACTIVE_RECYCLE_PRODUCTS = [];
let ACTIVE_RECYCLE_MATERIALS = [];

let draggedElement = null;
let currentDraggedId = null;

const soundCorrect = new Audio('./public/music/sound/correct.mp3');
const soundIncorrect = new Audio('./public/music/sound/incorrect.mp3');
const soundComplete = new Audio('./public/music/sound/complete.mp3');

function playCraftSuccessSound() {
    try {
        if (soundCorrect) {
            soundCorrect.pause();
            soundCorrect.currentTime = 0;
            soundCorrect.play();
        }
    } catch (e) {
        console.warn("Gagal memutar suara sukses crafting. Pastikan file audio tersedia (./public/music/sound/correct.mp3).", e);
    }
}

function playCraftIncorrectSound() {
    try {
        if (soundIncorrect) {
            soundIncorrect.pause();
            soundIncorrect.currentTime = 0;
            soundIncorrect.play();
        }
    } catch (e) {
        console.warn("Gagal memutar suara gagal crafting. Pastikan file audio tersedia (./public/music/sound/incorrect.mp3).", e);
    }
}

const recycleMaterialsContainer = document.getElementById('recycle-materials-container');
const recycleMachineSlot1 = document.getElementById('machine-slot-1');
const recycleMachineSlot2 = document.getElementById('machine-slot-2');
const recycleDropErrorContainer = document.getElementById('recycle-drop-error-message');
const heroSection = document.getElementById('hero-section');
const hitCounterElement = document.getElementById('hit-counter-value');
const hintElement = document.getElementById('hint-message');

const recycleOutputSlot1 = document.getElementById('output-slot-1');
const recycleOutputSlot2 = document.getElementById('output-slot-2');
const recycleOutputSlot3 = document.getElementById('output-slot-3');
const recycleOutputSlot4 = document.getElementById('output-slot-4');
const recycleOutputSlot5 = document.getElementById('output-slot-5');
const recycleOutputSlot6 = document.getElementById('output-slot-6');


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupRecycleGame() {
    const allProducts = [...ALL_RECYCLE_PRODUCTS];
    shuffleArray(allProducts);

    ACTIVE_RECYCLE_PRODUCTS = allProducts.slice(0, TARGET_PRODUCTS_COUNT).map(p => ({
        ...p,
        isCrafted: false
    }));

    const requiredMaterialIds = new Set();
    ACTIVE_RECYCLE_PRODUCTS.forEach(p => {
        p.materials.forEach(m => requiredMaterialIds.add(m));
    });

    const baseMaterialsNeeded = BASE_MATERIALS.filter(m => requiredMaterialIds.has(m.id));

    ACTIVE_RECYCLE_MATERIALS = [
        ...baseMaterialsNeeded.map(m => ({ ...m, id: m.id + '-A' })),
        ...baseMaterialsNeeded.map(m => ({ ...m, id: m.id + '-B' }))
    ];

    productsCraftedCount = 0;
    machineSlots = [null, null];
    totalHitCounter = 0;
    hintTriggerCounter = 0;

    updateHitCounter();

    [recycleOutputSlot1, recycleOutputSlot2, recycleOutputSlot3, recycleOutputSlot4, recycleOutputSlot5, recycleOutputSlot6].forEach(slot => {
        if (slot) {
            slot.dataset.filled = 'false';
            slot.innerHTML = `<p class="text-xs text-gray-500">Produk ${slot.id.split('-').pop()}</p>`;
        }
    });
}

function createItemElement(item, isDraggable = false) {
    const itemElement = document.createElement('div');
    itemElement.dataset.id = item.id;

    if (isDraggable) {
        itemElement.className = `
                                recycle-item p-2 xs:w-16 xs:h-16 w-18 h-18 md:w-20 md:h-20 text-center cursor-grab 
                                bg-gray-200 dark:bg-gray-700 rounded-lg 
                                transition-all duration-300 hover:scale-110 flex flex-col justify-center items-center shadow-lg`;
        itemElement.setAttribute('draggable', true);
        itemElement.classList.add('material-drag-source');

        itemElement.innerHTML = `<img src="${item.imgSrc}" alt="${item.name}" class="recycle-drag-image xs:w-8 xs:h-8 w-10 h-10 md:w-12 md:h-12 object-contain" />
                                 <p class="text-xs font-semibold mt-1">${item.name.replace(/-\s*[A|B]$/, '')}</p>`;
    } else if (item.materials) {
        itemElement.className = `product-item w-full h-full p-2 text-center 
                                bg-green-500 dark:bg-green-700 rounded-lg 
                                flex flex-col justify-center items-center shadow-2xl`;
        itemElement.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}" class="w-16 h-16 mx-auto mb-1" />
            <p class="text-sm font-bold text-white leading-tight">${item.name}</p>
        `;
    }
    else {
        itemElement.className = `slot-item w-full h-full p-2 text-center cursor-pointer
                                bg-yellow-400 dark:bg-yellow-600 rounded-lg 
                                flex flex-col justify-center items-center shadow-lg`;
        itemElement.innerHTML = `<img src="${item.imgSrc}" alt="${item.name}" class="w-16 h-16 object-contain" />`;
    }

    return itemElement;
}

function renderItems() {
    const availableMaterials = ACTIVE_RECYCLE_MATERIALS.filter(item => !item.isUsed);

    if (!recycleMaterialsContainer) return;

    recycleMaterialsContainer.innerHTML = '';

    if (availableMaterials.length === 0 && productsCraftedCount < TARGET_PRODUCTS_COUNT) {
        recycleMaterialsContainer.innerHTML = `
             <p class="text-lg font-bold text-red-500 dark:text-red-400 p-4">Material Habis! Coba acak ulang game.</p>
        `;
    } else if (availableMaterials.length === 0 && productsCraftedCount === TARGET_PRODUCTS_COUNT) {
    }
    else {
        availableMaterials.forEach(item => {
            const itemEl = createItemElement(item, true);
            recycleMaterialsContainer.appendChild(itemEl);
        });
    }

    updateMachineSlotsDOM();
}

function updateMachineSlotsDOM() {
    [recycleMachineSlot1, recycleMachineSlot2].forEach((slotEl, index) => {
        if (!slotEl) return;
        const material = machineSlots[index];
        slotEl.innerHTML = '';

        if (material) {
            const itemEl = createItemElement(material, false);
            slotEl.appendChild(itemEl);
        } else {
            slotEl.innerHTML = `
                <div class="text-center text-gray-400 dark:text-gray-500 p-2">
                    <p class="text-lg font-semibold">Slot ${index + 1}</p>
                    <p class="text-sm">Seret Material</p>
                </div>
            `;
        }
    });
}

function showDropError(message) {
    if (!recycleDropErrorContainer) return;
    recycleDropErrorContainer.textContent = message;
    recycleDropErrorContainer.classList.remove('hidden');
    recycleDropErrorContainer.classList.add('animate-pulse');
    setTimeout(() => {
        recycleDropErrorContainer.classList.add('hidden');
        recycleDropErrorContainer.classList.remove('animate-pulse');
    }, 3000);
}

function displayProduct(product) {
    const productEl = createItemElement(product, false);

    const outputSlots = [
        recycleOutputSlot1, recycleOutputSlot2, recycleOutputSlot3,
        recycleOutputSlot4, recycleOutputSlot5, recycleOutputSlot6
    ].filter(slot => slot !== null);

    let targetSlot = null;

    for (const slot of outputSlots) {
        if (slot.dataset.filled === 'false') {
            targetSlot = slot;
            break;
        }
    }

    if (targetSlot) {
        targetSlot.innerHTML = '';
        targetSlot.appendChild(productEl);
        targetSlot.dataset.filled = 'true';
    }
}

function updateHitCounter() {
    if (hitCounterElement) {
        hitCounterElement.textContent = totalHitCounter;
    }

    const nonCraftedProducts = ACTIVE_RECYCLE_PRODUCTS.filter(p => !p.isCrafted);

    if (nonCraftedProducts.length === 0) {
        if (hintElement) hintElement.classList.add('hidden');
        return;
    }

    let productsToShow = [];
    let hintText = '';
    let showHint = false;

    if (hintTriggerCounter >= 2) {
        showHint = true;

        if (hintTriggerCounter >= 2 && hintTriggerCounter <= 3) {
            productsToShow = nonCraftedProducts.slice(0, 1);
            hintText = productsToShow.map(p =>
                `(${BASE_MATERIALS.find(m => m.id === p.materials[0]).name} + *** = ${p.name})`
            ).join(', ');
        }
        else if (hintTriggerCounter >= 4) { 
            productsToShow = nonCraftedProducts.slice(0, 2);

            if (productsToShow.length > 0) {
                const p1 = productsToShow[0];
                const fullHint = `(${BASE_MATERIALS.find(m => m.id === p1.materials[0]).name} + ${BASE_MATERIALS.find(m => m.id === p1.materials[1]).name} = ${p1.name})`;

                const partialHints = productsToShow.slice(1).map(p =>
                    `(${BASE_MATERIALS.find(m => m.id === p.materials[0]).name} + *** = ${p.name})`
                ).join(', ');

                hintText = fullHint + (partialHints ? ', ' + partialHints : '');
            } else {
                showHint = false;
            }
        }
    } else {
        showHint = false;
    }

    if (hintElement) {
        if (showHint) {
            hintElement.innerHTML = `
                <span class="font-bold">🆘 PETUNJUK (Kesalahan Kombinasi: ${hintTriggerCounter}):</span> 
                Beberapa kombinasi yang belum dibuat: ${hintText}
            `;
            hintElement.classList.remove('hidden');
        } else {
            hintElement.classList.add('hidden');
        }
    }
}

function checkRecycleProcess() {
    if (machineSlots[0] && machineSlots[1]) {
        const material1 = machineSlots[0];
        const material2 = machineSlots[1];

        const material1IdBase = material1.id.slice(0, -2);
        const material2IdBase = material2.id.slice(0, -2);

        if (material1IdBase === material2IdBase) {
            playCraftIncorrectSound();
            showDropError(`❌ Material tidak boleh dari jenis yang sama (${material1.name.replace(/-\s*[A|B]$/, '')}). Silakan **klik** salah satu material di slot mesin untuk mengeluarkannya.`);
            totalHitCounter++;
            hintTriggerCounter++;
            updateHitCounter();
            return;
        }

        let isMatch = false;
        let matchedProduct = null;

        for (const product of ACTIVE_RECYCLE_PRODUCTS) {
            const materials = product.materials;

            const isMatch1 = materials.includes(material1IdBase) && materials.includes(material2IdBase);
            const isMatch2 = materials.includes(material2IdBase) && materials.includes(material1IdBase);

            if ((isMatch1 || isMatch2) && materials.length === 2) {
                isMatch = true;
                matchedProduct = product;
                break;
            }
        }

        if (isMatch && !matchedProduct.isCrafted) {

            hintTriggerCounter = 0;

            playCraftSuccessSound();

            matchedProduct.isCrafted = true;
            productsCraftedCount++;

            const item1Index = ACTIVE_RECYCLE_MATERIALS.findIndex(item => item.id === material1.id);
            const item2Index = ACTIVE_RECYCLE_MATERIALS.findIndex(item => item.id === material2.id);

            if (item1Index > -1) ACTIVE_RECYCLE_MATERIALS[item1Index].isUsed = true;
            if (item2Index > -1) ACTIVE_RECYCLE_MATERIALS[item2Index].isUsed = true;

            machineSlots = [null, null];

            updateMachineSlotsDOM();
            renderItems();

            displayProduct(matchedProduct);

            updateHitCounter();
            checkCompletion();

        } else if (isMatch && matchedProduct.isCrafted) {
            playCraftIncorrectSound();
            showDropError(`Produk ${matchedProduct.name} sudah dibuat! Klik salah satu material di slot mesin untuk mengeluarkannya dan coba kombinasi lain.`);
            totalHitCounter++;
            hintTriggerCounter++;
            updateHitCounter();
        } else {
            playCraftIncorrectSound();
            showDropError(`❌ Kombinasi tidak menghasilkan produk baru. Coba lagi!`);
            totalHitCounter++;
            hintTriggerCounter++;
            updateHitCounter();
        }
    }
}

function checkCompletion() {
    const allCrafted = productsCraftedCount === TARGET_PRODUCTS_COUNT;

    if (allCrafted) {
        try {
            soundComplete.play();
        } catch (e) {
            console.warn("Gagal memutar suara selesai game.", e);
        }
        handleGameSuccess();
        setGameCompleted('recycle');
    }
}

function handleGameSuccess() {
    applyHeroBackgroundSafely(['bg-green-800', 'dark:bg-gray-800', 'bg-gradient-to-r', 'from-green-800', 'to-green-900']);
    markSectionAsComplete('recycle');

    if (recycleMaterialsContainer) {
        if (recycleMaterialsContainer.classList.contains('hidden')) {
            recycleMaterialsContainer.classList.remove('hidden');
        }

        recycleMaterialsContainer.innerHTML = '';

        const successMessage = document.createElement('div');
        successMessage.className = `text-center p-6 bg-lime-100 dark:bg-lime-900 rounded-lg shadow-lg mb-6 col-span-2 transition-all duration-500`;
        successMessage.innerHTML = `
            <h3 class="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">🎉 Selamat! Tantangan Recycle Selesai!</h3>
            <p class="text-gray-700 dark:text-gray-300">
                Anda telah berhasil membuat ${TARGET_PRODUCTS_COUNT} produk daur ulang dengan total ${totalHitCounter} kesalahan.
            </p>
        `;
        recycleMaterialsContainer.className = `p-4 border-4 border-dashed border-green-700 dark:border-green-400 rounded-lg bg-green-50 dark:bg-green-950 shadow-inner flex flex-wrap gap-4 justify-center min-h-[100px] transition-all duration-500`;
        recycleMaterialsContainer.appendChild(successMessage);
    }

    const machineArea = document.querySelector('.machine-area');
    if (machineArea) {
        const machineSlotsContainer = machineArea.querySelector('.machine-slots');
        if (machineSlotsContainer) {
            machineSlotsContainer.innerHTML = `
                <div class="col-span-2 text-center text-xl font-bold text-green-700 dark:text-green-400">✅ Daur Ulang Selesai!</div>
            `;
            machineArea.classList.remove('bg-gray-300', 'dark:bg-gray-700');
            machineArea.classList.add('bg-green-100', 'dark:bg-green-800');
        }
    }

    const hitContainer = hitCounterElement ? hitCounterElement.closest('div') : null;
    if (hitContainer) hitContainer.classList.add('hidden');
}

function handleDragStart(e) {
    const bottleElement = e.target.closest('.material-drag-source');
    if (!bottleElement) return;

    e.dataTransfer.setData('text/plain', bottleElement.dataset.id);
    e.target.classList.add('opacity-40');

    const dragImage = bottleElement.querySelector('.recycle-drag-image');
    if (dragImage) {
        e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
    }
}

function handleDragEnd(e) {
    const bottleElement = e.target.closest('.material-drag-source');
    if (bottleElement) {
        bottleElement.classList.remove('opacity-40');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.machine-slot');
    if (target) {
        const slotIndex = parseInt(target.dataset.slotIndex);
        if (!machineSlots[slotIndex]) {
            target.classList.add('ring-4', 'ring-yellow-400', 'scale-[1.02]');
        }
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.machine-slot');
    if (target) {
        target.classList.remove('ring-4', 'ring-yellow-400', 'scale-[1.02]');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const dropTarget = e.target.closest('.machine-slot');

    if (!dropTarget) return;

    dropTarget.classList.remove('ring-4', 'ring-yellow-400', 'scale-[1.02]');

    const slotIndex = parseInt(dropTarget.dataset.slotIndex);
    const draggedItem = ACTIVE_RECYCLE_MATERIALS.find(item => item.id === draggedId);

    if (!draggedItem) {
        showDropError('Item tidak valid atau sudah digunakan.');
        return;
    }

    if (draggedItem.isUsed) {
        showDropError(`${draggedItem.name} sudah digunakan!`);
        return;
    }

    if (machineSlots[slotIndex]) {
        showDropError(`Slot ${slotIndex + 1} sudah terisi. Klik material di slot untuk mengeluarkannya.`);
        return;
    }

    machineSlots[slotIndex] = draggedItem;

    updateMachineSlotsDOM();

    checkRecycleProcess();
}

function getElementFromTouch(touch) {
    return document.elementFromPoint(touch.clientX, touch.clientY);
}

function handleTouchStart(e) {
    e.preventDefault();

    const bottleElement = e.target.closest('.material-drag-source');
    if (!bottleElement) return;

    const materialId = bottleElement.dataset.id;
    const draggedItem = ACTIVE_RECYCLE_MATERIALS.find(item => item.id === materialId);

    if (!draggedItem || draggedItem.isUsed) {
        return;
    }

    draggedElement = bottleElement;
    currentDraggedId = materialId;

    draggedElement.classList.add('opacity-40', 'touch-dragging');
}

function handleTouchMove(e) {
    if (!draggedElement) return;

    const touch = e.touches[0];
    e.preventDefault();

    const targetElement = getElementFromTouch(touch);

    document.querySelectorAll('.machine-slot.ring-4').forEach(slot => {
        slot.classList.remove('ring-4', 'ring-yellow-400', 'scale-[1.02]');
    });

    const dropTarget = targetElement ? targetElement.closest('.machine-slot') : null;

    if (dropTarget) {
        const slotIndex = parseInt(dropTarget.dataset.slotIndex);
        if (!machineSlots[slotIndex]) {
            dropTarget.classList.add('ring-4', 'ring-yellow-400', 'scale-[1.02]');
        }
    }
}

function handleTouchEnd(e) {
    if (!draggedElement) return;

    draggedElement.classList.remove('opacity-40', 'touch-dragging');

    document.querySelectorAll('.machine-slot.ring-4').forEach(slot => {
        slot.classList.remove('ring-4', 'ring-yellow-400', 'scale-[1.02]');
    });

    const touch = e.changedTouches[0];
    const targetElement = getElementFromTouch(touch);
    const dropTarget = targetElement ? targetElement.closest('.machine-slot') : null;

    if (dropTarget) {
        const slotIndex = parseInt(dropTarget.dataset.slotIndex);
        const draggedId = currentDraggedId;
        const draggedItem = ACTIVE_RECYCLE_MATERIALS.find(item => item.id === draggedId);

        if (!draggedItem || draggedItem.isUsed) {
            showDropError('Item tidak valid atau sudah digunakan.');
        }
        else if (machineSlots[slotIndex]) {
            showDropError(`Slot ${slotIndex + 1} sudah terisi. Klik material di slot untuk mengeluarkannya.`);
        } else {
            machineSlots[slotIndex] = draggedItem;
            updateMachineSlotsDOM();
            checkRecycleProcess();
        }
    }

    draggedElement = null;
    currentDraggedId = null;
}

export function initializeRecycleSection() {
    setupRecycleGame();
    renderItems();

    if (recycleMaterialsContainer) {
        recycleMaterialsContainer.addEventListener('dragstart', handleDragStart);
        recycleMaterialsContainer.addEventListener('dragend', handleDragEnd);
    }

    [recycleMachineSlot1, recycleMachineSlot2].forEach(slotEl => {
        if (slotEl) {
            slotEl.addEventListener('dragover', handleDragOver);
            slotEl.addEventListener('dragleave', handleDragLeave);
            slotEl.addEventListener('drop', handleDrop);
        }
    });

    if (recycleMaterialsContainer) {
        recycleMaterialsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        recycleMaterialsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        recycleMaterialsContainer.addEventListener('touchend', handleTouchEnd);
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);


    [recycleMachineSlot1, recycleMachineSlot2].forEach((slotEl, index) => {
        if (slotEl) {
            slotEl.addEventListener('click', (e) => {
                if (machineSlots[index] && e.target.closest('.machine-slot') === slotEl) {

                    machineSlots[index] = null;

                    updateMachineSlotsDOM();
                    renderItems();
                }
            });
        }
    });
}