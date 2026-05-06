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

                const editButton = row.querySelector('.btn-edit');
                if (editButton) {
                    editButton.remove();
                }
            }
        });
    } catch (err) {
        console.error("Ошибка обновления данных:", err);
    }
}

setInterval(checkUpdates, 2000);

function openEditModal(id, value, comment) {
    const modal = document.getElementById('editModal');
    const form = document.getElementById('editForm');

    form.action = `/admin/edit/${id}`;

    document.getElementById('editValue').value = value;
    document.getElementById('editComment').value = comment;

    modal.style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeEditModal();
    }
}