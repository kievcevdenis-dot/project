const API_URL = "https://poll-backend-b17o.onrender.com";

async function updateUI() {
    // 1. ПЕРВЫМ ДЕЛОМ проверяем, голосовал ли уже юзер
    const hasVoted = localStorage.getItem('hasVoted');
    
    if (hasVoted === 'true') {
        disableButtons();
    }

    try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        const stats = data.record || data;

        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        document.getElementById('total-votes').innerText = `Всего голосов: ${total}`;

        const keys = ['py', 'cpp', 'other'];
        keys.forEach(key => {
            const val = stats[key] || 0;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            const bar = document.getElementById(`bar-${key}`);
            const lbl = document.getElementById(`percent-${key}`);
            if (bar) bar.style.width = pct + '%';
            if (lbl) lbl.innerText = pct + '%';
        });
    } catch (e) {
        console.log("Ошибка загрузки");
    }
}

function disableButtons() {
    const btns = document.querySelectorAll('button');
    btns.forEach(b => {
        b.disabled = true;
        b.style.opacity = "0.5";
        b.style.cursor = "not-allowed";
        b.innerText = "Голос принят";
    });
}

async function vote(lang) {
    // ЗАЩИТА: Если метка стоит, функция ВООБЩЕ ничего не делает
    if (localStorage.getItem('hasVoted') === 'true') {
        alert("Вы уже проголосовали!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/vote/${lang}`, { method: 'POST' });
        if (res.ok) {
            // Ставим метку ПЕРЕД обновлением страницы
            localStorage.setItem('hasVoted', 'true');
            alert("Спасибо! Ваш голос учтен.");
            location.reload(); 
        }
    } catch (e) {
        alert("Ошибка! Проверь интернет.");
    }
}

// Запускаем всё при загрузке
window.onload = updateUI;
