// 使用WebSocket实现实时排行榜更新
const leaderboardSocket = new WebSocket('wss://promptarena.com/ws/leaderboard');

leaderboardSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'new_submission') {
        updateLeaderboardEntry(data.submission);
    } else if (data.type === 'score_update') {
        updateLeaderboardScore(data.submission_id, data.new_score);
    }
};

function updateLeaderboardEntry(submission) {
    // 检查是否需要添加新条目
    const existingRow = document.querySelector(`#submission-${submission.id}`);
    
    if (existingRow) {
        // 更新已有条目
        updateExistingRow(existingRow, submission);
    } else {
        // 添加新条目并重排序
        addNewRow(submission);
        sortLeaderboard();
    }
}

function sortLeaderboard() {
    // 重新排序表格
    const tbody = document.querySelector('.leaderboard-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const scoreA = parseFloat(a.querySelector('.score').textContent);
        const scoreB = parseFloat(b.querySelector('.score').textContent);
        return scoreB - scoreA; // 降序排列
    });
    
    // 清空并重新添加排序后的行
    tbody.innerHTML = '';
    rows.forEach((row, index) => {
        row.querySelector('.rank').textContent = index + 1;
        tbody.appendChild(row);
    });
} 