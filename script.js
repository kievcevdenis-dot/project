const API_URL = "https://poll-backend-b17o.onrender.com";

async function updateUI() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
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

        // Если уже голосовал, блокируем всё
        if (localStorage.getItem('hasVoted') === 'true') {
            disableButtons();
        }
    } catch (e) {
        console.error("Ошибка обновления:", e);
    }
}

function disableButtons() {
    // Находим вообще ВСЕ кнопки на странице
    const buttons = document.getElementsByTagName('button');
    for (let btn of buttons) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        if (btn.innerText.length < 20) { // Чтобы не менять длинные тексты
            btn.innerText = "Принято";
        }
    }
}

async function vote(lang) {
    if (localStorage.getItem('hasVoted') === 'true') {
        alert("Вы уже голосовали!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/vote/${lang}`, { method: 'POST' });
        if (response.ok) {
            localStorage.setItem('hasVoted', 'true');
            await updateUI();
        }
    } catch (e) {
        alert("Ошибка сети. Попробуй позже.");
    }
}

window.onload = updateUI;
