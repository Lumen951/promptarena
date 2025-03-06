// 登录/注册页面交互功能

document.addEventListener('DOMContentLoaded', () => {
  // 切换登录和注册表单
  setupTabSwitching();
  
  // 表单验证
  setupFormValidation();
  
  // 社交媒体登录按钮
  setupSocialAuth();
});

// 设置表单切换功能
function setupTabSwitching() {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      
      // 添加当前活动状态
      tab.classList.add('active');
      const targetForm = document.getElementById(tab.getAttribute('data-target'));
      targetForm.classList.add('active');
    });
  });
}

// 设置表单验证
function setupFormValidation() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  // 登录表单验证
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
      showError(loginForm, '请填写用户名和密码');
      return;
    }
    
    // 这里应该发送登录请求到服务器
    simulateFormSubmission(loginForm, '登录成功', () => {
      // 登录成功后重定向
      window.location.href = '../index.html';
    });
  });
  
  // 注册表单验证
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;
    const termsAgreed = document.getElementById('terms-agree').checked;
    
    if (!username || !password) {
      showError(registerForm, '请填写用户名和密码');
      return;
    }
    
    if (password !== confirmPassword) {
      showError(registerForm, '两次输入的密码不一致');
      return;
    }
    
    if (!termsAgreed) {
      showError(registerForm, '请同意服务条款和隐私政策');
      return;
    }
    
    // 这里应该发送注册请求到服务器
    simulateFormSubmission(registerForm, '注册成功', () => {
      // 注册成功后切换到登录表单
      document.querySelector('.auth-tab[data-target="login-form"]').click();
    });
  });
}

// 设置社交媒体登录
function setupSocialAuth() {
  const googleButtons = document.querySelectorAll('.social-button.google');
  const githubButtons = document.querySelectorAll('.social-button.github');
  
  googleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 这里应该实现Google OAuth登录逻辑
      console.log('通过Google登录');
      button.innerHTML = '<img src="../assets/loading.svg" alt="Loading"> 请稍候...';
      
      // 模拟社交登录
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    });
  });
  
  githubButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 这里应该实现GitHub OAuth登录逻辑
      console.log('通过GitHub登录');
      button.innerHTML = '<img src="../assets/loading.svg" alt="Loading"> 请稍候...';
      
      // 模拟社交登录
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    });
  });
}

// 显示表单错误信息
function showError(form, message) {
  // 移除之前的错误信息
  const existingError = form.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // 添加新错误信息
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  
  form.querySelector('button[type="submit"]').before(errorElement);
}

// 模拟表单提交
function simulateFormSubmission(form, successMessage, callback) {
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  
  // 显示加载状态
  button.textContent = '请稍候...';
  button.disabled = true;
  
  // 模拟网络请求
  setTimeout(() => {
    // 显示成功消息
    showSuccess(form, successMessage);
    
    // 重置按钮
    button.textContent = originalText;
    button.disabled = false;
    
    // 执行回调
    if (callback) {
      setTimeout(callback, 1500);
    }
  }, 2000);
}

// 显示成功信息
function showSuccess(form, message) {
  // 移除之前的错误信息
  const existingError = form.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // 添加成功信息
  const successElement = document.createElement('div');
  successElement.className = 'form-success';
  successElement.style.color = '#2ecc71';
  successElement.style.fontSize = '0.85rem';
  successElement.style.marginTop = '5px';
  successElement.textContent = message;
  
  form.querySelector('button[type="submit"]').before(successElement);
} 