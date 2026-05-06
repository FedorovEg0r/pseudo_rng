async function checkUpdates() {
    try {
        const response = await fetch('/api/shown_ids');
        const shownIds = await response.json();

        shownIds.forEach(id => {
            const row = document.getElementById(`row-${id}`);
            if (row && !row.classList.contains('shown')) {
                row.classList.add('shown');

                const statusCell = row.querySelector('.status-cell');
                if (statusCell) {
                    statusCell.innerText = 'Выдано';
                }
            }
        });
    } catch (err) {
        console.error("Ошибка обновления данных:", err);
    }
}

setInterval(checkUpdates, 2000);