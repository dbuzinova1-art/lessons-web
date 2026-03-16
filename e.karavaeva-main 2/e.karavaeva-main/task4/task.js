function setupFavoriteHandler(container) {
  container = container || (typeof document !== 'undefined' ? document.getElementById('orders') : null);
  if (!container) {
    return;
  }

  const animationState = new WeakMap();

  function ensureButton(order) {
    let button = order.querySelector('.favorite-button');
    if (!button) {
      button = document.createElement('button');
      button.className = 'favorite-button';
      button.title = 'Добавить в избранное';
      button.type = 'button';
      button.textContent = '❤';
      order.appendChild(button);
    }
  }

  function ensureButtonsForAll() {
    const orders = container.querySelectorAll('.order');
    orders.forEach(ensureButton);
  }

  function stopRotation(button) {
    const state = animationState.get(button);
    if (state && state.rafId) {
      cancelAnimationFrame(state.rafId);
    }

    animationState.delete(button);
    button.style.transform = '';
  }

  function startRotation(button) {
    stopRotation(button);

    const state = {
      angle: 0,
      lastTs: 0,
      rafId: 0,
    };

    function animate(timestamp) {
      if (!button.classList.contains('rotating')) {
        return;
      }

      if (!state.lastTs) {
        state.lastTs = timestamp;
      }

      const delta = timestamp - state.lastTs;
      state.lastTs = timestamp;
      state.angle = (state.angle + (delta * 0.24)) % 360;
      button.style.transform = 'rotate(' + state.angle + 'deg)';
      state.rafId = requestAnimationFrame(animate);
    }

    animationState.set(button, state);
    state.rafId = requestAnimationFrame(animate);
  }

  ensureButtonsForAll();

  // Добавляем кнопки для новых карточек заказов без ручных вызовов.
  const observer = new MutationObserver(function () {
    ensureButtonsForAll();
  });
  observer.observe(container, { childList: true, subtree: true });

  container.addEventListener('click', function (event) {
    const button = event.target.closest('.favorite-button');
    if (!button || !container.contains(button)) {
      return;
    }

    const order = button.closest('.order');
    if (!order) {
      return;
    }

    const isFavorite = button.classList.contains('favorite');
    const isRotating = button.classList.contains('rotating');

    if (!isFavorite) {
      button.classList.add('favorite');
      order.classList.add('favorite');
      button.classList.remove('rotating');
      stopRotation(button);
      return;
    }

    if (isFavorite && !isRotating) {
      button.classList.add('rotating');
      order.classList.add('favorite');
      startRotation(button);
      return;
    }

    button.classList.remove('favorite', 'rotating');
    order.classList.remove('favorite');
    stopRotation(button);
  });
}

function setupFavoriteHandlerAdditional() {
   const searchInput = window.document.getElementById('order-search');
   const searchClear = window.document.querySelector('.search-clear');
   const filterReady = window.document.querySelector('.filter-ready');
   const filterNew = window.document.querySelector('.filter-new');
   const container = window.document.getElementById('orders');

   if (!container) {
     return;
   }

   if (searchInput && searchClear && typeof setupOrderSearchServerHandler === 'function') {
     setupOrderSearchServerHandler(searchInput, searchClear, container);
   }

   if (searchInput && searchClear && filterReady && filterNew && typeof setupOrderSearchHandler === 'function') {
     setupOrderSearchHandler(searchInput, searchClear, filterReady, filterNew, container);
   }

   if (typeof setupOrderHandlers === 'function') {
     setupOrderHandlers(container);
   }

   setupFavoriteHandler(container);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupFavoriteHandler, setupFavoriteHandlerAdditional };
}