/* ============================================================
   Плейлист: клик по треку — играет/ставит на паузу
   ============================================================

   КУДА ПОЛОЖИТЬ АУДИОФАЙЛЫ:
   Создай папку  assets/audio/  внутри своего проекта и положи
   туда mp3-файлы. Имена ниже в TRACK_FILES соответствуют по
   порядку трекам в разметке (1-й трек = TRACK_FILES[0] и т.д.).
   Если хочешь свои имена/расширения — просто поменяй массив.

   Если файла нет — клик просто переключает иконку (визуально),
   без ошибок в консоли.
   ============================================================ */

(function () {
    const tracks = document.querySelectorAll('.playlist-track');
    if (!tracks.length) return;

    const TRACK_FILES = [
        'assets/audio/track-1.mp3',   // 1. Банановый Джангл
        'assets/audio/track-2.mp3',   // 2. Сицилийский Апельсин
        'assets/audio/track-3.mp3',   // 3. Черешневое Лето
        'assets/audio/track-4.mp3',   // 4. Манговый Закат
        'assets/audio/track-5.mp3',   // 5. Грушевый Сад
        'assets/audio/track-6.mp3',   // 6. Апельсиновый Оазис
        'assets/audio/track-7.mp3',   // 7. Мультифруктовый Карнавал
    ];

    // SVG-иконки, которые ты прислал (играет / на паузе)
    const PLAY_SVG = `
<svg class="playlist-track-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g clip-path="url(#pl_play_clip)">
    <path d="M14.3 0C18.0926 0 21.7299 1.5066 24.4116 4.18837C27.0934 6.87014 28.6 10.5074 28.6 14.3C28.6 18.0926 27.0934 21.7299 24.4116 24.4116C21.7299 27.0934 18.0926 28.6 14.3 28.6C10.5074 28.6 6.87014 27.0934 4.18837 24.4116C1.5066 21.7299 0 18.0926 0 14.3C0 10.5074 1.5066 6.87014 4.18837 4.18837C6.87014 1.5066 10.5074 0 14.3 0ZM2.68125 14.3C2.68125 17.3815 3.90536 20.3368 6.0843 22.5157C8.26324 24.6946 11.2185 25.9188 14.3 25.9188C17.3815 25.9188 20.3368 24.6946 22.5157 22.5157C24.6946 20.3368 25.9188 17.3815 25.9188 14.3C25.9188 11.2185 24.6946 8.26324 22.5157 6.0843C20.3368 3.90536 17.3815 2.68125 14.3 2.68125C11.2185 2.68125 8.26324 3.90536 6.0843 6.0843C3.90536 8.26324 2.68125 11.2185 2.68125 14.3ZM11.4025 9.34326L19.0244 13.9175C19.0902 13.9573 19.1447 14.0134 19.1825 14.0804C19.2203 14.1474 19.2402 14.2231 19.2402 14.3C19.2402 14.3769 19.2203 14.4526 19.1825 14.5196C19.1447 14.5866 19.0902 14.6427 19.0244 14.6825L11.4025 19.2567C11.3347 19.2976 11.2573 19.3197 11.1782 19.3208C11.099 19.3219 11.0211 19.302 10.9522 19.2631C10.8833 19.2242 10.8259 19.1677 10.786 19.0994C10.7461 19.031 10.725 18.9533 10.725 18.8742V9.72758C10.7247 9.6483 10.7456 9.57038 10.7853 9.50181C10.8251 9.43323 10.8824 9.37648 10.9514 9.33736C11.0203 9.29824 11.0984 9.27818 11.1777 9.27921C11.257 9.28025 11.3346 9.30236 11.4025 9.34326Z" fill="#657608"/>
  </g>
  <defs><clipPath id="pl_play_clip"><rect width="28.6" height="28.6" fill="white"/></clipPath></defs>
</svg>`;

    const PAUSE_SVG = `
<svg class="playlist-track-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M14.6699 0.138916C18.5225 0.144042 22.2163 1.67745 24.9404 4.40161C27.6644 7.12573 29.197 10.8187 29.2021 14.6711C29.2021 17.5453 28.3497 20.3556 26.7529 22.7454C25.1562 25.1349 22.8866 26.9971 20.2314 28.0969C17.576 29.1968 14.6539 29.4848 11.835 28.9241C9.01618 28.3633 6.42681 26.9797 4.39453 24.9475C2.36218 22.9152 0.977718 20.3251 0.416992 17.5061C-0.143591 14.6874 0.144421 11.7658 1.24414 9.1106C2.34404 6.45519 4.20688 4.18495 6.59668 2.58813C8.98636 0.991455 11.7959 0.138972 14.6699 0.138916ZM19.3906 3.27563C17.1368 2.34206 14.6563 2.09756 12.2637 2.57349C9.87105 3.04943 7.67323 4.22447 5.94824 5.94946C4.22325 7.67445 3.04821 9.87227 2.57227 12.2649C2.09634 14.6576 2.34084 17.138 3.27441 19.3918C4.20796 21.6456 5.7891 23.5717 7.81738 24.927C9.84571 26.2823 12.2305 27.006 14.6699 27.0061C17.9398 27.0011 21.0746 25.7001 23.3867 23.3879C25.6988 21.0758 26.9999 17.941 27.0049 14.6711C27.0048 12.2317 26.2811 9.84693 24.9258 7.8186C23.5705 5.79032 21.6443 4.20918 19.3906 3.27563Z" fill="#657608" stroke="#657608" stroke-width="0.278571"/>
  <path d="M11.792 8.77466C12.3986 8.77489 12.8906 9.26756 12.8906 9.87427V19.469C12.8906 20.0757 12.3986 20.5674 11.792 20.5676C11.1851 20.5676 10.6924 20.0758 10.6924 19.469V9.87427C10.6924 9.26741 11.1851 8.77466 11.792 8.77466ZM17.5488 8.77466C18.1556 8.77473 18.6475 9.26746 18.6475 9.87427V19.469C18.6475 20.0758 18.1556 20.5676 17.5488 20.5676C16.942 20.5676 16.4502 20.0758 16.4502 19.469V9.87427C16.4502 9.26741 16.942 8.77466 17.5488 8.77466Z" fill="#657608" stroke="#657608" stroke-width="0.278571"/>
</svg>`;

    let currentTrack = null;
    let currentAudio = null;

    // Подставляем play-иконку и data-audio каждой кнопке
    tracks.forEach((track, i) => {
        const btn = track.querySelector('.playlist-track-btn');
        if (!btn) return;
        btn.innerHTML = PLAY_SVG;
        btn.style.cursor = 'pointer';
        track.style.cursor = 'pointer';
        track.dataset.index = i;
        if (!track.dataset.audio && TRACK_FILES[i]) {
            track.dataset.audio = TRACK_FILES[i];
        }
    });

    function setIcon(track, kind /* 'play' | 'pause' */) {
        const btn = track.querySelector('.playlist-track-btn');
        if (!btn) return;
        btn.innerHTML = kind === 'pause' ? PAUSE_SVG : PLAY_SVG;
    }

    function stopCurrent() {
        if (currentTrack) {
            setIcon(currentTrack, 'play');
            currentTrack.classList.remove('is-playing');
        }
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        currentTrack = null;
    }

    function playTrack(track) {
        if (currentTrack === track) {
            stopCurrent();
            return;
        }
        stopCurrent();

        setIcon(track, 'pause');
        track.classList.add('is-playing');
        currentTrack = track;

        const src = track.dataset.audio;
        if (src) {
            currentAudio = new Audio(src);
            currentAudio.play().catch(() => {
                // если файла нет / автоплей заблокирован — оставляем
                // только визуальное состояние «играет»
            });
            currentAudio.addEventListener('ended', () => {
                if (currentTrack === track) stopCurrent();
            });
            currentAudio.addEventListener('error', () => {
                // тихо: файл может отсутствовать — оставляем визуальное play
                currentAudio = null;
            });
        }
    }

    document.addEventListener('click', function (e) {
        const track = e.target.closest('.playlist-track');
        if (!track) return;
        if (e.target.closest('a')) return;
        playTrack(track);
    });
})();
