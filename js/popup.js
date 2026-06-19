/* ============================================================
   ПУНКТ 2 — Логика попапа
   ============================================================
   Принцип: у каждой карточки слайдера есть шаблон <template>
   с готовым содержимым попапа. При клике на «подробнее о вкусе»
   JS берёт шаблон карточки, вставляет в попап и открывает его.

   Слайдер определяется по родительскому классу:
   - .siesta-slider     -> попап с розовым фоном
   - .classic-slider    -> попап с жёлтым фоном
*/

(function () {
    const popup       = document.getElementById('popup');
    if (!popup) return;

    const popupCard   = popup.querySelector('.popup__card');
    const popupBody   = popup.querySelector('.popup__body');
    const closeBtn    = popup.querySelector('.popup__close');

    function open(card, type) {
        // Сбрасываем тип и ставим новый: classic / siesta
        popup.classList.remove('popup--classic', 'popup--siesta');
        popup.classList.add('popup--' + type);

        // Берём шаблон содержимого попапа из карточки
        const template = card.querySelector('template.popup-content');
        if (template) {
            popupBody.innerHTML = '';
            popupBody.appendChild(template.content.cloneNode(true));
        } else {
            // Фоллбек, если шаблона ещё нет — берём базовое название
            const name = card.querySelector(
                '.classic-slider-flavor__name, .siesta-slider-flavor__name'
            );
            popupBody.innerHTML = '<h2 class="popup__title">' +
                (name ? name.textContent : 'Вкус') + '</h2>' +
                '<p class="popup__desc">Описание появится здесь.</p>';
        }

        popup.classList.add('is-open');
        document.body.classList.add('popup-open');
    }

    function close() {
        popup.classList.remove('is-open');
        document.body.classList.remove('popup-open');
    }

    // Делегирование клика — ловим все кнопки «подробнее о вкусе»
    document.addEventListener('click', function (e) {
        const btn = e.target.closest(
            '.classic-slider-flavor__btn, .siesta-slider-flavor__btn'
        );
        if (!btn) return;

        e.preventDefault();

        const card = btn.closest('.classic-slider-flavor, .siesta-slider-flavor');
        if (!card) return;

        // Определяем тип слайдера по родителю
        const isSiesta = !!btn.closest('.siesta-slider');
        open(card, isSiesta ? 'siesta' : 'classic');
    });

    // Закрытие: крестик, клик по подложке, Escape
    closeBtn.addEventListener('click', close);
    popup.addEventListener('click', function (e) {
        if (e.target === popup) close();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
    });
})();
