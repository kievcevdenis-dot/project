const API_URL = "https://poll-backend-b17o.onrender.com";

async function updateUI() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        
        // Поддержка обоих форматов (прямой JSON или обертка .record от JSONBin)
        const pollData = data.record ? data.record : data;

        const total = Object.values(pollData).reduce((a, b) => a + b, 0);
        document.getElementById('total-votes').innerText = `Голосов: ${total}`;

        for (let key in pollData) {
            const percentage = total > 0 ? Math.round((pollData[key] / total) * 100) : 0;
            const bar = document.getElementById(`bar-${key}`);
            const label = document.getElementById(`percent-${key}`);
            
            if (bar) bar.style.width = percentage + '%';
            if (label) label.innerText = percentage + '%';
        }

        // Проверяем, голосовал ли юзер раньше, и отключаем кнопки
        checkVoteStatus();

    } catch (e) {
        console.error("Ошибка при обновлении интерфейса:", e);
    }
}

function checkVoteStatus() {
    if (localStorage.getItem('hasVoted') === 'true') {
        // Находим все кнопки и отключаем их
        const buttons = document.querySelectorAll('.vote-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.innerText = "Голос принят";
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        });
    }
}

async function vote(lang) {
    // Если уже голосовал — ничего не делаем
    if (localStorage.getItem('hasVoted') === 'true') {
        alert("Вы уже проголосовали!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/vote/${lang}`, { method: 'POST' });
        if (response.ok) {
            // Запоминаем выбор в браузере
            localStorage.setItem('hasVoted', 'true');
            // Обновляем цифры и блокируем кнопки
            await updateUI();
        } else {
            alert("Ошибка сервера при попытке проголосовать.");
        }
    } catch (e) {
        console.error("Ошибка сети:", e);
        alert("Не удалось связаться с сервером.");
    }
}

window.onload = updateUI;
