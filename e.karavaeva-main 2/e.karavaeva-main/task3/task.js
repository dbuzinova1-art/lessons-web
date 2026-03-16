// Функция получения данных с сервера
function searchOrdersOnServer(searchText) {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
         const allOrders = [
            { id: 1, title: 'Заказ #A-101', comment: 'Оставить у двери', status: 'new' },
            { id: 2, title: 'Заказ #A-100', comment: 'Быстрее',  status: 'delivery' },
            { id: 3, title: 'Заказ #A-099', comment: 'Я доплачу', status: 'cooking' },
            { id: 4, title: 'Заказ #A-098', comment: 'Оставьте себе', status: 'delivered' },
         ];
         const normalized = String(searchText || '').trim().toLowerCase();
         const filteredOrders = normalized
                 ? allOrders.filter((order) => {
                    return (
                      String(order.id).toLowerCase().includes(normalized) ||
                      String(order.title || '').toLowerCase().includes(normalized) ||
                      String(order.comment || '').toLowerCase().includes(normalized)
                    );
                 })
                 : allOrders;

         if (Math.random() > 0.2) {
            resolve(filteredOrders);
         } else {
            reject('Ошибка поиска заказов');
         }
      }, 300);
   });
}

// При вызове функций searchOrdersOnServer обязательно вызывай их через module.exports
function setupOrderSearchServerHandler(searchInput, searchClear, container) {
   if (!searchInput || !searchClear || !container) {
      return;
   }

   let debounceTimer = null;
   let requestVersion = 0;

   const errorElement = document.getElementById('search-error');

   function setError(message) {
      if (!errorElement) {
         return;
      }

      errorElement.textContent = message;
      errorElement.style.display = message ? 'block' : 'none';
   }

   function updateClearVisibility() {
      searchClear.style.display = searchInput.value.trim() ? 'block' : 'none';
   }

   function renderOrders(orders) {
      container.innerHTML = '';

      if (!orders.length) {
         container.textContent = 'Ничего не найдено';
         return;
      }

      const fragment = document.createDocumentFragment();

      orders.forEach((order) => {
         const orderElement = document.createElement('div');
         orderElement.className = 'order ' + order.status;
         orderElement.dataset.id = String(order.id);

         const title = document.createElement('div');
         title.className = 'order-title';
         title.textContent = order.title;

         const comment = document.createElement('div');
         comment.className = 'order-comment';
         comment.textContent = order.comment;

         orderElement.appendChild(title);
         orderElement.appendChild(comment);
         fragment.appendChild(orderElement);
      });

      container.appendChild(fragment);
   }

   async function loadOrders(searchText) {
      const currentRequest = ++requestVersion;
      setError('');

      try {
         const hasModuleExports = typeof module !== 'undefined' && module.exports;
         const serverSearch = hasModuleExports && module.exports.searchOrdersOnServer
            ? module.exports.searchOrdersOnServer
            : searchOrdersOnServer;
         const orders = await serverSearch(searchText);

         if (currentRequest !== requestVersion) {
            return;
         }

         const normalizedSearch = searchText.trim().toLowerCase();
         const filtered = orders.filter((order) => {
            if (!normalizedSearch) {
               return true;
            }

            return (
               String(order.id).toLowerCase().includes(normalizedSearch) ||
               String(order.title || '').toLowerCase().includes(normalizedSearch) ||
               String(order.comment || '').toLowerCase().includes(normalizedSearch)
            );
         });

         renderOrders(filtered);
      } catch (error) {
         if (currentRequest !== requestVersion) {
            return;
         }

         container.textContent = 'Ошибка при загрузке заказов';
         setError(String(error || 'Ошибка при загрузке заказов'));
      }
   }

   function scheduleSearch() {
      updateClearVisibility();
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function () {
         loadOrders(searchInput.value.trim());
      }, 300);
   }

   searchInput.addEventListener('input', scheduleSearch);
   searchClear.addEventListener('click', function () {
      searchInput.value = '';
      updateClearVisibility();
      clearTimeout(debounceTimer);
      loadOrders('');
   });

   updateClearVisibility();
   loadOrders('');
}

if (typeof module !== 'undefined' && module.exports) {
   module.exports = { setupOrderSearchServerHandler, searchOrdersOnServer };
}