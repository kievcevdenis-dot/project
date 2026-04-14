const API_URL = "https://poll-backend-b17o.onrender.com";

async function updateUI() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        const stats = data.record || data;

        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        document.getElementById('total-votes').innerText = `Всего голосов: ${total}`;

        const langs = ['py', 'cpp', 'other'];
        langs.forEach(key => {
            const val = stats[key] || 0;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            if (document.getElementById(`bar-${key}`)) {
                document.getElementById(`bar-${key}`).style.width = pct + '%';
                document.getElementById(`percent-${key}`).innerText = pct + '%';
            }
        });
    } catch (e) {
        console.log("Ошибка загрузки");
    }
}

async function vote(lang) {
    try {
        await fetch(`${API_URL}/vote/${lang}`, { method: 'POST' });
        // Сразу перезагружаем, чтобы 100% увидеть новые данные
        location.reload();
    } catch (e) {
        alert("Ошибка! Проверь интернет.");
    }
}

window.onload = updateUI;
