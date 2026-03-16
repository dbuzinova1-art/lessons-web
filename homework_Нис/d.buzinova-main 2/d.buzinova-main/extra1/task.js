function simulateRequest() {
  return new Promise((resolve, reject) => {
    const delay = 300 + Math.random() * 1200;

    setTimeout(() => {
      if (Math.random() < 0.7) {
        resolve([
          { id: 1, title: 'Карточка #1: Бургер' },
          { id: 2, title: 'Карточка #2: Пицца' },
          { id: 3, title: 'Карточка #3: Суши' },
        ]);
      } else {
        reject('Ошибка сервера');
      }
    }, delay);
  });
}

(function setupExtra1() {
  const loadButton = document.getElementById('load-btn');
  const content = document.getElementById('content');

  if (!loadButton || !content) {
    return;
  }

  let isLoading = false;

  function renderLoading() {
    content.innerHTML = '<div class="loading">Загрузка...</div>';
  }

  function renderItems(items) {
    content.innerHTML = '';

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const element = document.createElement('div');
      element.className = 'item';
      element.textContent = item.title;
      fragment.appendChild(element);
    });

    content.appendChild(fragment);
  }

  function renderError(message) {
    content.innerHTML = '<div class="error">' + message + '</div>';
  }

  loadButton.addEventListener('click', async function () {
    // Флаг и disabled предотвращают повторный запрос по двойному клику.
    if (isLoading) {
      return;
    }

    isLoading = true;
    loadButton.disabled = true;
    renderLoading();

    try {
      const data = await simulateRequest();
      renderItems(data);
    } catch (error) {
      renderError(String(error || 'Ошибка сервера'));
    } finally {
      isLoading = false;
      loadButton.disabled = false;
    }
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simulateRequest };
}
