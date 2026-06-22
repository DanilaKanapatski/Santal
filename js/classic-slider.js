(function () {
    const root    = document.getElementById('classic-slider');
    const track   = document.getElementById('classic-slider-track');
    const prevBtn = document.getElementById('classic-slider-prevBtn');
    const nextBtn = document.getElementById('classic-slider-nextBtn');
    const slides  = track.children;

    function perView() {
        const v = getComputedStyle(root).getPropertyValue('--per-view').trim();
        return Math.max(1, parseInt(v, 10) || 1);
    }

    let page = 0;

    function totalPages() {
        return Math.ceil(slides.length / perView());
    }

    function update() {
        const pv = perView();
        const total = totalPages();

        // Бесконечная прокрутка: нормализуем page
        if (page >= total) page = 0;
        if (page < 0) page = total - 1;

        const viewport = track.parentElement;
        const offset = page * viewport.clientWidth;
        track.style.transform = `translateX(-${offset + page * 27}px)`;

        const section = root.closest('.classic-slider');
        if (section) section.dataset.page = page;

        // Кнопки всегда активны (бесконечный режим)
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    prevBtn.addEventListener('click', () => { page--; update(); });
    nextBtn.addEventListener('click', () => { page++; update(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    window.addEventListener('resize', update);

    update();
})();