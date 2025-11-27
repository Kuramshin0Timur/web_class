
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            charCount.textContent = remaining;
            
            if (remaining < 0) {
                charCount.classList.add('text-danger');
            } else {
                charCount.classList.remove('text-danger');
            }
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spinner"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showFormSuccess();
                contactForm.reset();
                resetCharCount();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
    
    contactForm.addEventListener('reset', function() {
        resetCharCount();
        clearFormValidation();
    });
    
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    const emailField = document.getElementById('email');
    if (emailField.value && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'Введите корректный email адрес');
        isValid = false;
    }
    
    const messageField = document.getElementById('message');
    if (messageField.value.length < 10) {
        showFieldError(messageField, 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    }
    
    if (messageField.value.length > 500) {
        showFieldError(messageField, 'Сообщение не должно превышать 500 символов');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    clearFieldError(field);
    
    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getFieldErrorMessage(field, 'required');
    }
    
    // Проверка email
    if (field.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = getFieldErrorMessage(field, 'email');
    }
    
    // Проверка телефона
    if (field.type === 'tel' && value && !validatePhone(value)) {
        isValid = false;
        errorMessage = getFieldErrorMessage(field, 'phone');
    }
    
    // Проверка минимальной длины
    if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = getFieldErrorMessage(field, 'minlength');
    }
    
    // Проверка выпадающего списка
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getFieldErrorMessage(field, 'required');
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function getFieldErrorMessage(field, errorType) {
    const fieldName = field.previousElementSibling?.textContent || 'Это поле';
    
    switch (errorType) {
        case 'required':
            return `${fieldName} обязательно для заполнения`;
        case 'email':
            return 'Введите корректный email адрес';
        case 'phone':
            return 'Введите корректный номер телефона';
        case 'minlength':
            const minLength = field.getAttribute('minlength');
            return `Минимальная длина: ${minLength} символов`;
        default:
            return 'Неверное значение';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function formatPhoneNumber(phone) {
    // Удаляем все нецифровые символы, кроме +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Простое форматирование для российских номеров
    if (cleaned.startsWith('+7') || cleaned.startsWith('7') || cleaned.startsWith('8')) {
        if (cleaned.startsWith('+7')) cleaned = cleaned.substring(2);
        else if (cleaned.startsWith('7')) cleaned = cleaned.substring(1);
        else if (cleaned.startsWith('8')) cleaned = cleaned.substring(1);
        
        // Форматируем как +7 (XXX) XXX-XX-XX
        if (cleaned.length <= 3) {
            return '+7 (' + cleaned;
        } else if (cleaned.length <= 6) {
            return '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3);
        } else if (cleaned.length <= 8) {
            return '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
        } else {
            return '+7 (' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6, 8) + '-' + cleaned.substring(8, 10);
        }
    }
    
    return phone;
}

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
    errorDiv.style.display = 'block';
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function clearFormValidation() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        clearFieldError(field);
    });
}

function resetCharCount() {
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '500';
        charCount.classList.remove('text-danger');
    }
}

function showFormSuccess() {
    // Создаем красивый алерт успеха
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show';
    successAlert.innerHTML = `
        <h4 class="alert-heading"><i class="bi bi-check-circle-fill"></i> Успешно!</h4>
        <p>Ваше сообщение было успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <hr>
        <p class="mb-0">Хотите <a href="events.html" class="alert-link">посмотреть наши мероприятия</a>?</p>
    `;
    
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successAlert, form);
    
    // Автоматически скрываем через 10 секунд
    setTimeout(() => {
        if (successAlert.parentNode) {
            successAlert.remove();
        }
    }, 10000);
}

// Добавляем CSS для спиннера
const style = document.createElement('style');
style.textContent = `
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .is-valid {
        border-color: #198754 !important;
    }
    
    .is-invalid {
        border-color: #dc3545 !important;
    }
`;
document.head.appendChild(style);