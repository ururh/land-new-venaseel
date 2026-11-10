(() => {
  document.querySelectorAll('[data-ticker]').forEach((ticker) => {
    const track = ticker.querySelector('.glow-ticker__track');
    const source = track.querySelector('.glow-ticker__group');
    const refresh = () => {
      track.querySelectorAll('[aria-hidden="true"]').forEach((node) => {
        if (node.classList.contains('glow-ticker__group')) node.remove();
      });
      const distance = source.getBoundingClientRect().width;
      if (!distance) return;
      const copies = Math.ceil(ticker.clientWidth / distance) + 1;
      for (let i = 0; i < copies; i += 1) {
        const copy = source.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        track.appendChild(copy);
      }
      ticker.style.setProperty('--ticker-distance', `${distance}px`);
      ticker.style.setProperty('--ticker-duration', `${distance / 120}s`);
      ticker.classList.add('is-ready');
    };
    new ResizeObserver(refresh).observe(ticker);
    document.fonts.ready.then(refresh);
  });
})();

  (function () {
    function initClawMachine50() {
      const game = document.getElementById('cm50Game');

      if (!game || game.dataset.initialized === 'true') {
        return;
      }

      game.dataset.initialized = 'true';

      const claw = game.querySelector('.cm50-claw');
      const play = game.querySelector('.cm50-play');
      const status = game.querySelector('.cm50-status');
      const gifts = [
        game.querySelector('.cm50-gift-target'),
        game.querySelector('.cm50-gift-one')
      ];
      const windowEl = game.querySelector('.cm50-window');
      const result = game.querySelector('.cm50-result');
      const claim = game.querySelector('.cm50-claim');
      const resultIcon = result.querySelector('.cm50-result-icon');
      const resultTitle = result.querySelector('.cm50-result-title');
      const resultPercent = result.querySelector('.cm50-result-percent');
      const resultDescription = result.querySelector('.cm50-result-description');
      const winningContent = [resultIcon, resultTitle, resultPercent, resultDescription, claim]
        .map(element => element.textContent);

      let playing = false;
      let completed = false;
      let attempts = 0;

      const wait = ms => new Promise(resolve => {
        setTimeout(resolve, ms);
      });

      function moveClaw(x) {
        claw.style.left = x + 'px';
      }

      function giftPosition(gift) {
        const giftRect = gift.getBoundingClientRect();
        const winRect = windowEl.getBoundingClientRect();

        return (
          giftRect.left +
          giftRect.width / 2 -
          winRect.left
        );
      }

      function createConfetti() {
        const colors = [
          '#28bdf0',
          '#9cf5c9',
          '#1687c1',
          '#ffffff',
          '#4de0ae'
        ];

        for (let i = 0; i < 70; i++) {
          const piece = document.createElement('span');

          piece.className = 'cm50-confetti';
          piece.style.left = Math.random() * 100 + 'vw';
          piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDelay =
            Math.random() * .8 + 's';
          piece.style.animationDuration =
            (2 + Math.random() * 2) + 's';

          document.body.appendChild(piece);

          piece.addEventListener('animationend', function () {
            piece.remove();
          });
        }
      }

      async function start() {
        if (playing || completed) return;

        playing = true;
        attempts += 1;
        const gift = gifts[attempts - 1];
        play.disabled = true;
        play.textContent = 'ГРА ТРИВАЄ...';

        status.textContent = '🎯 Шукаємо подарунок...';

        moveClaw(windowEl.clientWidth * .7);
        await wait(1050);

        moveClaw(giftPosition(gift));
        await wait(1100);

        status.textContent = '⬇️ Опускаємо клешню...';

        claw.classList.add('cm50-down');
        await wait(950);

        claw.classList.add('cm50-closed');
        await wait(350);

        gift.classList.add('cm50-hidden');
        claw.classList.add('cm50-holding');

        status.textContent = '🎁 Подарунок захоплено!';

        claw.classList.remove('cm50-down');
        await wait(1000);

        status.textContent = '✨ Доставляємо подарунок...';

        moveClaw(48);
        await wait(1100);

        claw.classList.remove('cm50-holding');

        status.textContent = '🎉 Бонус відкрито!';
        await wait(500);

        completed = attempts === 2;
        playing = false;

        if (!completed) {
          resultIcon.textContent = '🎁';
          resultTitle.textContent = 'СПРОБУЙТЕ ЩЕ РАЗ!';
          resultPercent.textContent = '−20%';
          resultDescription.textContent = 'У першій коробочці — знижка 20%. Спробуйте ще раз, щоб отримати більший бонус!';
          claim.textContent = 'ПРОДОВЖИТИ';
          status.textContent = '🎁 Ви відкрили 20%! Є ще одна спроба.';
        } else {
          [resultIcon, resultTitle, resultPercent, resultDescription, claim]
            .forEach((element, index) => { element.textContent = winningContent[index]; });
          createConfetti();
        }
        result.classList.add('cm50-visible');
        result.setAttribute('aria-hidden', 'false');

        claim.focus({ preventScroll: true });
      }

      function claimBonus() {
        if (!completed && attempts === 1 && !playing) {
          result.classList.remove('cm50-visible');
          result.setAttribute('aria-hidden', 'true');
          claw.classList.remove('cm50-down', 'cm50-closed', 'cm50-holding');
          play.disabled = false;
          play.textContent = 'СПРОБУВАТИ УДАЧУ';
          status.textContent = 'Натисни «Спробувати удачу», щоб відкрити ще одну коробочку!';
          play.focus({ preventScroll: true });
          return;
        }
        if (!completed || game.hidden) return;
        result.classList.remove('cm50-visible');
        result.setAttribute('aria-hidden', 'true');

        const order = document.getElementById('pedido-2');
        if (!order) return;
        order.hidden = false;
        game.hidden = true;
        const heading = order.querySelector('h2');
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
        order.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start'
        });
        game.dispatchEvent(new CustomEvent('cm50:claimed', {
          bubbles: true,
          detail: { discount: 50 }
        }));
      }

      play.addEventListener('click', start);
      claim.addEventListener('click', claimBonus);
    }

    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        initClawMachine50
      );
    } else {
      initClawMachine50();
    }
  })();

document.querySelectorAll('a[href="#pedido"], a[href="#pedido-2"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const order = document.getElementById('pedido-2');
    const target = order.hidden ? document.getElementById('cm50Game') : order;
    event.preventDefault();
    target.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    });
  });
});
(() => {
  const toast = document.getElementById('purchaseToast');
  if (!toast) return;
  const messages = [...toast.querySelectorAll('.purchase-toast__message')];
  if (!messages.length) return;
  let next = 0;
  let hideTimer;
  const hide = () => {
    clearTimeout(hideTimer);
    toast.classList.remove('is-visible');
    toast.setAttribute('aria-hidden', 'true');
    toast.inert = true;
  };
  const show = () => {
    if (document.hidden || document.querySelector('.cm50-result.cm50-visible')) return;
    messages.forEach((message, index) => { message.hidden = index !== next; });
    next = (next + 1) % messages.length;
    toast.inert = false;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 6000);
  };
  toast.querySelector('.purchase-toast__close').addEventListener('click', hide);
  toast.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  toast.addEventListener('mouseleave', () => { hideTimer = setTimeout(hide, 6000); });
  toast.addEventListener('focusin', () => clearTimeout(hideTimer));
  toast.addEventListener('focusout', () => { hideTimer = setTimeout(hide, 6000); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  setInterval(show, 20000);
})();
