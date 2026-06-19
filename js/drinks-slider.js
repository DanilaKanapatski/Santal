(function () {
    const track    = document.getElementById('drinks-track');
    const slides   = track.children;
    const viewport = track.parentElement;
    const prevBtn  = document.getElementById('drinks-prevBtn');
    const nextBtn  = document.getElementById('drinks-nextBtn');
    const current  = document.getElementById('current');
    const total    = document.getElementById('total');

    const TOTAL_SLIDES = slides.length; // считаем по факту
    total.textContent = TOTAL_SLIDES;

    let index = 0;

    function syncHeight() {
        const activeSlide = slides[index];
        if (activeSlide) {
            viewport.style.height = activeSlide.offsetHeight + 'px';
        }
    }

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
        current.textContent = index + 1;
        syncHeight();

        // НОВОЕ: переключаем декорации
        const section = track.closest('.drinks');
        if (section) section.dataset.page = index;
    }

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
        update();
    });

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % TOTAL_SLIDES;
        update();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Пересчёт высоты при ресайзе
    window.addEventListener('resize', syncHeight);

    // Пересчёт когда догрузятся картинки (на старте высота считается неправильно
    // потому что <img> ещё не подгружен и не занимает место)
    window.addEventListener('load', syncHeight);
    Array.from(track.querySelectorAll('img')).forEach(img => {
        if (!img.complete) img.addEventListener('load', syncHeight);
    });

    update();
})();