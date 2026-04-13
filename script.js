let pollData = { cpp: 0, py: 0, other: 0 };

function vote(id) {
    pollData[id]++;
    const total = Object.values(pollData).reduce((a, b) => a + b, 0);
    
    for (let key in pollData) {
        const percentage = Math.round((pollData[key] / total) * 100);
        document.getElementById(`bar-${key}`).style.width = percentage + '%';
        document.getElementById(`percent-${key}`).innerText = percentage + '%';
    }
    
    document.getElementById('total-votes').innerText = `Голосов: ${total}`;
    const buttons = document.querySelectorAll('.poll-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    });
}