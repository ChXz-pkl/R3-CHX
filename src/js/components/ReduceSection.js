import { setGameCompleted } from "../GameController.js";

const REDUCE_ITEMS = [
    // ... (REDUCE_ITEMS array tetap sama)
    {
        id: 'plastik-sekali-pakai',
        type: 'wrong',
        name: 'Plastik Sekali Pakai',
        matchId: 'tas-belanja',
        imgSrc: './public/img/reduce/wrong_plastic.svg',
        placeholder: 'Ganti dengan Tas Belanja',
        isReplaced: false
    },
    {
        id: 'masker-sekali-pakai',
        type: 'wrong',
        name: 'Masker Sekali Pakai',
        matchId: 'masker-kain',
        imgSrc: './public/img/reduce/wrong_mask.svg',
        placeholder: 'Ganti dengan Masker Kain',
        isReplaced: false
    },
    {
        id: 'botol-plastik-sekali-pakai',
        type: 'wrong',
        name: 'Botol Plastik',
        matchId: 'botol-tahan-lama',
        imgSrc: './public/img/reduce/wrong_bottle.svg',
        placeholder: 'Ganti dengan Botol Tahan Lama',
        isReplaced: false
    },
    {
        id: 'tisu-kertas',
        type: 'wrong',
        name: 'Tisu Kertas',
        matchId: 'lap-kain',
        imgSrc: './public/img/reduce/wrong_tissue.svg',
        placeholder: 'Ganti dengan Lap Kain',
        isReplaced: false
    },
    {
        id: 'tas-belanja',
        type: 'correct',
        name: 'Tas Belanja',
        imgSrc: './public/img/reduce/correct_bag.svg',
        matchId: 'plastik-sekali-pakai',
        isUsed: false 
    },
    {
        id: 'masker-kain',
        type: 'correct',
        name: 'Masker Kain',
        imgSrc: './public/img/reduce/correct_cloth_mask.svg',
        matchId: 'masker-sekali-pakai',
        isUsed: false
    },
    {
        id: 'botol-tahan-lama',
        type: 'correct',
        name: 'Botol Tahan Lama (Kaca/Stainless)',
        imgSrc: './public/img/reduce/correct_durable_bottle.svg',
        matchId: 'botol-plastik-sekali-pakai',
        isUsed: false
    },
    {
        id: 'lap-kain',
        type: 'correct',
        name: 'Lap Kain',
        imgSrc: './public/img/reduce/correct_cloth.svg',
        matchId: 'tisu-kertas',
        isUsed: false
    },
];

const CORRECT_ITEMS = REDUCE_ITEMS.filter(item => item.type === 'correct');
let WRONG_ITEMS = REDUCE_ITEMS.filter(item => item.type === 'wrong');

const correctContainer = document.getElementById('correct-items-container');
const wrongContainer = document.getElementById('wrong-items-container');
const bottomSection = document.getElementById('bottom-section');
const bottomSuccessArea = document.getElementById('bottom-success-area');
const moveCorrectButton = document.getElementById('move-correct-button');
const reduceSuccessMessage = document.getElementById('reduce-success-message');
const heroSection = document.getElementById('hero-section');
const dropErrorContainer = document.getElementById('drop-error-message');

let draggedIdInProgress; 

// Tambahkan variabel baru untuk touch/mobile
let touchDraggedItemEl = null; 
let cloneEl = null; 

const soundCorrect = new Audio('./public/music/sound/correct.mp3'); 
const soundIncorrect = new Audio('./public/music/sound/incorrect.mp3'); 
const soundComplete = new Audio('./public/music/sound/complete.mp3'); 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createItemElement(item, isDraggable = false) {
    const itemElement = document.createElement('div');

    if (isDraggable) {
        // PERHATIAN: Tambahkan kelas 'touch-drag-source'
        itemElement.className = `reduce-item w-full h-[12rem] p-2 text-center cursor-grab 
                                bg-yellow-100 dark:bg-yellow-900 text-gray-800 dark:text-white 
                                transition-all duration-300 border-b border-yellow-300 dark:border-yellow-700 
                                hover:shadow-lg flex flex-col justify-center items-center`;

        itemElement.setAttribute('draggable', isDraggable);
        itemElement.classList.add('correct-drag-source', 'touch-drag-source');
    } else {
        itemElement.className = `reduce-item w-[8.5rem] p-2 rounded-lg text-center 
                                bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 
                                transition-all duration-300 wrong-drop-target`;
    }

    let content = `<img src="${item.imgSrc}" alt="${item.name}" class="reduce-drag-image w-20 h-20 mx-auto mb-2" />`;

    if (item.type === 'wrong') {
        content += `<p class="text-sm font-semibold text-gray-900 dark:text-white">${item.name}</p>`;
        content += `<p class="text-xs text-red-600 dark:text-red-400 mt-1">${item.placeholder}</p>`;
    } else if (isDraggable) {
        content += `<p class="text-base font-semibold">${item.name}</p>`;
    } else {
        content += `<p class="text-sm font-semibold text-gray-900 dark:text-white">${item.name}</p>`;
    }

    itemElement.innerHTML = content;
    itemElement.dataset.id = item.id;
    itemElement.dataset.matchId = item.matchId || '';

    return itemElement;
}

function renderItems() {
    const shuffledCorrectItems = shuffleArray(CORRECT_ITEMS.filter(item => !item.isUsed));

    correctContainer.innerHTML = '';
    shuffledCorrectItems.forEach(item => { 
        const itemEl = createItemElement(item, true);
        correctContainer.appendChild(itemEl);
    });

    wrongContainer.innerHTML = '';
    WRONG_ITEMS.forEach(item => {
        const itemEl = createItemElement(item, false);
        wrongContainer.appendChild(itemEl);
    });
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
    const allReplaced = WRONG_ITEMS.every(item => item.isReplaced);
    if (allReplaced) {
        soundComplete.play(); 

        bottomSection.style.minHeight = '150px';
        bottomSuccessArea.classList.remove('hidden');
        document.getElementById('bottom-section-title').classList.add('hidden');
        wrongContainer.classList.add('hidden');
        setGameCompleted('reduce');

        const oldBgClasses = [
            'bg-green-800', 'dark:bg-green-800', 'bg-red-700', 'bg-blue-600', 'bg-pink-500',
            'bg-green-700', 'bg-teal-600', 'bg-amber-600',
            'bg-gradient-to-br', 'from-green-800', 'to-gray-800',
            'bg-gradient-to-r', 'from-red-700', 'to-red-800',
            'from-blue-600', 'to-blue-700', 'from-pink-500', 'to-pink-600',
            'from-green-700', 'to-green-800', 'from-teal-600', 'to-cyan-700',
            'from-amber-600', 'to-orange-700'
        ];

        heroSection.classList.remove(...oldBgClasses);
        heroSection.classList.add('bg-green-300', 'dark:bg-green-600', 'bg-gradient-to-br', 'from-green-300', 'to-green-500');

        reduceSuccessMessage.classList.remove('hidden');
    }
}

function handleMoveCorrect() {
    const newCorrectItems = [];
    WRONG_ITEMS.forEach(wrongItem => {
        const matchItem = CORRECT_ITEMS.find(c => c.matchId === wrongItem.id);
        if (matchItem) {
            const itemEl = createItemElement(matchItem, false);

            itemEl.classList.remove('w-[8.5rem]', 'bg-red-50', 'dark:bg-red-900', 'border', 'border-red-300', 'dark:border-red-700', 'wrong-drop-target');

            itemEl.classList.add('w-full', 'h-[12rem]', 'p-2', 'shadow',
                'bg-yellow-100', 'dark:bg-yellow-900', 'text-gray-800', 'dark:text-white',
                'border-b', 'border-yellow-300', 'dark:border-yellow-700',
                'flex', 'flex-col', 'justify-center', 'items-center');

            let content = `<img src="${matchItem.imgSrc}" alt="${matchItem.name}" class="w-20 h-20 mx-auto mb-2" />`;
            content += `<p class="text-base font-semibold">${matchItem.name}</p>`; 
            itemEl.innerHTML = content;

            newCorrectItems.push(itemEl);
        }
    });

    correctContainer.innerHTML = '';

    correctContainer.className = 'grid grid-cols-2 gap-4';

    newCorrectItems.forEach(item => correctContainer.appendChild(item));

    bottomSection.innerHTML = `
        <div class="text-center p-8">
            <h4 class="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">🙌 Luar Biasa! Reduce Selesai!</h4>
            <p class="text-gray-700 dark:text-gray-300">
                Anda telah berhasil mengganti semua barang sekali pakai dengan pilihan yang dapat digunakan kembali. 
                Ini adalah dampak nyata dari mereduksi limbah. 
                <span class="font-semibold">Mari terus sebarkan semangat Reduce ini!</span>
            </p>
        </div>
    `;
    bottomSection.classList.remove('dark:bg-gray-700', 'bg-white');
    bottomSection.classList.add('bg-green-50', 'dark:bg-green-900');
    reduceSuccessMessage.classList.add('hidden');
}

// --- Handler Drag Standar (Tetap sama untuk desktop) ---

function handleDragStart(e) {
    const draggedItemEl = e.target.closest('[data-id]');
    
    if (!draggedItemEl || draggedItemEl.classList.contains('replaced')) {
        e.preventDefault(); 
        return;
    }

    const draggedId = draggedItemEl.dataset.id;
    const draggedItem = REDUCE_ITEMS.find(item => item.id === draggedId);

    if (!draggedItem) {
        e.preventDefault();
        return;
    }
    
    e.dataTransfer.setData('text/plain', draggedId);

    draggedItemEl.classList.add('dragging');
    draggedIdInProgress = draggedId; 
}

function handleDragEnd(e) {
    e.target.classList.remove('opacity-40');
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.wrong-drop-target');
    if (target && !WRONG_ITEMS.find(item => item.id === target.dataset.id).isReplaced) {
        target.classList.add('ring-4', 'ring-blue-400', 'scale-[1.05]');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.wrong-drop-target');
    if (target) {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.05]');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const dropTarget = e.target.closest('.wrong-drop-target');

    if (!dropTarget) return;

    // Panggil logika pencocokan yang sebenarnya
    processDrop(draggedId, dropTarget);
}

// --- Logika Inti Drop (Diperkenalkan sebagai fungsi terpisah untuk digunakan di Drag dan Touch) ---

function processDrop(draggedId, dropTarget) {
    const draggedItem = CORRECT_ITEMS.find(item => item.id === draggedId);
    const wrongItem = WRONG_ITEMS.find(item => item.id === dropTarget.dataset.id);

    const isMatch = draggedItem && wrongItem && draggedItem.matchId === wrongItem.id;

    dropTarget.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.05]');

    if (wrongItem.isReplaced) {
        showDropError(`Item ${wrongItem.name} sudah diganti!`);
        return;
    }

    if (isMatch) {

        soundCorrect.play(); 
        
        wrongItem.isReplaced = true;
        draggedItem.isUsed = true;

        const correctItemEl = document.createElement('div');
        correctItemEl.className = `reduce-item w-[8.5rem] p-2 rounded-lg text-center transition-all duration-300 wrong-drop-target`;

        correctItemEl.classList.add('bg-green-50', 'dark:bg-green-800', 'border', 'border-green-300', 'dark:border-green-700');

        let content = `<img src="${draggedItem.imgSrc}" alt="${draggedItem.name}" class="w-20 h-20 mx-auto mb-2" />`;
        content += `<p class="text-sm font-semibold text-gray-900 dark:text-white">${draggedItem.name}</p>`;
        content += `<p class="text-xs text-green-700 dark:text-green-400 mt-1">✔ Sudah Diganti</p>`;
        correctItemEl.innerHTML = content;

        dropTarget.replaceWith(correctItemEl);

        // Hapus item yang diseret dari kontainer sumber
        const sourceItemEl = correctContainer.querySelector(`[data-id="${draggedId}"]`);
        if (sourceItemEl) {
            sourceItemEl.remove();
        }

        checkCompletion();
    } else {
        soundIncorrect.play(); 
        
        const targetName = wrongItem ? wrongItem.name : 'Target tidak valid';
        const draggedName = draggedItem ? draggedItem.name : 'Item ini';

        showDropError(`❌ ${draggedName} tidak sesuai untuk menggantikan ${targetName}. Coba lagi!`);
    }
}

// --- Handler Touch untuk Mobile ---

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchDraggedItemEl = touch.target.closest('.touch-drag-source');

    if (!touchDraggedItemEl) return;

    e.preventDefault(); 
    
    // Buat kloningan (clone) untuk visual seret
    cloneEl = touchDraggedItemEl.cloneNode(true);
    cloneEl.classList.add('fixed', 'opacity-70', 'pointer-events-none', 'z-50');
    cloneEl.style.width = touchDraggedItemEl.offsetWidth + 'px';
    cloneEl.style.height = touchDraggedItemEl.offsetHeight + 'px';
    cloneEl.style.transform = 'translate(-50%, -50%)'; 

    // Atur posisi awal kloningan
    cloneEl.style.left = touch.clientX + 'px';
    cloneEl.style.top = touch.clientY + 'px';
    document.body.appendChild(cloneEl);

    // Tandai item sumber dengan opacity rendah
    touchDraggedItemEl.classList.add('opacity-40');
}

function handleTouchMove(e) {
    if (!cloneEl) return;

    e.preventDefault(); 
    
    const touch = e.touches[0];

    // Pindahkan kloningan item
    cloneEl.style.left = touch.clientX + 'px';
    cloneEl.style.top = touch.clientY + 'px';

    // Periksa apakah item berada di atas target drop
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropTarget = targetElement ? targetElement.closest('.wrong-drop-target') : null;

    // Hapus visual highlight dari semua target drop yang salah
    document.querySelectorAll('.wrong-drop-target').forEach(target => {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.05]');
    });

    // Tambahkan visual highlight jika berada di atas target yang valid
    if (dropTarget && !WRONG_ITEMS.find(item => item.id === dropTarget.dataset.id).isReplaced) {
        dropTarget.classList.add('ring-4', 'ring-blue-400', 'scale-[1.05]');
    }
}

function handleTouchEnd(e) {
    if (!cloneEl || !touchDraggedItemEl) return;

    e.preventDefault(); 

    const lastTouch = e.changedTouches[0];
    const draggedId = touchDraggedItemEl.dataset.id;
    
    // Hapus kloningan dari DOM
    document.body.removeChild(cloneEl);
    cloneEl = null; 
    
    // Kembalikan opacity item sumber
    touchDraggedItemEl.classList.remove('opacity-40');
    touchDraggedItemEl = null;

    // Hapus semua visual highlight
    document.querySelectorAll('.wrong-drop-target').forEach(target => {
        target.classList.remove('ring-4', 'ring-blue-400', 'scale-[1.05]');
    });

    // Periksa elemen di bawah jari saat diangkat
    const targetElement = document.elementFromPoint(lastTouch.clientX, lastTouch.clientY);
    const dropTarget = targetElement ? targetElement.closest('.wrong-drop-target') : null;
    
    if (dropTarget) {
        processDrop(draggedId, dropTarget);
    }
}

// --- Inisialisasi Utama ---

export function initializeReduceSection() {
    renderItems();

    // Event listener untuk Drag (Desktop)
    correctContainer.addEventListener('dragstart', handleDragStart);
    correctContainer.addEventListener('dragend', handleDragEnd);

    bottomSection.addEventListener('dragover', handleDragOver);
    bottomSection.addEventListener('dragleave', handleDragLeave);
    bottomSection.addEventListener('drop', handleDrop);

    // Event listener untuk Touch (Mobile)
    correctContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });


    moveCorrectButton.addEventListener('click', handleMoveCorrect);
}