/**
 * Bablu Garments - Main JavaScript File
 */

// --- Data Structures (Mock Database for Future Admin Panel) ---
const newStock = [
    {
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop", // Replace with "assets/images/stock/boys/boys-1.jpg" when added
        title: "समर कलेक्शन टी-शर्ट्स",
        description: "आरामदायी कॉटन फॅब्रिक, आकर्षक डिझाईन्स.",
        category: "boys",
        categoryName: "मुलांचे कपडे",
        isNew: true
    },
    {
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop",
        title: "फ्लॉवर डिझाईन फ्रॉक",
        description: "सुंदर रंगांमध्ये उपलब्ध नवीन फ्रॉक्स.",
        category: "girls",
        categoryName: "मुलींचे कपडे",
        isNew: true
    },
    {
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
        title: "क्यूट कॉटन रोम्पर्स",
        description: "लहानग्यांच्या नाजूक त्वचेसाठी उत्तम.",
        category: "baby",
        categoryName: "बेबी वेअर",
        isNew: true
    },
    {
        image: "https://images.unsplash.com/photo-1604144365773-f935398d5a44?q=80&w=600&auto=format&fit=crop",
        title: "पारंपारिक डिझायनर सूट",
        description: "लग्नसराईसाठी खास डिझायनर कपडे.",
        category: "party",
        categoryName: "पार्टी वेअर",
        isNew: true
    },
    {
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop",
        title: "जीन्स आणि शर्ट सेट",
        description: "रोजच्या वापरासाठी स्टायलिश कलेक्शन.",
        category: "casual",
        categoryName: "कॅज्युअल वेअर",
        isNew: true
    },
    {
        image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=600&auto=format&fit=crop",
        title: "वेस्टर्न पार्टी गाऊन",
        description: "आकर्षक आणि ट्रेंडी वेस्टर्न गाऊन्स.",
        category: "girls",
        categoryName: "मुलींचे कपडे",
        isNew: true
    }
];

const shopImages = [
    {
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop", // Replace with "assets/images/shop/shop-front.jpg" when added
        title: "बबलू गारमेंट्स - दुकानाची बाहेरील झलक"
    },
    {
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop", // Replace with "assets/images/shop/shop-inside-1.jpg" when added
        title: "आमच्या दुकानाची आतील झलक"
    },
    {
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop",
        title: "सुंदर कपड्यांचे कलेक्शन"
    },
    {
        image: "https://images.unsplash.com/photo-1489987707023-afc827101036?q=80&w=800&auto=format&fit=crop",
        title: "मुलांसाठी नवीन व्हरायटी"
    },
    {
        image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop",
        title: "उत्तम दर्जाचे कपडे"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Render New Stock Grid ---
    const renderNewStock = () => {
        const stockContainer = document.getElementById('stock-grid');
        if (!stockContainer) return;

        stockContainer.innerHTML = '';
        
        newStock.forEach(item => {
            const card = document.createElement('div');
            card.className = `item-card filter-item`;
            card.setAttribute('data-category', item.category);
            
            card.innerHTML = `
                ${item.isNew ? '<span class="badge-new">NEW</span>' : ''}
                <div class="item-img-wrap">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-info">
                    <div class="item-cat">${item.categoryName}</div>
                    <h4 class="item-title">${item.title}</h4>
                    <p style="color: #666; font-size: 0.9rem;">${item.description}</p>
                </div>
            `;
            stockContainer.appendChild(card);
        });
    };

    // --- Render Shop Gallery Grid ---
    const renderShopGallery = () => {
        const galleryContainer = document.getElementById('shop-gallery-grid');
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';
        
        shopImages.forEach(item => {
            const mItem = document.createElement('div');
            mItem.className = 'masonry-item';
            
            mItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="masonry-overlay"><span>${item.title}</span></div>
            `;
            galleryContainer.appendChild(mItem);
        });
    };

    // --- Render Homepage Preview Grid (subset of new stock) ---
    const renderHomePreview = () => {
        const previewContainer = document.getElementById('home-stock-preview');
        if (!previewContainer) return;

        previewContainer.innerHTML = '';
        
        // Show max 4 items
        newStock.slice(0, 4).forEach(item => {
            const card = document.createElement('div');
            card.className = `item-card`;
            
            card.innerHTML = `
                ${item.isNew ? '<span class="badge-new">NEW</span>' : ''}
                <div class="item-img-wrap">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-info">
                    <div class="item-cat">${item.categoryName}</div>
                    <h4 class="item-title">${item.title}</h4>
                </div>
            `;
            previewContainer.appendChild(card);
        });
    };

    // Call renderers
    renderNewStock();
    renderShopGallery();
    renderHomePreview();

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const spans = hamburger.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Handle active state accurately, including shop-gallery.html
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    const initLightbox = (selector) => {
        const items = document.querySelectorAll(selector);
        if (items.length === 0) return;

        // Reset gallery for the page
        galleryImages = [];

        items.forEach((item, index) => {
            const img = item.querySelector('img');
            let captionText = '';
            
            // Try to find a title/caption based on context
            const titleEl = item.querySelector('.item-title') || item.querySelector('.masonry-overlay span');
            if(titleEl) captionText = titleEl.textContent;
            
            // Also append description if available in item info
            const descEl = item.querySelector('p');
            if(descEl && descEl.textContent) {
                captionText += " - " + descEl.textContent;
            }

            galleryImages.push({
                src: img.src,
                caption: captionText
            });

            item.addEventListener('click', (e) => {
                e.preventDefault();
                currentImageIndex = index;
                openLightbox();
            });
        });
    };

    const openLightbox = () => {
        if (!lightbox) return;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    const updateLightboxContent = () => {
        if(galleryImages.length === 0) return;
        const currentData = galleryImages[currentImageIndex];
        lightboxImg.src = currentData.src;
        lightboxCaption.textContent = currentData.caption;
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxContent();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxContent();
        });
    }

    // Call init for dynamic items (setTimeout ensures DOM is updated after render)
    setTimeout(() => {
        initLightbox('.item-card');
        initLightbox('.masonry-item');
    }, 100);

    // --- Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                const filterItems = document.querySelectorAll('.filter-item');

                filterItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.style.display = '';
                        setTimeout(() => item.style.opacity = '1', 50); 
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
                
                // Re-init lightbox so it only shows filtered items (optional enhancement)
                setTimeout(() => {
                    initLightbox('.filter-item[style*="display: block"], .filter-item:not([style*="display: none"])');
                }, 350);
            });
        });
    }

    // --- Reviews Functionality (LocalStorage) ---
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');

    const defaultReviews = [
        {
            name: 'अमोल पाटील',
            text: 'मुलांसाठी खूप छान कलेक्शन आहे. कपड्यांची क्वालिटी आणि डिझाईन दोन्ही आवडले.',
            date: '८ ऑगस्ट २०२६'
        },
        {
            name: 'स्नेहा कुलकर्णी',
            text: 'खूप सुंदर आणि आरामदायी कपडे! माझ्या मुलीला फ्रॉक्स खूप आवडले.',
            date: '५ ऑगस्ट २०२६'
        },
        {
            name: 'रोहित शर्मा',
            text: 'नवीन स्टॉक नेहमीच ट्रेंडी असतो. सर्विस पण उत्तम आहे.',
            date: '२ ऑगस्ट २०२६'
        }
    ];

    const loadReviews = () => {
        if (!reviewsContainer) return;
        
        let storedReviews = JSON.parse(localStorage.getItem('bablu_reviews'));
        
        if (!storedReviews || storedReviews.length === 0) {
            storedReviews = defaultReviews;
            localStorage.setItem('bablu_reviews', JSON.stringify(storedReviews));
        }

        reviewsContainer.innerHTML = '';
        storedReviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-icon">"</div>
                <p class="review-quote">${review.text}</p>
                <div class="review-author">${review.name}</div>
                <div class="review-date">${review.date}</div>
            `;
            reviewsContainer.appendChild(reviewCard);
        });
    };

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('review-name').value;
            const textInput = document.getElementById('review-text').value;
            
            if (!nameInput || !textInput) return;

            const today = new Date();
            const dateStr = today.toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' });

            const newReview = {
                name: nameInput,
                text: textInput,
                date: dateStr
            };

            let storedReviews = JSON.parse(localStorage.getItem('bablu_reviews')) || defaultReviews;
            storedReviews.unshift(newReview);
            
            localStorage.setItem('bablu_reviews', JSON.stringify(storedReviews));
            
            alert('धन्यवाद! तुमचा अभिप्राय यशस्वीरित्या पाठवला गेला आहे.');
            
            reviewForm.reset();
            loadReviews();
        });
    }
    
    loadReviews();

    // --- Notification Banner Logic ---
    const notifBanner = document.getElementById('notif-banner');
    const notifBadge = document.querySelector('.notification-badge');
    
    const checkNewStockNotification = () => {
        const isNewStockPage = window.location.pathname.includes('new-stock.html');
        let hasNotification = true; 
        
        if (hasNotification && notifBanner && isNewStockPage) {
            notifBanner.classList.add('active');
        }
        
        if (hasNotification && notifBadge) {
            notifBadge.style.display = 'block';
        }
    };

    checkNewStockNotification();
});

// --- Future Backend Placeholder Functions ---
window.getNewStock = async function() {
    console.log("Fetching new stock from database...");
    return newStock;
};

window.addNewStock = async function(data) {
    console.log("Admin: Adding new stock to database...", data);
};

window.subscribeToNotifications = async function(user) {
    console.log("Subscribing user to notifications...", user);
};
