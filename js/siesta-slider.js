(function () {
    const root    = document.getElementById('siesta-slider');
    const track   = document.getElementById('siesta-slider-track');
    const prevBtn = document.getElementById('siesta-slider-prevBtn');
    const nextBtn = document.getElementById('siesta-slider-nextBtn');
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
        const total = totalPages();

        // БЕСКОНЕЧНАЯ ПРОКРУТКА: зацикливаем страницы
        if (page >= total) page = 0;
        if (page < 0) page = total - 1;

        // Сдвигаем на page страниц. Каждая страница = pv карточек.
        // Учитываем gap между карточками (24px) — для точного смещения берём ширину viewport.
        const viewport = track.parentElement;
        const offset = page * viewport.clientWidth;
        // gap внутри страницы: после последней карточки страницы нужен ещё один gap,
        // чтобы следующая страница начиналась с края — добавим page * 24px
        track.style.transform = `translateX(-${offset + page * 28}px)`;

        // НОВОЕ: переключаем декорации
        const section = root.closest('.siesta-slider');
        if (section) section.dataset.page = page;

        // БЕСКОНЕЧНЫЙ РЕЖИМ: кнопки всегда активны
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    prevBtn.addEventListener('click', () => { page--; update(); });
    nextBtn.addEventListener('click', () => { page++; update(); });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    // При ресайзе пересчитываем (на случай смены --per-view через media-query)
    window.addEventListener('resize', update);

    update();
})();