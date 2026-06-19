/* ============================================================
   ПУНКТ 3 — Логика бургер-меню
   ============================================================ */

(function () {
    const burger = document.querySelector('.burger');
    const menu   = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;

    function toggle() {
        const willOpen = !menu.classList.contains('is-open');
        menu.classList.toggle('is-open', willOpen);
        burger.classList.toggle('is-open', willOpen);
        document.body.classList.toggle('popup-open', willOpen);
        burger.setAttribute('aria-expanded', willOpen);
    }

    burger.addEventListener('click', toggle);

    // Закрываем меню по клику на пункт навигации
    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (menu.classList.contains('is-open')) toggle();
        });
    });

    // Escape тоже закрывает
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) toggle();
    });
})();
