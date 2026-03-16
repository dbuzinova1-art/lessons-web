function randomDelay() {
  return 200 + Math.random() * 1800;
}

function simulateSource1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Источник 1: заказ A-101', 'Источник 1: заказ A-102']);
    }, randomDelay());
  });
}

function simulateSource2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.75) {
        resolve(['Источник 2: клиент Иванов', 'Источник 2: клиент Петров']);
      } else {
        reject('Источник 2 недоступен');
      }
    }, randomDelay());
  });
}

function simulateSource3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve(['Источник 3: статус delivered']);
      } else {
        reject('Источник 3 вернул ошибку');
      }
    }, randomDelay());
  });
}

(function setupExtra2() {
  const button = document.getElementById('load-all');
  const result = document.getElementById('result');

  if (!button || !result) {
    return;
  }

  let isLoading = false;

  function renderLoading() {
    result.textContent = 'Загрузка данных из 3 источников...';
  }

  function renderSettled(settledResults) {
    result.innerHTML = '';

    settledResults.forEach((entry, index) => {
      const block = document.createElement('div');

      if (entry.status === 'fulfilled') {
        block.className = 'ok';
        block.innerHTML = '<strong>Источник ' + (index + 1) + ':</strong><br>' + entry.value.join('<br>');
      } else {
        block.className = 'bad';
        block.textContent = 'Источник ' + (index + 1) + ': ' + String(entry.reason);
      }

      result.appendChild(block);
    });
  }

  button.addEventListener('click', async function () {
    if (isLoading) {
      return;
    }

    isLoading = true;
    button.disabled = true;
    renderLoading();

    try {
      // allSettled позволяет показать и успешные источники, и ошибки упавших.
      const settled = await Promise.allSettled([
        simulateSource1(),
        simulateSource2(),
        simulateSource3(),
      ]);

      renderSettled(settled);
    } finally {
      isLoading = false;
      button.disabled = false;
    }
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    simulateSource1,
    simulateSource2,
    simulateSource3,
  };
}
