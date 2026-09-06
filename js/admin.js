import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ==========================================
// SUPABASE CONFIG
// ==========================================

const SUPABASE_URL =
    "https://hevkxlppmhfqyeqpywkj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_bEblWNgn7vXCMgjJ2nJLCA_vdXVaeKt";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// ELEMENTS
// ==========================================

const loginSection =
    document.getElementById("loginSection");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// STOCK ELEMENTS
// ==========================================

const stockForm =
    document.getElementById("stockForm");

const stockName =
    document.getElementById("stockName");

const stockCategory =
    document.getElementById("stockCategory");

const stockDescription =
    document.getElementById("stockDescription");

const stockImage =
    document.getElementById("stockImage");

const imagePreview =
    document.getElementById("imagePreview");

const previewImage =
    document.getElementById("previewImage");

const publishBtn =
    document.getElementById("publishBtn");

const stockMessage =
    document.getElementById("stockMessage");

const stockList =
    document.getElementById("stockList");


// ==========================================
// GALLERY ELEMENTS
// ==========================================

const galleryForm =
    document.getElementById("galleryForm");

const galleryTitle =
    document.getElementById("galleryTitle");

const galleryImage =
    document.getElementById("galleryImage");

const galleryImagePreview =
    document.getElementById("galleryImagePreview");

const galleryPreviewImage =
    document.getElementById("galleryPreviewImage");

const galleryPublishBtn =
    document.getElementById("galleryPublishBtn");

const galleryMessage =
    document.getElementById("galleryMessage");

const galleryList =
    document.getElementById("galleryList");


// ==========================================
// REVIEW ELEMENTS
// ==========================================

const reviewsList =
    document.getElementById("reviewsList");

const reviewMessage =
    document.getElementById("reviewMessage");


// ==========================================
// CATEGORY NAMES
// ==========================================

const categoryNames = {

    boys: "मुलांचे कपडे",

    girls: "मुलींचे कपडे",

    baby: "बेबी वेअर",

    party: "पार्टी वेअर",

    casual: "कॅज्युअल वेअर"

};


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {

    if (loginSection) {

        loginSection.style.display =
            "block";

    }

    if (dashboard) {

        dashboard.style.display =
            "none";

    }

}


// ==========================================
// SHOW DASHBOARD
// ==========================================

function showDashboard() {

    if (loginSection) {

        loginSection.style.display =
            "none";

    }

    if (dashboard) {

        dashboard.style.display =
            "block";

    }

}


// ==========================================
// COMPRESS IMAGE
// ==========================================

async function compressImage(file) {

    return new Promise((resolve, reject) => {

        const img =
            new Image();

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");

        const objectURL =
            URL.createObjectURL(file);


        img.onload = () => {

            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;

            let width =
                img.width;

            let height =
                img.height;


            if (
                width > MAX_WIDTH ||
                height > MAX_HEIGHT
            ) {

                const ratio =
                    Math.min(
                        MAX_WIDTH / width,
                        MAX_HEIGHT / height
                    );


                width =
                    Math.round(
                        width * ratio
                    );

                height =
                    Math.round(
                        height * ratio
                    );

            }


            canvas.width =
                width;

            canvas.height =
                height;


            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            canvas.toBlob(
                (blob) => {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    if (!blob) {

                        reject(
                            new Error(
                                "Image compression failed."
                            )
                        );

                        return;

                    }


                    const compressedFile =
                        new File(
                            [blob],
                            `image-${Date.now()}.jpg`,
                            {
                                type: "image/jpeg",
                                lastModified: Date.now()
                            }
                        );


                    resolve(
                        compressedFile
                    );

                },
                "image/jpeg",
                0.82
            );

        };


        img.onerror = () => {

            URL.revokeObjectURL(
                objectURL
            );


            reject(
                new Error(
                    "Unable to read image."
                )
            );

        };


        img.src =
            objectURL;

    });

}


// ==========================================
// CHECK ADMIN
// ==========================================

async function checkAdmin() {

    try {

        const {
            data: {
                user
            }
        } =
            await supabase.auth.getUser();


        if (!user) {

            showLogin();

            return;

        }


        const {
            data,
            error
        } =
            await supabase
                .from("admins")
                .select("user_id")
                .eq(
                    "user_id",
                    user.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Admin check error:",
                error
            );

            showLogin();

            return;

        }


        if (!data) {

            await supabase.auth.signOut();

            showLogin();

            if (loginMessage) {

                loginMessage.textContent =
                    "You are not authorized as an admin.";

            }

            return;

        }


        showDashboard();


        await Promise.all([
            loadStock(),
            loadGallery(),
            loadReviews()
        ]);

    } catch (error) {

        console.error(
            "Check admin error:",
            error
        );

        showLogin();

    }

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            if (loginMessage) {

                loginMessage.textContent =
                    "Logging in...";

            }


            const {
                error
            } =
                await supabase.auth.signInWithPassword({

                    email,

                    password

                });


            if (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        error.message;

                }

                return;

            }


            if (loginMessage) {

                loginMessage.textContent =
                    "";

            }


            await checkAdmin();

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await supabase.auth.signOut();

            showLogin();


            if (loginForm) {

                loginForm.reset();

            }

        }
    );

}


// ==========================================
// STOCK IMAGE PREVIEW
// ==========================================

if (stockImage) {

    stockImage.addEventListener(
        "change",
        () => {

            const file =
                stockImage.files[0];


            if (!file) {

                if (imagePreview) {

                    imagePreview.style.display =
                        "none";

                }

                return;

            }


            const imageURL =
                URL.createObjectURL(file);


            if (previewImage) {

                previewImage.src =
                    imageURL;

            }


            if (imagePreview) {

                imagePreview.style.display =
                    "block";

            }

        }
    );

}


// ==========================================
// GALLERY IMAGE PREVIEW
// ==========================================

if (galleryImage) {

    galleryImage.addEventListener(
        "change",
        () => {

            const file =
                galleryImage.files[0];


            if (!file) {

                if (galleryImagePreview) {

                    galleryImagePreview.style.display =
                        "none";

                }

                return;

            }


            const imageURL =
                URL.createObjectURL(file);


            if (galleryPreviewImage) {

                galleryPreviewImage.src =
                    imageURL;

            }


            if (galleryImagePreview) {

                galleryImagePreview.style.display =
                    "block";

            }

        }
    );

}


// ==========================================
// ADD NEW STOCK
// ==========================================

if (stockForm) {

    stockForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const originalFile =
                stockImage.files[0];


            if (!originalFile) {

                stockMessage.textContent =
                    "Please select an image.";

                return;

            }


            if (
                originalFile.size >
                15 * 1024 * 1024
            ) {

                stockMessage.textContent =
                    "Image size must be less than 15 MB.";

                return;

            }


            publishBtn.disabled =
                true;


            try {

                const {
                    data: {
                        user
                    }
                } =
                    await supabase.auth.getUser();


                if (!user) {

                    throw new Error(
                        "Please login again."
                    );

                }


                const {
                    data: adminData,
                    error: adminError
                } =
                    await supabase
                        .from("admins")
                        .select("user_id")
                        .eq(
                            "user_id",
                            user.id
                        )
                        .maybeSingle();


                if (
                    adminError ||
                    !adminData
                ) {

                    throw new Error(
                        "Admin access denied."
                    );

                }


                stockMessage.textContent =
                    "Optimizing image...";


                const file =
                    await compressImage(
                        originalFile
                    );


                const fileName =
                    `${Date.now()}-${crypto.randomUUID()}.jpg`;


                const filePath =
                    `stock/${fileName}`;


                stockMessage.textContent =
                    "Uploading image...";


                const {
                    error: uploadError
                } =
                    await supabase.storage
                        .from("stock-images")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl:
                                    "31536000",

                                contentType:
                                    "image/jpeg",

                                upsert:
                                    false
                            }
                        );


                if (uploadError) {

                    throw uploadError;

                }


                const {
                    data: publicURLData
                } =
                    supabase.storage
                        .from("stock-images")
                        .getPublicUrl(
                            filePath
                        );


                const imageURL =
                    publicURLData.publicUrl;


                stockMessage.textContent =
                    "Saving stock...";


                const {
                    error: insertError
                } =
                    await supabase
                        .from("stock")
                        .insert({

                            name:
                                stockName.value.trim(),

                            category:
                                stockCategory.value,

                            description:
                                stockDescription.value.trim(),

                            image_url:
                                imageURL,

                            is_active:
                                true

                        });


                if (insertError) {

                    await supabase.storage
                        .from("stock-images")
                        .remove([
                            filePath
                        ]);

                    throw insertError;

                }


                stockMessage.textContent =
                    "✅ Stock published successfully!";


                stockForm.reset();


                if (imagePreview) {

                    imagePreview.style.display =
                        "none";

                }


                if (previewImage) {

                    previewImage.src =
                        "";

                }


                await loadStock();

            } catch (error) {

                console.error(
                    "Add stock error:",
                    error
                );


                stockMessage.textContent =
                    "❌ " +
                    (
                        error.message ||
                        "Something went wrong."
                    );

            } finally {

                publishBtn.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// LOAD STOCK
// ==========================================

async function loadStock() {

    if (!stockList) {

        return;

    }


    stockList.innerHTML =
        `
        <div class="empty-message">
            Loading stock...
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabase
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

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            stockList.innerHTML =
                `
                <div class="empty-message">
                    No stock added yet.
                </div>
                `;

            return;

        }


        stockList.innerHTML =
            "";


        data.forEach(
            (item) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "stock-item";


                const categoryName =
                    categoryNames[
                        item.category
                    ] ||
                    item.category ||
                    "Other";


                card.innerHTML =
                    `
                    <img
                        src="${escapeHTML(item.image_url)}"
                        alt="${escapeHTML(item.name)}"
                        loading="lazy"
                    >

                    <div class="stock-item-info">

                        <div class="stock-category">
                            ${escapeHTML(categoryName)}
                        </div>

                        <h3>
                            ${escapeHTML(item.name)}
                        </h3>

                        <p class="stock-description">
                            ${escapeHTML(
                                item.description || ""
                            )}
                        </p>

                        <button
                            class="admin-btn delete-btn"
                        >
                            Delete
                        </button>

                    </div>
                    `;


                stockList.appendChild(
                    card
                );


                const deleteButton =
                    card.querySelector(
                        ".delete-btn"
                    );


                deleteButton.addEventListener(
                    "click",
                    async () => {

                        await deleteStock(
                            item.id,
                            item.image_url
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Load stock error:",
            error
        );


        stockList.innerHTML =
            `
            <div class="empty-message">
                Unable to load stock.
            </div>
            `;

    }

}


// ==========================================
// DELETE STOCK
// ==========================================

async function deleteStock(
    id,
    imageURL
) {

    if (
        !confirm(
            "Are you sure you want to delete this stock?"
        )
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabase
                .from("stock")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        if (imageURL) {

            const marker =
                "/storage/v1/object/public/stock-images/";


            if (
                imageURL.includes(marker)
            ) {

                const path =
                    imageURL.split(marker)[1];


                if (path) {

                    await supabase.storage
                        .from("stock-images")
                        .remove([
                            path
                        ]);

                }

            }

        }


        alert(
            "Stock deleted successfully."
        );


        await loadStock();

    } catch (error) {

        console.error(
            "Delete stock error:",
            error
        );


        alert(
            "Unable to delete stock: " +
            error.message
        );

    }

}


// ==========================================
// GALLERY IMAGE PREVIEW
// ==========================================

if (galleryImage) {

    galleryImage.addEventListener(
        "change",
        () => {

            const file =
                galleryImage.files[0];


            if (!file) {

                return;

            }


            if (
                !file.type.startsWith("image/")
            ) {

                galleryMessage.textContent =
                    "Please select an image.";

                galleryImage.value =
                    "";

                return;

            }

        }
    );

}


// ==========================================
// ADD GALLERY IMAGE
// ==========================================

if (galleryForm) {

    galleryForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const originalFile =
                galleryImage.files[0];


            const title =
                galleryTitle.value.trim();


            if (!originalFile) {

                galleryMessage.textContent =
                    "Please select a gallery image.";

                return;

            }


            if (!title) {

                galleryMessage.textContent =
                    "Please enter image title.";

                return;

            }


            if (
                originalFile.size >
                15 * 1024 * 1024
            ) {

                galleryMessage.textContent =
                    "Image size must be less than 15 MB.";

                return;

            }


            galleryPublishBtn.disabled =
                true;


            try {

                const {
                    data: {
                        user
                    }
                } =
                    await supabase.auth.getUser();


                if (!user) {

                    throw new Error(
                        "Please login again."
                    );

                }


                const {
                    data: adminData,
                    error: adminError
                } =
                    await supabase
                        .from("admins")
                        .select("user_id")
                        .eq(
                            "user_id",
                            user.id
                        )
                        .maybeSingle();


                if (
                    adminError ||
                    !adminData
                ) {

                    throw new Error(
                        "Admin access denied."
                    );

                }


                galleryMessage.textContent =
                    "Optimizing image...";


                const file =
                    await compressImage(
                        originalFile
                    );


                const fileName =
                    `${Date.now()}-${crypto.randomUUID()}.jpg`;


                const filePath =
                    `gallery/${fileName}`;


                galleryMessage.textContent =
                    "Uploading gallery image...";


                const {
                    error: uploadError
                } =
                    await supabase.storage
                        .from("gallery-images")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl:
                                    "31536000",

                                contentType:
                                    "image/jpeg",

                                upsert:
                                    false
                            }
                        );


                if (uploadError) {

                    throw uploadError;

                }


                const {
                    data: publicURLData
                } =
                    supabase.storage
                        .from("gallery-images")
                        .getPublicUrl(
                            filePath
                        );


                const imageURL =
                    publicURLData.publicUrl;


                galleryMessage.textContent =
                    "Saving gallery image...";


                const {
                    error: insertError
                } =
                    await supabase
                        .from("gallery")
                        .insert({

                            title:
                                title,

                            image_url:
                                imageURL,

                            is_active:
                                true

                        });


                if (insertError) {

                    await supabase.storage
                        .from("gallery-images")
                        .remove([
                            filePath
                        ]);

                    throw insertError;

                }


                galleryMessage.textContent =
                    "✅ Gallery image uploaded successfully!";


                galleryForm.reset();


                if (galleryImagePreview) {

                    galleryImagePreview.style.display =
                        "none";

                }


                if (galleryPreviewImage) {

                    galleryPreviewImage.src =
                        "";

                }


                await loadGallery();

            } catch (error) {

                console.error(
                    "Gallery upload error:",
                    error
                );


                galleryMessage.textContent =
                    "❌ " +
                    (
                        error.message ||
                        "Gallery upload failed."
                    );

            } finally {

                galleryPublishBtn.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// LOAD GALLERY
// ==========================================

async function loadGallery() {

    if (!galleryList) {

        return;

    }


    galleryList.innerHTML =
        `
        <div class="empty-message">
            Loading gallery...
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabase
                .from("gallery")
                .select(
                    "id,title,image_url,is_active,created_at"
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

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            galleryList.innerHTML =
                `
                <div class="empty-message">
                    No gallery images added yet.
                </div>
                `;

            return;

        }


        galleryList.innerHTML =
            "";


        data.forEach(
            (item) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "gallery-item";


                card.innerHTML =
                    `
                    <img
                        src="${escapeHTML(item.image_url)}"
                        alt="${escapeHTML(item.title)}"
                        loading="lazy"
                    >

                    <div class="gallery-item-info">

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        <button
                            class="admin-btn gallery-delete-btn"
                        >
                            Delete Image
                        </button>

                    </div>
                    `;


                galleryList.appendChild(
                    card
                );


                const deleteButton =
                    card.querySelector(
                        ".gallery-delete-btn"
                    );


                deleteButton.addEventListener(
                    "click",
                    async () => {

                        await deleteGalleryImage(
                            item.id,
                            item.image_url
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Load gallery error:",
            error
        );


        galleryList.innerHTML =
            `
            <div class="empty-message">
                Unable to load gallery.
            </div>
            `;

    }

}


// ==========================================
// DELETE GALLERY IMAGE
// ==========================================

async function deleteGalleryImage(
    id,
    imageURL
) {

    if (
        !confirm(
            "Are you sure you want to delete this gallery image?"
        )
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabase
                .from("gallery")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        if (imageURL) {

            const marker =
                "/storage/v1/object/public/gallery-images/";


            if (
                imageURL.includes(marker)
            ) {

                const path =
                    imageURL.split(marker)[1];


                if (path) {

                    await supabase.storage
                        .from("gallery-images")
                        .remove([
                            path
                        ]);

                }

            }

        }


        alert(
            "Gallery image deleted successfully."
        );


        await loadGallery();

    } catch (error) {

        console.error(
            "Delete gallery error:",
            error
        );


        alert(
            "Unable to delete gallery image: " +
            error.message
        );

    }

}


// ==================================================
// CUSTOMER REVIEWS - LOAD
// ==================================================

async function loadReviews() {

    if (!reviewsList) {

        return;

    }


    reviewsList.innerHTML =
        `
        <div class="empty-message">
            Loading reviews...
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabase
                .from("reviews")
                .select(
                    "id,name,email,feedback,notify_stock,approved,created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            reviewsList.innerHTML =
                `
                <div class="empty-message">
                    No customer reviews yet.
                </div>
                `;

            return;

        }


        reviewsList.innerHTML =
            "";


        data.forEach(
            (review) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "review-item";


                const safeName =
                    escapeHTML(
                        review.name ||
                        "Customer"
                    );


                const safeEmail =
                    escapeHTML(
                        review.email ||
                        ""
                    );


                const safeFeedback =
                    escapeHTML(
                        review.feedback ||
                        ""
                    );


                let dateText =
                    "";


                if (
                    review.created_at
                ) {

                    const date =
                        new Date(
                            review.created_at
                        );


                    dateText =
                        date.toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        );

                }


                const statusHTML =
                    review.approved

                        ? `
                            <span class="review-status status-approved">
                                APPROVED
                            </span>
                        `

                        : `
                            <span class="review-status status-pending">
                                PENDING
                            </span>
                        `;


                const approveButton =
                    review.approved

                        ? `
                            <button
                                class="admin-btn approve-btn review-toggle-btn"
                                data-id="${review.id}"
                                data-action="unapprove"
                            >
                                ↩️ Unapprove
                            </button>
                        `

                        : `
                            <button
                                class="admin-btn approve-btn review-toggle-btn"
                                data-id="${review.id}"
                                data-action="approve"
                            >
                                ✅ Approve
                            </button>
                        `;


                card.innerHTML =
                    `
                    <div class="review-item-info">

                        <div class="review-header">

                            <div>

                                <div class="review-name">
                                    ${safeName}
                                </div>

                                <div class="review-email">
                                    ${safeEmail}
                                </div>

                            </div>

                            ${statusHTML}

                        </div>


                        <div class="review-stars">
                            ⭐⭐⭐⭐⭐
                        </div>


                        <div class="review-feedback">
                            ${safeFeedback}
                        </div>


                        <div class="review-date">
                            ${dateText}
                        </div>


                        <div
                            class="review-actions"
                            style="
                                margin-top:15px;
                            "
                        >

                            ${approveButton}

                            <button
                                class="admin-btn delete-btn review-delete-btn"
                                data-id="${review.id}"
                            >
                                🗑️ Delete
                            </button>

                        </div>

                    </div>
                    `;


                reviewsList.appendChild(
                    card
                );

            }
        );


        // ======================================
        // APPROVE / UNAPPROVE
        // ======================================

        reviewsList
            .querySelectorAll(
                ".review-toggle-btn"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const id =
                                button.dataset.id;

                            const action =
                                button.dataset.action;


                            if (
                                action === "approve"
                            ) {

                                await updateReviewApproval(
                                    id,
                                    true
                                );

                            } else {

                                await updateReviewApproval(
                                    id,
                                    false
                                );

                            }

                        }
                    );

                }
            );


        // ======================================
        // DELETE
        // ======================================

        reviewsList
            .querySelectorAll(
                ".review-delete-btn"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            await deleteReview(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "Load reviews error:",
            error
        );


        reviewsList.innerHTML =
            `
            <div class="empty-message">
                Unable to load reviews.
            </div>
            `;

    }

}


// ==================================================
// APPROVE / UNAPPROVE REVIEW
// ==================================================

async function updateReviewApproval(
    id,
    approved
) {

    try {

        if (reviewMessage) {

            reviewMessage.textContent =
                approved
                    ? "Approving review..."
                    : "Removing approval...";

        }


        const {
            error
        } =
            await supabase
                .from("reviews")
                .update({
                    approved: approved
                })
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        if (reviewMessage) {

            reviewMessage.textContent =
                approved
                    ? "✅ Review approved successfully."
                    : "✅ Review moved back to pending.";

        }


        await loadReviews();


    } catch (error) {

        console.error(
            "Review approval error:",
            error
        );


        if (reviewMessage) {

            reviewMessage.textContent =
                "❌ " +
                (
                    error.message ||
                    "Unable to update review."
                );

        }

    }

}


// ==================================================
// DELETE REVIEW
// ==================================================

async function deleteReview(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this review?"
        );


    if (!confirmed) {

        return;

    }


    try {

        if (reviewMessage) {

            reviewMessage.textContent =
                "Deleting review...";

        }


        const {
            error
        } =
            await supabase
                .from("reviews")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (error) {

            throw error;

        }


        if (reviewMessage) {

            reviewMessage.textContent =
                "✅ Review deleted successfully.";

        }


        await loadReviews();


    } catch (error) {

        console.error(
            "Delete review error:",
            error
        );


        if (reviewMessage) {

            reviewMessage.textContent =
                "❌ " +
                (
                    error.message ||
                    "Unable to delete review."
                );

        }

    }

}


// ==================================================
// AUTH STATE
// ==================================================

supabase.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );

    }
);


// ==================================================
// START
// ==================================================

console.log(
    "✅ Bablu Garments admin.js loaded"
);


checkAdmin();