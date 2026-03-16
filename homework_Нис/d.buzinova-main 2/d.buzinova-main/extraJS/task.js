(function setupExtra3() {
  const startButton = document.getElementById('start-btn');
  const successButton = document.getElementById('success-btn');
  const errorButton = document.getElementById('error-btn');
  const status = document.getElementById('status');

  if (!startButton || !successButton || !errorButton || !status) {
    return;
  }

  let externalResolve = null;
  let externalReject = null;
  let isPending = false;

  function setStatus(text, className) {
    status.textContent = text;
    status.className = className || '';
  }

  startButton.addEventListener('click', function () {
    if (isPending) {
      return;
    }

    isPending = true;
    setStatus('Загрузка...', 'loading');

    const controlledPromise = new Promise((resolve, reject) => {
      // Сохраняем resolve/reject, чтобы вызвать их позже из других обработчиков.
      externalResolve = resolve;
      externalReject = reject;
    });

    controlledPromise
      .then((message) => {
        setStatus(String(message), 'success');
      })
      .catch((message) => {
        setStatus(String(message), 'error');
      })
      .finally(() => {
        isPending = false;
        externalResolve = null;
        externalReject = null;
      });
  });

  successButton.addEventListener('click', function () {
    if (!isPending || !externalResolve) {
      return;
    }

    externalResolve('Успех: данные загружены');
  });

  errorButton.addEventListener('click', function () {
    if (!isPending || !externalReject) {
      return;
    }

    externalReject('Ошибка: что-то пошло не так');
  });
})();
