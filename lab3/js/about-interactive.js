
document.addEventListener('DOMContentLoaded', function() {
    initDepartmentMap();
    initVideoPlayer();
    initTimeline();
});

function initDepartmentMap() {
    const departmentMap = document.getElementById('departmentMap');
    if (!departmentMap) return;

    const departments = [
        {
            id: 'exhibition',
            name: 'Выставочный отдел',
            description: 'Организация временных и постоянных выставок',
            color: 'primary',
            icon: 'bi-palette'
        },
        {
            id: 'collection',
            name: 'Отдел хранения',
            description: 'Сохранение и учет музейных ценностей',
            color: 'success',
            icon: 'bi-archive'
        },
        {
            id: 'education',
            name: 'Образовательный отдел',
            description: 'Лекции, экскурсии, мастер-классы',
            color: 'warning',
            icon: 'bi-mortarboard'
        },
        {
            id: 'research',
            name: 'Научный отдел',
            description: 'Исследования в области современного искусства',
            color: 'info',
            icon: 'bi-search'
        }
    ];

    departments.forEach(dept => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
            <div class="card department-card h-100 border-${dept.color}" 
                 onclick="showDepartmentInfo('${dept.id}')"
                 onmouseover="highlightDepartment('${dept.id}')"
                 onmouseout="unhighlightDepartment('${dept.id}')">
                <div class="card-body text-center">
                    <i class="bi ${dept.icon} display-4 text-${dept.color} mb-3"></i>
                    <h5 class="card-title">${dept.name}</h5>
                    <p class="card-text">${dept.description}</p>
                    <small class="text-muted">Нажмите для подробностей</small>
                </div>
            </div>
        `;
        departmentMap.appendChild(col);
    });
}

function showDepartmentInfo(deptId) {
    const departmentInfo = {
        'exhibition': {
            title: 'Выставочный отдел',
            staff: '12 сотрудников',
            budget: '15 млн руб./год',
            projects: '20+ выставок ежегодно',
            contact: 'exhibition@artmuseum.ru'
        },
        'collection': {
            title: 'Отдел хранения',
            staff: '8 сотрудников',
            budget: '8 млн руб./год',
            projects: '2000+ экспонатов',
            contact: 'collection@artmuseum.ru'
        },
        'education': {
            title: 'Образовательный отдел',
            staff: '10 сотрудников',
            budget: '5 млн руб./год',
            projects: '100+ мероприятий',
            contact: 'education@artmuseum.ru'
        },
        'research': {
            title: 'Научный отдел',
            staff: '6 сотрудников',
            budget: '4 млн руб./год',
            projects: '15+ публикаций',
            contact: 'research@artmuseum.ru'
        }
    };

    const info = departmentInfo[deptId];
    if (info) {
        const modalHtml = `
            <div class="modal fade" id="departmentModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${info.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <strong><i class="bi bi-people"></i> Сотрудники:</strong>
                                    <p>${info.staff}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong><i class="bi bi-cash-coin"></i> Бюджет:</strong>
                                    <p>${info.budget}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong><i class="bi bi-kanban"></i> Проекты:</strong>
                                    <p>${info.projects}</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <strong><i class="bi bi-envelope"></i> Контакт:</strong>
                                    <p>${info.contact}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Удаляем существующее модальное окно
        const existingModal = document.getElementById('departmentModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('departmentModal'));
        modal.show();
    }
}

// Подсветка отдела при наведении
function highlightDepartment(deptId) {
    const card = document.querySelector(`[onclick="showDepartmentInfo('${deptId}')"]`);
    if (card) {
        card.style.transform = 'scale(1.05)';
        card.style.transition = 'transform 0.3s ease';
    }
}

function unhighlightDepartment(deptId) {
    const card = document.querySelector(`[onclick="showDepartmentInfo('${deptId}')"]`);
    if (card) {
        card.style.transform = '';
    }
}

// Инициализация видеоплеера
function initVideoPlayer() {
    const video = document.getElementById('museumVideo');
    if (!video) return;

    // Обновление времени воспроизведения
    video.addEventListener('timeupdate', function() {
        updateVideoTime();
    });

    // Обработка окончания видео
    video.addEventListener('ended', function() {
        showVideoCompletion();
    });
}

// Управление видео
function playVideo() {
    const video = document.getElementById('museumVideo');
    if (video) video.play();
}

function pauseVideo() {
    const video = document.getElementById('museumVideo');
    if (video) video.pause();
}

function muteVideo() {
    const video = document.getElementById('museumVideo');
    if (video) {
        video.muted = !video.muted;
        const button = document.querySelector('[onclick="muteVideo()"]');
        if (button) {
            button.innerHTML = video.muted ? 
                '<i class="bi bi-volume-mute-fill"></i>' : 
                '<i class="bi bi-volume-up-fill"></i>';
        }
    }
}

// Обновление времени видео
function updateVideoTime() {
    const video = document.getElementById('museumVideo');
    const timeDisplay = document.getElementById('videoTime');
    
    if (video && timeDisplay) {
        const currentTime = formatTime(video.currentTime);
        const duration = formatTime(video.duration);
        timeDisplay.textContent = `${currentTime} / ${duration}`;
    }
}

// Форматирование времени
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Показать сообщение об окончании видео
function showVideoCompletion() {
    const alertHtml = `
        <div class="alert alert-info alert-dismissible fade show mt-3">
            <i class="bi bi-info-circle"></i> 
            Хотите посмотреть другие видео о нашем музее?
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.insertAdjacentHTML('afterend', alertHtml);
    }
}

// Инициализация временной шкалы
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // Добавляем анимацию появления
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Показать детали временной шкалы
function showTimelineDetail(year) {
    const timelineDetails = {
        2005: {
            title: "Основание музея",
            description: "Музей современного искусства открыл свои двери для первых посетителей. Первая выставка представила работы 15 молодых художников.",
            image: "https://via.placeholder.com/400x200/3498db/ffffff?text=2005",
            achievements: ["Открытие первого выставочного зала", "Фонд: 50 произведений", "Первые 1000 посетителей"]
        },
        2010: {
            title: "Расширение коллекции",
            description: "Музей значительно пополнил свою коллекцию работами известных зарубежных художников и открыл новые выставочные пространства.",
            image: "https://via.placeholder.com/400x200/e74c3c/ffffff?text=2010",
            achievements: ["Коллекция: 500+ работ", "Международные выставки", "Открытие реставрационной мастерской"]
        },
        2015: {
            title: "Реконструкция",
            description: "Проведена масштабная реконструкция здания музея с созданием современных выставочных пространств и образовательного центра.",
            image: "https://via.placeholder.com/400x200/2ecc71/ffffff?text=2015",
            achievements: ["Увеличение площади в 2 раза", "Современное оборудование", "Доступная среда"]
        },
        2020: {
            title: "Цифровая трансформация",
            description: "Запущены виртуальные туры и онлайн-выставки, что позволило музею оставаться доступным в период пандемии.",
            image: "https://via.placeholder.com/400x200/f39c12/ffffff?text=2020",
            achievements: ["Виртуальные туры", "Онлайн-коллекция", "Цифровые образовательные программы"]
        }
    };

    const detail = timelineDetails[year];
    if (detail) {
        const modalHtml = `
            <div class="modal fade" id="timelineModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${year} - ${detail.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${detail.image}" class="img-fluid rounded mb-3" alt="${detail.title}">
                                </div>
                                <div class="col-md-6">
                                    <p>${detail.description}</p>
                                    <h6>Достижения:</h6>
                                    <ul>
                                        ${detail.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('timelineModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('timelineModal'));
        modal.show();
    }
}

// Показать информацию о сотруднике
function showTeamMember(memberId) {
    const teamMembers = {
        'anna': {
            name: 'Анна Петрова',
            position: 'Директор музея',
            education: 'МГУ, искусствоведение',
            experience: '15 лет в музейном деле',
            email: 'a.petrova@artmuseum.ru',
            phone: '+7 (495) 123-45-67 (вн. 101)',
            achievements: ['Основатель музея', 'Куратор 50+ выставок', 'Автор 20+ публикаций']
        },
        'ivan': {
            name: 'Иван Сидоров',
            position: 'Главный куратор',
            education: 'Санкт-Петербургский университет, культурология',
            experience: '12 лет',
            email: 'i.sidorov@artmuseum.ru',
            phone: '+7 (495) 123-45-67 (вн. 102)',
            achievements: ['Организатор международных выставок', 'Эксперт по современному искусству']
        },
        'maria': {
            name: 'Мария Козлова',
            position: 'Хранитель коллекции',
            education: 'РГГУ, музейное дело',
            experience: '10 лет',
            email: 'm.kozlova@artmuseum.ru',
            phone: '+7 (495) 123-45-67 (вн. 103)',
            achievements: ['Систематизация коллекции', 'Внедрение современных методов хранения']
        },
        'sergey': {
            name: 'Сергей Волков',
            position: 'Руководитель образовательных программ',
            education: 'МГПУ, педагогика',
            experience: '8 лет',
            email: 's.volkov@artmuseum.ru',
            phone: '+7 (495) 123-45-67 (вн. 104)',
            achievements: ['Разработка образовательных программ', 'Проведение 200+ мастер-классов']
        }
    };

    const member = teamMembers[memberId];
    if (member) {
        const modalHtml = `
            <div class="modal fade" id="teamModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${member.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Должность:</strong> ${member.position}</p>
                            <p><strong>Образование:</strong> ${member.education}</p>
                            <p><strong>Опыт работы:</strong> ${member.experience}</p>
                            <p><strong>Email:</strong> ${member.email}</p>
                            <p><strong>Телефон:</strong> ${member.phone}</p>
                            <h6>Достижения:</h6>
                            <ul>
                                ${member.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <a href="mailto:${member.email}" class="btn btn-primary">Написать</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('teamModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('teamModal'));
        modal.show();
    }
}

// Добавляем CSS для временной шкалы
const timelineStyles = `
    <style>
        .timeline {
            position: relative;
            padding-left: 2rem;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, #3498db, #2ecc71);
            border-radius: 2px;
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .timeline-item:hover {
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            transform: translateX(5px);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -2.5rem;
            top: 1.5rem;
            width: 1rem;
            height: 1rem;
            background: #3498db;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #3498db;
        }
        
        .timeline-year {
            font-weight: bold;
            color: #3498db;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .department-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .department-card:hover {
            transform: translateY(-5px);
        }
        
        .video-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', timelineStyles);