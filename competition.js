// 竞赛详情页数据加载
document.addEventListener('DOMContentLoaded', () => {
    const competitionId = getCompetitionIdFromUrl();
    
    // 加载竞赛数据
    fetch(`/api/competitions/${competitionId}`)
        .then(response => response.json())
        .then(data => {
            renderCompetitionDetails(data);
            loadSubmissions(competitionId);
        })
        .catch(error => {
            console.error('加载竞赛数据失败:', error);
            showErrorMessage('无法加载竞赛数据，请稍后再试');
        });
        
    // 提交按钮事件监听
    const submitButton = document.getElementById('submit-prompt');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            window.location.href = `/submit?competition=${competitionId}`;
        });
    }
});

// 渲染竞赛详情
function renderCompetitionDetails(competition) {
    // 更新页面元素
    document.getElementById('competition-title').textContent = competition.title;
    document.getElementById('competition-description').innerHTML = competition.description;
    document.getElementById('prize-amount').textContent = `¥${competition.prize.toLocaleString()}`;
    
    // 设置倒计时
    const deadline = new Date(competition.deadlineDate);
    startCountdown(deadline, 'countdown-timer');
    
    // 更新企业信息
    document.getElementById('company-name').textContent = competition.company.name;
    document.getElementById('company-logo').src = competition.company.logoUrl;
    
    // 渲染评估标准
    const criteriaList = document.getElementById('evaluation-criteria');
    competition.evaluationCriteria.forEach(criterion => {
        const li = document.createElement('li');
        li.textContent = criterion;
        criteriaList.appendChild(li);
    });
}

// 倒计时功能
function startCountdown(deadline, elementId) {
    // ... 倒计时实现代码 ...
} 