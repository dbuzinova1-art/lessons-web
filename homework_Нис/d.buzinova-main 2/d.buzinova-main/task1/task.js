async function setupOrderHandlers(container) {
  if (!container) {
    return;
  }

  function getOrderDetails(order) {
    let details = order.querySelector('.order-details');
    if (!details) {
      details = document.createElement('div');
      details.className = 'order-details';
      details.innerHTML =
        '<strong>Клиент:</strong> ' + (order.dataset.client || '') + '<br>' +
        '<strong>Товары:</strong> ' + (order.dataset.items || '') + '<br>' +
        '<strong>Сумма:</strong> ' + (order.dataset.total || '') + '<br>' +
        '<strong>Адрес:</strong> ' + (order.dataset.address || '');
      order.appendChild(details);
    }

    return details;
  }

  container.addEventListener('mouseover', function (event) {
    const order = event.target.closest('.order');
    if (!order || !container.contains(order)) {
      return;
    }

    getOrderDetails(order);
    order.classList.add('show-details');
  });

  container.addEventListener('mouseout', function (event) {
    const order = event.target.closest('.order');
    if (!order || !container.contains(order)) {
      return;
    }

    const related = event.relatedTarget;
    if (related && order.contains(related)) {
      return;
    }

    order.classList.remove('show-details');
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupOrderHandlers };
}