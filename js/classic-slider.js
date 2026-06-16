(function () {
    const root    = document.getElementById('classic-slider');
    const track   = document.getElementById('classic-slider-track');
    const prevBtn = document.getElementById('classic-slider-prevBtn');
    const nextBtn = document.getElementById('classic-slider-nextBtn');
    const slides  = track.children;

    // Берём актуальное количество видимых карточек из CSS-переменной
    function perView() {
        const v = getComputedStyle(root).getPropertyValue('--per-view').trim();
        return Math.max(1, parseInt(v, 10) || 1);
    }

    let page = 0; // номер текущей «страницы» (группы карточек)

    function totalPages() {
        return Math.ceil(slides.length / perView());
    }

    function update() {
        const pv = perView();
        const max = totalPages() - 1;
        if (page > max) page = max;
        if (page < 0) page = 0;

        // Сдвигаем на page страниц. Каждая страница = pv карточек.
        // Учитываем gap между карточками (24px) — для точного смещения берём ширину viewport.
        const viewport = track.parentElement;
        const offset = page * viewport.clientWidth;
        // gap внутри страницы: после последней карточки страницы нужен ещё один gap,
        // чтобы следующая страница начиналась с края — добавим page * 24px
        track.style.transform = `translateX(-${offset + page * 28}px)`;

        prevBtn.disabled = page === 0;
        nextBtn.disabled = page >= max;
    }

    prevBtn.addEventListener('click', () => { page--; update(); });
    nextBtn.addEventListener('click', () => { page++; update(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft'  && !prevBtn.disabled) prevBtn.click();
        if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
    });

    // При ресайзе пересчитываем (на случай смены --per-view через media-query)
    window.addEventListener('resize', update);

    update();
})();