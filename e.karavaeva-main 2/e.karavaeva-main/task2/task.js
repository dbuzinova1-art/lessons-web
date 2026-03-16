function setupOrderSearchHandler(searchInput, searchClear, filterReady, filterNew, container) {
    if (!searchInput || !searchClear || !filterReady || !filterNew || !container) {
        return;
    }

    const readyStatuses = new Set(['cooking', 'delivery', 'delivered']);

    function updateClearVisibility() {
        searchClear.style.display = searchInput.value.trim() ? 'block' : 'none';
    }

    function isStatusMatched(status) {
        const showReady = filterReady.checked;
        const showNew = filterNew.checked;

        if (!showReady && !showNew) {
            return true;
        }

        if (showNew && status === 'new') {
            return true;
        }

        return showReady && readyStatuses.has(status);
    }

    function applyFilters() {
        const searchText = searchInput.value.trim().toLowerCase();
        const orders = container.querySelectorAll('.order');

        orders.forEach((order) => {
            const idText = (order.dataset.id || '').toLowerCase();
            const titleText = (order.querySelector('.order-title')?.textContent || '').toLowerCase();
            const clientText = (order.querySelector('.order-client')?.textContent || '').toLowerCase();
            const status = order.dataset.status || '';

            const matchesSearch =
                !searchText ||
                idText.includes(searchText) ||
                titleText.includes(searchText) ||
                clientText.includes(searchText);
            const matchesStatus = isStatusMatched(status);

            order.style.display = matchesSearch && matchesStatus ? '' : 'none';
        });

        updateClearVisibility();
    }

    searchInput.addEventListener('input', applyFilters);
    searchClear.addEventListener('click', function () {
        searchInput.value = '';
        applyFilters();
    });

    filterReady.addEventListener('change', applyFilters);
    filterNew.addEventListener('change', applyFilters);

    applyFilters();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setupOrderSearchHandler };
}