
document.addEventListener('DOMContentLoaded', function() {
    initInteractiveGallery();
});

function initInteractiveGallery() {
    const galleryContainer = document.getElementById('interactiveGallery');
    if (!galleryContainer) return;
    
    const galleryItems = [
        {
            id: 1,
            title: "Абстрактная композиция",
            image: "https://via.placeholder.com/400x300/3498db/ffffff?text=Абстракция+1",
            description: "Современная абстрактная живопись, 2023",
            artist: "Мария Иванова",
            price: "150 000 руб."
        },
        {
            id: 2,
            title: "Городской пейзаж",
            image: "https://via.placeholder.com/400x300/e74c3c/ffffff?text=Город+1",
            description: "Урбанистический пейзаж в стиле поп-арт",
            artist: "Алексей Петров",
            price: "200 000 руб."
        },
        {
            id: 3,
            title: "Цифровая графика",
            image: "https://via.placeholder.com/400x300/2ecc71/ffffff?text=Цифра+1",
            description: "Генеративное искусство, созданное с помощью AI",
            artist: "AI Artist",
            price: "75 000 руб."
        },
        {
            id: 4,
            title: "Скульптура 'Форма'",
            image: "https://via.placeholder.com/400x300/f39c12/ffffff?text=Скульптура+1",
            description: "Бронзовая скульптура, ограниченная серия",
            artist: "Иван Сидоров",
            price: "450 000 руб."
        }
    ];
    
    // Заполняем галерею
    galleryItems.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        col.innerHTML = `
            <div class="card gallery-item h-100" data-id="${item.id}">
                <img src="${item.image}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <div class="gallery-actions">
                        <!-- Использование JavaScript через гипертекстовую ссылку -->
                        <a href="javascript:void(0)" onclick="showImageDetails(${item.id})" 
                           class="btn btn-sm btn-outline-primary me-2">
                            <i class="bi bi-info-circle"></i> Подробнее
                        </a>
                        <!-- Использование JavaScript через обработчик события -->
                        <button class="btn btn-sm btn-outline-success" 
                                onmouseover="showPreview(${item.id})" 
                                onmouseout="hidePreview()">
                            <i class="bi bi-eye"></i> Предпросмотр
                        </button>
                    </div>
                </div>
            </div>
        `;
        galleryContainer.appendChild(col);
    });
    
    addGalleryEventListeners();
}

function addGalleryEventListeners() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            const itemId = this.getAttribute('data-id');
            openImageModal(itemId);
        });
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(1deg)';
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
}

function showImageDetails(imageId) {
    const details = getImageDetails(imageId);
    if (details) {
        const modalHtml = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${details.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${details.image}" class="img-fluid mb-3" alt="${details.title}">
                            <p><strong>Художник:</strong> ${details.artist}</p>
                            <p><strong>Описание:</strong> ${details.description}</p>
                            <p><strong>Цена:</strong> ${details.price}</p>
                            <p><strong>Техника:</strong> ${details.technique || 'Смешанная техника'}</p>
                            <p><strong>Размер:</strong> ${details.size || '100x70 см'}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            <button type="button" class="btn btn-primary">Добавить в избранное</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('imageModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
}

function showPreview(imageId) {
    const details = getImageDetails(imageId);
    if (details) {
        const preview = document.createElement('div');
        preview.id = 'imagePreview';
        preview.className = 'position-fixed bg-white shadow-lg p-3 rounded';
        preview.style.cssText = `
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            max-width: 500px;
            display: none;
        `;
        preview.innerHTML = `
            <img src="${details.image}" class="img-fluid" alt="${details.title}">
            <div class="text-center mt-2">
                <h6>${details.title}</h6>
                <small class="text-muted">${details.artist}</small>
            </div>
        `;
        
        document.body.appendChild(preview);
        preview.style.display = 'block';
    }
}

function hidePreview() {
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.remove();
    }
}

function getImageDetails(imageId) {
    const galleryData = {
        1: {
            title: "Абстрактная композиция",
            image: "https://via.placeholder.com/600x400/3498db/ffffff?text=Абстракция+1",
            description: "Современная абстрактная живопись, созданная в 2023 году. Работа отражает внутренний мир художника через цвет и форму.",
            artist: "Мария Иванова",
            price: "150 000 руб.",
            technique: "Масло, холст",
            size: "120x80 см"
        },
        2: {
            title: "Городской пейзаж",
            image: "https://via.placeholder.com/600x400/e74c3c/ffffff?text=Город+1",
            description: "Урбанистический пейзаж в стиле поп-арт. Работа передает динамику современного мегаполиса.",
            artist: "Алексей Петров",
            price: "200 000 руб.",
            technique: "Акрил, холст",
            size: "100x70 см"
        },
        3: {
            title: "Цифровая графика",
            image: "https://via.placeholder.com/600x400/2ecc71/ffffff?text=Цифра+1",
            description: "Генеративное искусство, созданное с помощью искусственного интеллекта. Уникальная работа, существующая в единственном экземпляре.",
            artist: "AI Artist",
            price: "75 000 руб.",
            technique: "Цифровая печать",
            size: "80x60 см"
        },
        4: {
            title: "Скульптура 'Форма'",
            image: "https://via.placeholder.com/600x400/f39c12/ffffff?text=Скульптура+1",
            description: "Бронзовая скульптура из ограниченной серии. Работа исследует взаимодействие формы и пространства.",
            artist: "Иван Сидоров",
            price: "450 000 руб.",
            technique: "Бронза, литье",
            size: "50x30x20 см"
        }
    };
    
    return galleryData[imageId];
}

function openImageModal(imageId) {
    showImageDetails(imageId);
}