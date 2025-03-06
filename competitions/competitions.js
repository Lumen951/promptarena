// 竞赛页面交互功能

document.addEventListener('DOMContentLoaded', () => {
  // 筛选器交互
  setupFilters();
  
  // 排序功能
  setupSorting();
  
  // 添加按钮筛选功能
  setupFilterButtons();
});

// 存储所有竞赛卡片信息，方便筛选操作
let allCompetitions = [];

function setupFilters() {
  const filterOptions = document.querySelectorAll('.filter-option input');
  const resetButton = document.querySelector('.filter-reset');
  
  // 初始化加载所有竞赛卡片
  cacheAllCompetitions();
  
  // 监听筛选器变化
  filterOptions.forEach(option => {
    option.addEventListener('change', () => {
      applyFilters();
    });
  });
  
  // 重置筛选器
  resetButton.addEventListener('click', () => {
    filterOptions.forEach(option => {
      if (option.id !== 'status-active') {
        option.checked = false;
      } else {
        option.checked = true;
      }
    });
    applyFilters();
  });
}

// 缓存所有竞赛卡片信息，用于筛选
function cacheAllCompetitions() {
  const competitionCards = document.querySelectorAll('.competition-card');
  allCompetitions = [];
  
  competitionCards.forEach(card => {
    // 获取每个卡片的关键信息
    const title = card.querySelector('.competition-title').textContent;
    const sponsor = card.querySelector('.competition-sponsor').textContent;
    const description = card.querySelector('.competition-description').textContent;
    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
    const model = card.querySelector('.tag').textContent; // 假设第一个标签是模型
    const deadline = card.querySelector('.meta-item:nth-child(2)').textContent;
    const prize = card.querySelector('.meta-item:nth-child(1)').textContent;
    
    allCompetitions.push({
      element: card,
      title,
      sponsor,
      description,
      tags,
      model,
      deadline,
      prize,
      displayed: true
    });
  });
}

function applyFilters() {
  // 获取所有选中的筛选条件
  const selectedModels = getSelectedValues('model');
  const selectedTypes = getSelectedValues('type');
  const selectedStatus = getSelectedValues('status');
  
  // 恢复所有竞赛的初始状态
  allCompetitions.forEach(comp => {
    comp.displayed = true;
  });
  
  // 应用模型筛选
  if (selectedModels.length > 0) {
    allCompetitions.forEach(comp => {
      if (!selectedModels.some(model => comp.model.includes(model))) {
        comp.displayed = false;
      }
    });
  }
  
  // 应用类型筛选
  if (selectedTypes.length > 0) {
    allCompetitions.forEach(comp => {
      if (!selectedTypes.some(type => comp.tags.includes(type.toLowerCase()))) {
        comp.displayed = false;
      }
    });
  }
  
  // 应用状态筛选
  if (selectedStatus.includes('active')) {
    // 假设我们通过截止日期来判断是否活跃
    const today = new Date();
    allCompetitions.forEach(comp => {
      const deadlineText = comp.deadline.split('截止: ')[1];
      const deadlineDate = new Date(deadlineText);
      if (deadlineDate < today) {
        comp.displayed = false;
      }
    });
  }
  
  // 更新显示
  updateDisplay();
}

function getSelectedValues(filterType) {
  const checkboxes = document.querySelectorAll(`.filter-option input[name="${filterType}"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

function updateDisplay() {
  // 更新卡片显示状态
  allCompetitions.forEach(comp => {
    if (comp.displayed) {
      comp.element.style.display = '';
    } else {
      comp.element.style.display = 'none';
    }
  });
  
  // 更新显示的比赛数量
  updateCompetitionCount();
}

function updateCompetitionCount() {
  const displayedCount = allCompetitions.filter(comp => comp.displayed).length;
  const totalCount = allCompetitions.length;
  const countElement = document.querySelector('.list-count');
  if (countElement) {
    countElement.innerHTML = `显示 <span class="highlight">${displayedCount}</span> 个竞赛，共 ${totalCount} 个`;
  }
}

function setupSorting() {
  const sortSelect = document.getElementById('sort-select');
  
  sortSelect.addEventListener('change', () => {
    const sortValue = sortSelect.value;
    console.log(`按 ${sortValue} 排序`);
    
    // 根据选项排序
    switch (sortValue) {
      case 'deadline':
        sortCompetitions('deadline');
        break;
      case 'prize':
        sortCompetitions('prize');
        break;
      case 'popularity':
        sortCompetitions('popularity');
        break;
      default:
        break;
    }
  });
}

function sortCompetitions(criteria) {
  const competitionList = document.querySelector('.competition-cards');
  const cards = Array.from(competitionList.children);
  
  cards.sort((a, b) => {
    if (criteria === 'deadline') {
      // 按截止日期排序
      const dateA = new Date(a.querySelector('.meta-item:nth-child(2)').textContent.split('截止: ')[1]);
      const dateB = new Date(b.querySelector('.meta-item:nth-child(2)').textContent.split('截止: ')[1]);
      return dateA - dateB;
    } else if (criteria === 'prize') {
      // 按奖金排序
      const prizeA = parseInt(a.querySelector('.meta-item:nth-child(1)').textContent.match(/¥(\d+),(\d+)/)[0].replace(/[¥,]/g, ''));
      const prizeB = parseInt(b.querySelector('.meta-item:nth-child(1)').textContent.match(/¥(\d+),(\d+)/)[0].replace(/[¥,]/g, ''));
      return prizeB - prizeA; // 降序
    } else if (criteria === 'popularity') {
      // 按参与人数排序
      const popularityA = parseInt(a.querySelector('.meta-item:nth-child(3)').textContent.match(/\d+/)[0]);
      const popularityB = parseInt(b.querySelector('.meta-item:nth-child(3)').textContent.match(/\d+/)[0]);
      return popularityB - popularityA; // 降序
    }
    return 0;
  });
  
  // 重新排列DOM
  cards.forEach(card => {
    competitionList.appendChild(card);
  });
}

// 设置快速筛选按钮功能
function setupFilterButtons() {
  // 添加快速筛选按钮到页面
  const listControls = document.querySelector('.list-controls');
  if (listControls) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'quick-filter-buttons';
    buttonContainer.innerHTML = `
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="gpt4">GPT-4</button>
      <button class="filter-btn" data-filter="claude">Claude</button>
      <button class="filter-btn" data-filter="commerce">电商</button>
      <button class="filter-btn" data-filter="finance">金融</button>
    `;
    listControls.appendChild(buttonContainer);
    
    // 添加按钮筛选事件
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 更新按钮状态
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        quickFilter(filterValue);
      });
    });
  }
}

function quickFilter(filterValue) {
  // 重置所有卡片显示
  allCompetitions.forEach(comp => {
    comp.displayed = true;
  });
  
  // 应用快速筛选
  if (filterValue !== 'all') {
    allCompetitions.forEach(comp => {
      if (filterValue === 'gpt4' && !comp.model.includes('GPT-4')) {
        comp.displayed = false;
      } else if (filterValue === 'claude' && !comp.model.includes('Claude')) {
        comp.displayed = false;
      } else if (filterValue === 'commerce' && !comp.tags.includes('电商')) {
        comp.displayed = false;
      } else if (filterValue === 'finance' && !comp.tags.includes('金融')) {
        comp.displayed = false;
      }
    });
  }
  
  // 更新显示
  updateDisplay();
} 