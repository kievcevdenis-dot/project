const API_URL = "https://poll-backend-b17o.onrender.com"; // ТВОЙ АДРЕС

async function updateUI() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        
        // JSONBin иногда прячет данные в поле "record"
        // Эта строчка поймет и старый, и новый формат:
        const pollData = data.record ? data.record : data;

        console.log("Данные получены:", pollData);

        const total = Object.values(pollData).reduce((a, b) => a + b, 0);
        document.getElementById('total-votes').innerText = `Голосов: ${total}`;

        for (let key in pollData) {
            const percentage = total > 0 ? Math.round((pollData[key] / total) * 100) : 0;
            const bar = document.getElementById(`bar-${key}`);
            const label = document.getElementById(`percent-${key}`);
            if (bar) bar.style.width = percentage + '%';
            if (label) label.innerText = percentage + '%';
        }
    } catch (e) {
        console.error("Ошибка обновления:", e);
    }
}

async function vote(id) {
    try {
        const response = await fetch(`${API_URL}/vote/${id}`, { method: 'POST' });
        if (response.ok) {
            await updateUI();
            localStorage.setItem('hasVoted', 'true');
        }
    } catch (e) {
        console.error("Ошибка при голосовании:", e);
    }
}

window.onload = updateUI;
