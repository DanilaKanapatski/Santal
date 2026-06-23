/* ============================================================
   Слайдер «Классический Santal»
   - бесконечный
   - стрелки + клавиши + СВАЙП/DRAG (мышь и палец)
   - выставляет body-флаг во время драга, чтобы клик не открывал попап
   ============================================================ */
(function () {
    const root    = document.getElementById('classic-slider');
    const track   = document.getElementById('classic-slider-track');
    const prevBtn = document.getElementById('classic-slider-prevBtn');
    const nextBtn = document.getElementById('classic-slider-nextBtn');
    const slides  = track.children;
    const viewport = track.parentElement;

    function perView() {
        const v = getComputedStyle(root).getPropertyValue('--per-view').trim();
        return Math.max(1, parseInt(v, 10) || 1);
    }

    let page = 0;

    function totalPages() {
        return Math.ceil(slides.length / perView());
    }

    function update() {
        const total = totalPages();
        if (page >= total) page = 0;
        if (page < 0) page = total - 1;

        track.style.transition = 'transform 0.5s ease';
        const offset = page * viewport.clientWidth;
        track.style.transform = `translateX(-${offset + page * 27}px)`;

        const section = root.closest('.classic-slider');
        if (section) section.dataset.page = page;

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

    /* ========== DRAG / SWIPE ========== */
    let dragging = false;
    let startX = 0;
    let dragDistance = 0;
    const SWIPE_THRESHOLD = 50;
    // флаг, что только что был драг — popup.js его читает, чтобы не открыть попап
    function setJustDragged() {
        window.__sliderJustDragged = true;
        setTimeout(() => { window.__sliderJustDragged = false; }, 100);
    }

    function dragStart(e) {
        if (e.target.closest('a, button')) return;
        dragging = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        dragDistance = 0;
        track.style.transition = 'none';
        viewport.style.cursor = 'grabbing';
    }

    function dragMove(e) {
        if (!dragging) return;
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        dragDistance = x - startX;
        const baseOffset = -(page * viewport.clientWidth + page * 27);
        track.style.transform = `translateX(${baseOffset + dragDistance}px)`;
        if (e.cancelable && !e.touches) e.preventDefault();
    }

    function dragEnd() {
        if (!dragging) return;
        dragging = false;
        viewport.style.cursor = '';
        const moved = Math.abs(dragDistance);
        if (moved > SWIPE_THRESHOLD) {
            setJustDragged();
            if (dragDistance > 0) page--; else page++;
        }
        update();
    }

    viewport.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mouseleave', dragEnd);

    viewport.addEventListener('touchstart', dragStart, { passive: true });
    viewport.addEventListener('touchmove', dragMove, { passive: true });
    viewport.addEventListener('touchend', dragEnd);
    viewport.addEventListener('touchcancel', dragEnd);

    viewport.style.cursor = 'grab';
    viewport.style.userSelect = 'none';

    update();
})();
