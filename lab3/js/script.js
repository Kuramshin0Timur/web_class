
document.addEventListener('DOMContentLoaded', function() {
    console.log('Добро пожаловать в Музей Искусств!');

    initInteractiveMenu();
    
    initBackgroundMusic();
    
    initTooltips();
    
    initFormHandlers();
    
    initScrollAnimations();
});

function initInteractiveMenu() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', function(e) {
            if (this.hostname !== window.location.hostname) return;
            
            e.preventDefault();
            playClickSound();
            
            setTimeout(() => {
                window.location.href = this.href;
            }, 300);
        });
    });
}

function initBackgroundMusic() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!musicToggle || !backgroundMusic) return;
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            this.innerHTML = '<i class="bi bi-music-note-beamed"></i> Включить музыку';
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-light');
        } else {
            backgroundMusic.play().catch(e => {
                console.log('Автовоспроизведение заблокировано:', e);
                showNotification('Нажмите еще раз для включения музыки', 'info');
            });
            this.innerHTML = '<i class="bi bi-pause-fill"></i> Выключить музыку';
            this.classList.remove('btn-outline-light');
            this.classList.add('btn-success');
        }
        isPlaying = !isPlaying;
    });
    
    backgroundMusic.addEventListener('error', function() {
        musicToggle.disabled = true;
        musicToggle.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Аудио недоступно';
        musicToggle.classList.add('btn-danger');
    });
}

function initTooltips() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title');
        if (title) {
            card.setAttribute('title', `Узнать больше о "${title.textContent}"`);
        }
        
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = '';
        });
        
        const buttons = card.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.animation = 'pulse 1s infinite';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.animation = '';
            });
        });
    });
}

function initFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showNotification('Форма успешно отправлена!', 'success');
                
                if (this.id === 'contactForm') {
                    generateConfirmation(this);
                }
                
                setTimeout(() => {
                    this.reset();
                    if (this.id === 'contactForm') {
                        window.location.href = 'form-success.html';
                    }
                }, 2000);
            }
        });
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .hero-section, h2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}


function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Валидация формы
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Валидация отдельного поля
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Очищаем предыдущие ошибки
    clearFieldError(field);
    
    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Проверка email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный email адрес';
        }
    }
    
    // Проверка телефона
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
        }
    }
    
    // Проверка минимальной длины
    if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
        isValid = false;
        errorMessage = `Минимальная длина: ${field.getAttribute('minlength')} символов`;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}

// Очистить ошибки поля
function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

// Генерация подтверждения формы
function generateConfirmation(form) {
    const formData = new FormData(form);
    const confirmationData = {};
    
    for (let [key, value] of formData.entries()) {
        confirmationData[key] = value;
    }
    
    // Сохраняем данные в localStorage для использования на странице подтверждения
    localStorage.setItem('formConfirmation', JSON.stringify(confirmationData));
    
    // Можно также отправить данные на сервер здесь
    console.log('Данные формы:', confirmationData);
}

// Обработчик для гипертекстовой ссылки (схема URL)
// Этот код выполняется при переходе по специальной ссылке
function processGalleryLink(imageId) {
    // Открываем информацию об изображении в новом окне
    const galleryWindow = window.open('', 'galleryInfo', 'width=600,height=400');
    galleryWindow.document.write(`
        <html>
            <head>
                <title>Информация об изображении</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="p-4">
                <h2>Подробная информация</h2>
                <p>ID изображения: ${imageId}</p>
                <p>Размер: 1920x1080px</p>
                <p>Формат: JPEG</p>
                <p>Художник: Неизвестен</p>
                <button onclick="window.close()" class="btn btn-primary">Закрыть</button>
            </body>
        </html>
    `);
    galleryWindow.document.close();
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .card {
        transition: all 0.3s ease;
    }
    
    .navbar-nav .nav-link {
        transition: all 0.2s ease;
    }
    
    .btn {
        transition: all 0.3s ease;
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);