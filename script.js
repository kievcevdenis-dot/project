// 1. ЗАМЕНИ ЭТУ ССЫЛКУ на ту, которую выдаст Amvera в настройках проекта
const API_URL = "https://poll-backend-b17o.onrender.com"; 

// Функция для блокировки кнопок (твой старый код)
function disableButtons() {
    const buttons = document.querySelectorAll('.poll-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    });
}

// Функция обновления интерфейса (твоя логика + загрузка с сервера)
async function updateUI() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) return;
        
        const pollData = await response.json();
        const total = Object.values(pollData).reduce((a, b) => a + b, 0);
        
        // Обновляем полоски и проценты (твой цикл)
        for (let key in pollData) {
            const percentage = total > 0 ? Math.round((pollData[key] / total) * 100) : 0;
            const bar = document.getElementById(`bar-${key}`);
            const percentLabel = document.getElementById(`percent-${key}`);
            
            if (bar) bar.style.width = percentage + '%';
            if (percentLabel) percentLabel.innerText = percentage + '%';
        }
        
        document.getElementById('total-votes').innerText = `Голосов: ${total}`;
    } catch (e) {
        console.log("Сервер Amvera пока недоступен или адрес указан неверно.");
    }
}

// Твоя функция vote, но теперь она отправляет данные на сервер
async function vote(id) {
    // Блокируем кнопки сразу (твой код)
    disableButtons();

    try {
        // Отправляем голос на Amvera
        const response = await fetch(`${API_URL}/vote/${id}`, { 
            method: 'POST' 
        });

        if (response.ok) {
            // Если сервер записал голос, обновляем цифры для всех
            await updateUI();
            // Помечаем в браузере, что мы уже голосовали
            localStorage.setItem('hasVoted', 'true');
        }
    } catch (e) {
        alert("Не удалось сохранить голос. Проверь сервер!");
        // В случае ошибки возвращаем кнопки назад
        const buttons = document.querySelectorAll('.poll-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });
    }
}

// Запускаем проверку при входе на сайт
window.onload = () => {
    updateUI();
    
    // Если в памяти браузера есть метка, что голосовали — блокируем кнопки
    if (localStorage.getItem('hasVoted') === 'true') {
        disableButtons();
    }
};
