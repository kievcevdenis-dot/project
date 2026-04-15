const API_URL = "https://poll-backend-b17o.onrender.com";

// 1. ФУНКЦИЯ ОБНОВЛЕНИЯ ДАННЫХ
async function updateUI() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        const stats = data.record || data;

        // Считаем общее количество
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        
        const totalElem = document.getElementById('total-votes');
        if (totalElem) totalElem.innerText = `Голосов: ${total}`;

        // Обновляем полоски и проценты по твоим ID
        const keys = ['py', 'cpp', 'other'];
        keys.forEach(key => {
            const val = stats[key] || 0;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            
            const bar = document.getElementById(`bar-${key}`);
            const lbl = document.getElementById(`percent-${key}`);
            
            if (bar) bar.style.width = pct + '%';
            if (lbl) lbl.innerText = pct + '%';
        });

        // Если уже голосовал — выключаем кнопки
        if (localStorage.getItem('voted') === 'true') {
            disablePoll();
        }
    } catch (e) {
        console.log("Сервер просыпается...");
    }
}

// 2. ФУНКЦИЯ ГОЛОСОВАНИЯ
async function vote(lang) {
    if (localStorage.getItem('voted') === 'true') return;

    // Мгновенная блокировка
    localStorage.setItem('voted', 'true');
    disablePoll();

    try {
        const res = await fetch(`${API_URL}/vote/${lang}`, { method: 'POST' });
        if (res.ok) {
            await updateUI();
        }
    } catch (e) {
        console.error("Ошибка при отправке голоса");
    }
}

// 3. БЛОКИРОВКА КНОПОК (Твои классы .poll-btn)
function disablePoll() {
    const btns = document.querySelectorAll('.poll-btn');
    btns.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = "default";
        // Мы не меняем прозрачность кнопки совсем в ноль, чтобы полоски было видно
        btn.classList.add('voted'); 
    });
}

window.onload = updateUI;
