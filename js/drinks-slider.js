/* ============================================================
   Слайдер «Напитки на основе соков»
   - бесконечный
   - перелистывание стрелками + клавишами + СВАЙП/DRAG (мышь и палец)
   - экспонирует window.drinksSliderGoTo(idx) для перехода с попапа
   ============================================================ */
(function () {
    const track    = document.getElementById('drinks-track');
    const slides   = track.children;
    const viewport = track.parentElement;
    const prevBtn  = document.getElementById('drinks-prevBtn');
    const nextBtn  = document.getElementById('drinks-nextBtn');
    const current  = document.getElementById('current');
    const total    = document.getElementById('total');

    const TOTAL_SLIDES = slides.length;
    total.textContent = TOTAL_SLIDES;

    let index = 0;

    function syncHeight() {
        const activeSlide = slides[index];
        if (activeSlide) {
            viewport.style.height = activeSlide.offsetHeight + 'px';
        }
    }

    function update() {
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${index * 100}%)`;
        current.textContent = index + 1;
        syncHeight();

        const section = track.closest('.drinks');
        if (section) section.dataset.page = index;
    }

    function goTo(i) {
        index = ((i % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;
        update();
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });

    window.addEventListener('resize', syncHeight);
    window.addEventListener('load', syncHeight);
    Array.from(track.querySelectorAll('img')).forEach(img => {
        if (!img.complete) img.addEventListener('load', syncHeight);
    });

    /* ========== DRAG / SWIPE (мышь + тач) ========== */
    let dragging = false;
    let startX = 0;
    let currentX = 0;
    let dragDistance = 0;
    const SWIPE_THRESHOLD = 50; // пикселей для срабатывания

    function dragStart(e) {
        // не перехватываем клики по ссылкам/кнопкам внутри слайда
        if (e.target.closest('a, button')) return;
        dragging = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        currentX = startX;
        dragDistance = 0;
        track.style.transition = 'none';
        viewport.style.cursor = 'grabbing';
    }

    function dragMove(e) {
        if (!dragging) return;
        currentX = (e.touches ? e.touches[0].clientX : e.clientX);
        dragDistance = currentX - startX;
        const baseOffset = -index * viewport.clientWidth;
        track.style.transform = `translateX(${baseOffset + dragDistance}px)`;
        // блокируем выделение текста при mouse drag
        if (e.cancelable && !e.touches) e.preventDefault();
    }

    function dragEnd() {
        if (!dragging) return;
        dragging = false;
        viewport.style.cursor = '';
        if (dragDistance > SWIPE_THRESHOLD)        goTo(index - 1);
        else if (dragDistance < -SWIPE_THRESHOLD)  goTo(index + 1);
        else                                       update(); // снап обратно
    }

    viewport.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mouseleave', dragEnd);

    viewport.addEventListener('touchstart', dragStart, { passive: true });
    viewport.addEventListener('touchmove', dragMove, { passive: true });
    viewport.addEventListener('touchend', dragEnd);
    viewport.addEventListener('touchcancel', dragEnd);

    // курсор «grab» намекает на возможность драга
    viewport.style.cursor = 'grab';
    viewport.style.userSelect = 'none';

    /* ========== ПУБЛИЧНЫЙ API ========== */
    window.drinksSliderGoTo = goTo;

    update();
})();
