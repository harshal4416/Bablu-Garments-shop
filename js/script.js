/**
 * ============================================
 * BABLU GARMENTS - MAIN JAVASCRIPT
 * ============================================
 */

/* ============================================
   SUPABASE CONFIGURATION
   ============================================ */

const SUPABASE_URL =
    "https://hevkxlppmhfqyeqpywkj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_bEblWNgn7vXCMgjJ2nJLCA_vdXVaeKt";

let supabaseClient = null;


/* ============================================
   INITIALIZE SUPABASE
   ============================================ */

function initializeSupabase() {

    if (
        window.supabase &&
        typeof window.supabase.createClient === "function"
    ) {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        console.log("✅ Supabase connected");

        return true;
    }

    console.error(
        "❌ Supabase library not loaded."
    );

    return false;
}

initializeSupabase();


/* ============================================
   CATEGORY NAMES
   ============================================ */

const categoryNames = {

    boys: "मुलांचे कपडे",

    girls: "मुलींचे कपडे",

    baby: "बेबी वेअर",

    party: "पार्टी वेअर",

    casual: "कॅज्युअल वेअर"

};


/* ============================================
   FALLBACK STOCK
   ============================================ */

const fallbackStock = [

    {
        image:
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop",

        name:
            "समर कलेक्शन टी-शर्ट्स",

        description:
            "आरामदायी कॉटन फॅब्रिक, आकर्षक डिझाईन्स.",

        category:
            "boys"
    },

    {
        image:
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop",

        name:
            "फ्लॉवर डिझाईन फ्रॉक",

        description:
            "सुंदर रंगांमध्ये उपलब्ध नवीन फ्रॉक्स.",

        category:
            "girls"
    },

    {
        image:
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",

        name:
            "क्यूट कॉटन रोम्पर्स",

        description:
            "लहानग्यांच्या नाजूक त्वचेसाठी उत्तम.",

        category:
            "baby"
    },

    {
        image:
            "https://images.unsplash.com/photo-1604144365773-f935398d5a44?q=80&w=600&auto=format&fit=crop",

        name:
            "पार्टी वेअर कलेक्शन",

        description:
            "लग्नसराईसाठी खास डिझायनर कपडे.",

        category:
            "party"
    }

];


/* ============================================
   SHOP GALLERY DATA
   ============================================ */

const shopImages = [

    {
        image:
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",

        title:
            "बबलू गारमेंट्स - दुकानाची बाहेरील झलक"
    },

    {
        image:
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",

        title:
            "आमच्या दुकानाची आतील झलक"
    },

    {
        image:
            "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop",

        title:
            "सुंदर कपड्यांचे कलेक्शन"
    },

    {
        image:
            "https://images.unsplash.com/photo-1489987707023-afc827101036?q=80&w=800&auto=format&fit=crop",

        title:
            "मुलांसाठी नवीन व्हरायटी"
    },

    {
        image:
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop",

        title:
            "उत्तम दर्जाचे कपडे"
    }

];


/* ============================================
   GET STOCK FROM SUPABASE
   ============================================ */

async function getNewStock() {

    if (!supabaseClient) {

        console.error(
            "❌ Supabase client unavailable"
        );

        return [];
    }

    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("stock")

            .select(
                "id,name,category,description,image_url,is_active,created_at"
            )

            .eq(
                "is_active",
                true
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "❌ Stock fetch error:",
                error
            );

            return [];
        }


        console.log(
            "✅ Live stock loaded:",
            data
        );


        return data || [];

    } catch (error) {

        console.error(
            "❌ Unexpected stock error:",
            error
        );

        return [];
    }
}


/* ============================================
   CREATE STOCK CARD
   ============================================ */

function createStockCard(item) {

    const card =
        document.createElement("div");


    card.className =
        "item-card filter-item";


    card.setAttribute(
        "data-category",
        item.category || ""
    );


    const categoryName =
        categoryNames[item.category] ||
        item.category ||
        "नवीन कलेक्शन";


    const image =
        item.image_url ||
        item.image ||
        "";


    const name =
        item.name ||
        item.title ||
        "नवीन स्टॉक";


    const description =
        item.description ||
        "बबलू गारमेंट्समधील नवीन कलेक्शन.";


    card.innerHTML = `

        <span class="badge-new">
            NEW
        </span>

        <div class="item-img-wrap">

            <img
                src="${image}"
                alt="${name}"
                loading="lazy"
            >

        </div>

        <div class="item-info">

            <div class="item-cat">
                ${categoryName}
            </div>

            <h4 class="item-title">
                ${name}
            </h4>

            <p style="
                color:#666;
                font-size:0.9rem;
                line-height:1.6;
            ">
                ${description}
            </p>

        </div>
    `;


    return card;
}


/* ============================================
   RENDER NEW STOCK PAGE
   ============================================ */

async function renderNewStock() {

    const stockContainer =
        document.getElementById(
            "stock-grid"
        );


    if (!stockContainer) {

        return;
    }


    stockContainer.innerHTML = `

        <div style="
            width:100%;
            text-align:center;
            padding:50px 20px;
            font-size:18px;
        ">
            नवीन स्टॉक लोड होत आहे...
        </div>

    `;


    const stock =
        await getNewStock();


    /*
       IMPORTANT:
       जर database मध्ये stock आहे,
       तर फक्त database stock दाखवायचा.
    */

    if (stock.length > 0) {

        console.log(
            "✅ Showing live Supabase stock"
        );

        stockContainer.innerHTML = "";


        stock.forEach(
            item => {

                const card =
                    createStockCard(item);

                stockContainer.appendChild(
                    card
                );

            }
        );


        initLightbox(
            ".item-card"
        );


        setupFiltering();

        return;
    }


    /*
       Database मध्ये stock नसेल
       तर fallback.
    */

    console.log(
        "ℹ️ No live stock found. Showing fallback."
    );


    stockContainer.innerHTML = "";


    fallbackStock.forEach(
        item => {

            const card =
                createStockCard(item);

            stockContainer.appendChild(
                card
            );

        }
    );


    initLightbox(
        ".item-card"
    );


    setupFiltering();
}


/* ============================================
   RENDER HOMEPAGE STOCK
   ============================================ */

async function renderHomePreview() {

    const container =
        document.getElementById(
            "home-stock-preview"
        );


    if (!container) {

        return;
    }


    container.innerHTML = `

        <div style="
            width:100%;
            text-align:center;
            padding:30px;
        ">
            नवीन स्टॉक लोड होत आहे...
        </div>

    `;


    const stock =
        await getNewStock();


    let displayStock;


    if (stock.length > 0) {

        console.log(
            "✅ Homepage showing live stock"
        );

        displayStock =
            stock.slice(0, 4);

    } else {

        console.log(
            "ℹ️ Homepage showing fallback stock"
        );

        displayStock =
            fallbackStock;
    }


    container.innerHTML = "";


    displayStock
        .slice(0, 4)
        .forEach(
            item => {

                const card =
                    createStockCard(item);

                container.appendChild(
                    card
                );

            }
        );
}


/* ============================================
   SHOP GALLERY
   ============================================ */

function renderShopGallery() {

    const container =
        document.getElementById(
            "shop-gallery-grid"
        );


    if (!container) {

        return;
    }


    container.innerHTML = "";


    shopImages.forEach(
        item => {

            const galleryItem =
                document.createElement(
                    "div"
                );


            galleryItem.className =
                "masonry-item";


            galleryItem.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.title}"
                    loading="lazy"
                >

                <div class="masonry-overlay">

                    <span>
                        ${item.title}
                    </span>

                </div>

            `;


            container.appendChild(
                galleryItem
            );

        }
    );


    initLightbox(
        ".masonry-item"
    );
}


/* ============================================
   LIGHTBOX
   ============================================ */

let galleryImages = [];

let currentImageIndex = 0;


function initLightbox(selector) {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const lightboxImg =
        document.getElementById(
            "lightbox-img"
        );


    const caption =
        document.getElementById(
            "lightbox-caption"
        );


    if (
        !lightbox ||
        !lightboxImg
    ) {

        return;
    }


    const items =
        document.querySelectorAll(
            selector
        );


    if (
        items.length === 0
    ) {

        return;
    }


    galleryImages = [];


    items.forEach(
        (item, index) => {

            const img =
                item.querySelector(
                    "img"
                );


            if (!img) {

                return;
            }


            const title =
                item.querySelector(
                    ".item-title"
                );


            const overlay =
                item.querySelector(
                    ".masonry-overlay span"
                );


            const itemCaption =
                title
                    ? title.textContent
                    : overlay
                        ? overlay.textContent
                        : "";


            galleryImages.push({

                src:
                    img.src,

                caption:
                    itemCaption.trim()

            });


            item.onclick =
                function(event) {

                    event.preventDefault();


                    currentImageIndex =
                        index;


                    openLightbox();

                };

        }
    );


    function openLightbox() {

        if (
            !galleryImages.length
        ) {

            return;
        }


        updateLightbox();


        lightbox.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";
    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "auto";
    }


    function updateLightbox() {

        const item =
            galleryImages[
                currentImageIndex
            ];


        if (!item) {

            return;
        }


        lightboxImg.src =
            item.src;


        if (caption) {

            caption.textContent =
                item.caption;

        }

    }


    const close =
        document.querySelector(
            ".lightbox-close"
        );


    const prev =
        document.querySelector(
            ".lightbox-prev"
        );


    const next =
        document.querySelector(
            ".lightbox-next"
        );


    if (close) {

        close.onclick =
            closeLightbox;

    }


    if (prev) {

        prev.onclick =
            function(event) {

                event.stopPropagation();


                currentImageIndex =
                    (
                        currentImageIndex -
                        1 +
                        galleryImages.length
                    ) %
                    galleryImages.length;


                updateLightbox();

            };

    }


    if (next) {

        next.onclick =
            function(event) {

                event.stopPropagation();


                currentImageIndex =
                    (
                        currentImageIndex +
                        1
                    ) %
                    galleryImages.length;


                updateLightbox();

            };

    }


    lightbox.onclick =
        function(event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        };


    document.onkeydown =
        function(event) {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                currentImageIndex =
                    (
                        currentImageIndex -
                        1 +
                        galleryImages.length
                    ) %
                    galleryImages.length;


                updateLightbox();

            }


            if (
                event.key === "ArrowRight"
            ) {

                currentImageIndex =
                    (
                        currentImageIndex +
                        1
                    ) %
                    galleryImages.length;


                updateLightbox();

            }

        };

}


/* ============================================
   FILTER STOCK
   ============================================ */

function setupFiltering() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    if (!buttons.length) {

        return;
    }


    buttons.forEach(
        button => {

            button.onclick =
                function() {

                    buttons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.getAttribute(
                            "data-filter"
                        );


                    const items =
                        document.querySelectorAll(
                            ".filter-item"
                        );


                    items.forEach(
                        item => {

                            const category =
                                item.getAttribute(
                                    "data-category"
                                );


                            if (
                                filter === "all" ||
                                filter === category
                            ) {

                                item.style.display =
                                    "";

                            } else {

                                item.style.display =
                                    "none";

                            }

                        }
                    );

                };

        }
    );
}


/* ============================================
   MOBILE MENU
   ============================================ */

function setupMobileMenu() {

    const hamburger =
        document.querySelector(
            ".hamburger"
        );


    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (
        !hamburger ||
        !navLinks
    ) {

        return;
    }


    hamburger.onclick =
        function() {

            navLinks.classList.toggle(
                "active"
            );


            const spans =
                hamburger.querySelectorAll(
                    "span"
                );


            if (
                navLinks.classList.contains(
                    "active"
                )
            ) {

                if (spans[0]) {

                    spans[0].style.transform =
                        "rotate(45deg) translate(5px, 5px)";

                }


                if (spans[1]) {

                    spans[1].style.opacity =
                        "0";

                }


                if (spans[2]) {

                    spans[2].style.transform =
                        "rotate(-45deg) translate(5px, -5px)";

                }

            } else {

                spans.forEach(
                    span => {

                        span.style.transform =
                            "none";

                        span.style.opacity =
                            "1";

                    }
                );

            }

        };
}


/* ============================================
   ACTIVE NAV LINK
   ============================================ */

function setupActiveNav() {

    const currentPath =
        window.location.pathname
            .split("/")
            .pop();


    const navItems =
        document.querySelectorAll(
            ".nav-links a"
        );


    navItems.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (
                href === currentPath ||
                (
                    currentPath === "" &&
                    href === "index.html"
                )
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );
}


/* ============================================
   NOTIFICATION
   ============================================ */

function setupNotification() {

    const banner =
        document.getElementById(
            "notif-banner"
        );


    const badge =
        document.querySelector(
            ".notification-badge"
        );


    const isStockPage =
        window.location.pathname.includes(
            "new-stock.html"
        );


    if (
        banner &&
        isStockPage
    ) {

        banner.classList.add(
            "active"
        );

    }


    if (badge) {

        badge.style.display =
            "block";

    }

}


/* ============================================
   INITIALIZE WEBSITE
   ============================================ */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "🚀 Bablu Garments website started"
        );


        setupMobileMenu();

        setupActiveNav();

        setupNotification();

        renderShopGallery();


        /*
           Important:
           Homepage par dono Supabase calls
           ek saath chal sakti hain.
        */

        await Promise.all([

            renderNewStock(),

            renderHomePreview()

        ]);


        console.log(
            "✅ Website initialization completed"
        );

    }
);


/* ============================================
   GLOBAL REFRESH FUNCTION
   ============================================ */

window.getNewStock =
    getNewStock;


window.refreshStock =
    async function() {

        await Promise.all([

            renderNewStock(),

            renderHomePreview()

        ]);

    };


console.log(
    "✅ script.js loaded successfully"
);