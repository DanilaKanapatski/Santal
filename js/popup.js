/* ============================================================
   Попап «подробнее о вкусе»
   - открывается по клику на ВСЮ карточку (а не только на кнопку)
   - игнорирует клик, если только что был свайп (флаг __sliderJustDragged)
   - кнопка «смотреть рецепт» внутри попапа уводит на конкретный
     рецепт (data-recipe="N") через window.drinksSliderGoTo
   ============================================================ */
(function () {
    const popup     = document.getElementById('popup');
    if (!popup) return;

    const popupBody = popup.querySelector('.popup__body');
    const closeBtn  = popup.querySelector('.popup__close');

    function open(card, type) {
        popup.classList.remove('popup--classic', 'popup--siesta');
        popup.classList.add('popup--' + type);

        const template = card.querySelector('template.popup-content');
        if (template) {
            popupBody.innerHTML = '';
            popupBody.appendChild(template.content.cloneNode(true));
        } else {
            const name = card.querySelector(
                '.classic-slider-flavor__name, .siesta-slider-flavor__name'
            );
            popupBody.innerHTML = '<h2 class="popup__title">' +
                (name ? name.textContent : 'Вкус') + '</h2>' +
                '<p class="popup__desc">Описание появится здесь.</p>';
        }

        popup.classList.add('is-open');
        document.body.classList.add('popup-open');
        // сбрасываем скролл внутри тела попапа в начало
        if (popupBody) popupBody.scrollTop = 0;
    }

    function close() {
        popup.classList.remove('is-open');
        document.body.classList.remove('popup-open');
    }

    /* Открытие: клик по любой части карточки. Старая кнопка
       «подробнее о вкусе» тоже сюда попадает — она внутри карточки. */
    document.addEventListener('click', function (e) {
        // не открывать попап, если это был свайп слайдера
        if (window.__sliderJustDragged) return;

        // клик внутри уже открытого попапа — обрабатываем отдельно ниже
        if (e.target.closest('.popup')) return;

        const card = e.target.closest(
            '.classic-slider-flavor, .siesta-slider-flavor'
        );
        if (!card) return;

        e.preventDefault();

        const isSiesta = !!card.closest('.siesta-slider');
        open(card, isSiesta ? 'siesta' : 'classic');
    });

    /* Кнопка «смотреть рецепт» в попапе */
    popup.addEventListener('click', function (e) {
        const cta = e.target.closest('.popup__cta');
        if (!cta) return;

        const recipeIdx = parseInt(cta.dataset.recipe, 10);
        e.preventDefault();
        close();

        // переключаем слайдер рецептов на нужный
        if (!isNaN(recipeIdx) && typeof window.drinksSliderGoTo === 'function') {
            window.drinksSliderGoTo(recipeIdx);
        }
        // прокручиваем к самому слайдеру с напитками (а не к заголовку #recipes),
        // даём слайдеру кадр на пересчёт высоты после goTo
        requestAnimationFrame(() => {
            const target = document.querySelector('.drinks')
                        || document.getElementById('recipes');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* Закрытие: крестик, клик по подложке, Escape */
    closeBtn.addEventListener('click', close);
    popup.addEventListener('click', function (e) {
        if (e.target === popup) close();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
    });

    /* Доступность: курсор-указатель и keyboard-доступность для всей карточки */
    document.querySelectorAll('.classic-slider-flavor, .siesta-slider-flavor').forEach(card => {
        card.style.cursor = 'pointer';
        if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
})();
