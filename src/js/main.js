import { initializeDarkModeToggle, initializeMobileMenu } from './components/Navbar.js';
import { initializeHeroSection } from './components/HeroSection.js';
import { initializeReduceSection } from './components/ReduceSection.js'; 
import { initializeReuseSection } from './components/ReuseSection.js'; 
import { initializeRecycleSection } from './components/RecycleSection.js'; 
import { initializeGameController } from './GameController.js'; 
import { initializeFallingLeaves } from './components/FallingLeaves.js';
import { initializeBGM } from './components/BGMController.js';
import { initializeFlyingBirds } from './components/BirdFlaying.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkModeToggle();
    initializeMobileMenu();
    initializeHeroSection(); 
    initializeReduceSection(); 
    initializeReuseSection(); 
    initializeRecycleSection(); 
    initializeGameController(); 
    initializeFallingLeaves();
    initializeBGM();
    initializeFlyingBirds();
});