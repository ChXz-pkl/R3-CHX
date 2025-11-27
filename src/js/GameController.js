const GAME_STATUS = {
    reduce: false,
    reuse: false,
    recycle: false,
};

function checkAllGamesCompleted() {
    const allCompleted = GAME_STATUS.reduce && GAME_STATUS.reuse && GAME_STATUS.recycle;
    
    if (allCompleted) {
        const completeSection = document.getElementById('game-complete-section');
        const lockOverlay = document.getElementById('lock-overlay');
        const r3Content = document.getElementById('r3-content'); 
        
        if (completeSection) {
            console.log("🎉 SEMUA GAME SELESAI! Membuka Artikel Eksklusif.");

            if (lockOverlay) {
                lockOverlay.classList.add('opacity-0', 'pointer-events-none');
                
                setTimeout(() => {
                   if(lockOverlay.parentNode) {
                       lockOverlay.parentNode.removeChild(lockOverlay);
                   }
                   
                   if (r3Content) { 
                       r3Content.classList.remove('hidden');
                       console.log("Konten Artikel Eksklusif ditampilkan.");
                   }

                   completeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500); 
            }
        }
    }
    return allCompleted;
}

function updateVisualState(gameId) {
    const sectionId = `${gameId}-section`;
    const gameSection = document.getElementById(sectionId);
    
    if (gameSection) {
        gameSection.classList.add('bg-game-completed', 'shadow-green-500/50');
    }

    const birdsElement = document.getElementById('flying-birds-container');
    const completedCount = Object.values(GAME_STATUS).filter(status => status).length;

    if (birdsElement) {
        if (completedCount > 0) {
            birdsElement.classList.remove('hidden'); 
        }
        
        if (completedCount === 3) {
             console.log("Burung terbang mencapai kepadatan maksimum!");
        }
    }
}


export function setGameCompleted(gameId) {
    if (GAME_STATUS.hasOwnProperty(gameId) && !GAME_STATUS[gameId]) {
        GAME_STATUS[gameId] = true; 
        console.log(`✅ Game ${gameId} Selesai. Status Terbaru:`, GAME_STATUS);
        
        updateVisualState(gameId); 
        
        checkAllGamesCompleted(); 
    }
}

export function initializeGameController() {
    console.log("Game Controller initialized. Ready to track 3R progress.");
}