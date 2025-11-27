const LEAF_COUNT = 40;
const MAX_FALL_DURATION = 25;
const MIN_FALL_DURATION = 15;
const MAX_SIZE = 20;
const MIN_SIZE = 10;

const LEAF_COLORS = [
    'rgba(139, 69, 19, 0.7)',
    'rgba(210, 105, 30, 0.7)',
    'rgba(184, 134, 11, 0.7)',
    'rgba(0, 100, 0, 0.6)',
    'rgba(34, 139, 34, 0.6)'
];

const LEAF_SHAPES = [
    '50% 10% 50% 10% / 10% 50% 10% 50%',
    '30% 70% 70% 30% / 70% 30% 70% 30%',
    '60% 40% 40% 60% / 40% 60% 40% 60%',
    '50% 50% 50% 50% / 50% 50% 50% 50%'
];

export function initializeFallingLeaves() {
    const container = document.querySelector('.falling-leaves-container');
    if (!container) return;

    for (let i = 0; i < LEAF_COUNT; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        const startX = Math.random() * 100;
        const startY = - (Math.random() * 100 + 50);

        const sizeWidth = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
        const sizeHeight = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE * 0.7;
        leaf.style.width = `${sizeWidth}px`;
        leaf.style.height = `${sizeHeight}px`;

        const duration = Math.random() * (MAX_FALL_DURATION - MIN_FALL_DURATION) + MIN_FALL_DURATION;
        const delay = Math.random() * (MAX_FALL_DURATION * 0.8);

        const endXOffset = (Math.random() - 0.5) * 400;
        const startRotation = Math.random() * 360;
        const endRotation = Math.random() * 720 + 360;
        const scaleEnd = Math.random() * 0.4 + 0.8;

        leaf.style.left = `${startX}%`;
        leaf.style.top = `${startY}px`; 
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
        
        leaf.style.setProperty('--leaf-x-end', `${endXOffset}px`);
        leaf.style.setProperty('--leaf-rotate-end', `${endRotation}deg`);
        leaf.style.setProperty('--leaf-scale-end', `${scaleEnd}`);
        
        leaf.style.backgroundColor = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
        leaf.style.borderRadius = LEAF_SHAPES[Math.floor(Math.random() * LEAF_SHAPES.length)];
        leaf.style.transform = `rotateZ(${startRotation}deg)`;

        container.appendChild(leaf);
    }
}