export function initializeBGM() {
    const bgm = document.getElementById('background-music');

    if (!bgm) {
        console.warn("Elemen audio dengan ID 'background-music' tidak ditemukan.");
        return;
    }
    
    bgm.volume = 0.5;

    function playBGM() {
        bgm.play().then(() => {
            document.removeEventListener('click', playBGM);
            document.removeEventListener('touchstart', playBGM);
            console.log("BGM mulai diputar setelah interaksi pengguna.");
        }).catch(error => {
            console.warn("Gagal memutar BGM. Event listener tetap aktif.", error);
        });
    }

    document.addEventListener('click', playBGM);
    document.addEventListener('touchstart', playBGM);
}