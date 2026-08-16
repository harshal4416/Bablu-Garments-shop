import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

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

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

// STOCK
const stockForm = document.getElementById("stockForm");
const stockName = document.getElementById("stockName");
const stockCategory = document.getElementById("stockCategory");
const stockDescription = document.getElementById("stockDescription");
const stockImage = document.getElementById("stockImage");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const publishBtn = document.getElementById("publishBtn");
const stockMessage = document.getElementById("stockMessage");
const stockList = document.getElementById("stockList");

// GALLERY
const galleryForm = document.getElementById("galleryForm");
const galleryTitle = document.getElementById("galleryTitle");
const galleryImage = document.getElementById("galleryImage");
const galleryImagePreview = document.getElementById("galleryImagePreview");
const galleryPreviewImage = document.getElementById("galleryPreviewImage");
const galleryPublishBtn = document.getElementById("galleryPublishBtn");
const galleryMessage = document.getElementById("galleryMessage");
const galleryList = document.getElementById("galleryList");

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
// SHOW LOGIN
// ==========================================

function showLogin() {

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (dashboard) {
        dashboard.style.display = "none";
    }
}

// ==========================================
// SHOW DASHBOARD
// ==========================================

function showDashboard() {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (dashboard) {
        dashboard.style.display = "block";
    }
}

// ==========================================
// COMPRESS IMAGE
// ==========================================

async function compressImage(file) {

    return new Promise((resolve, reject) => {

        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const objectURL = URL.createObjectURL(file);

        img.onload = () => {

            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;

            let width = img.width;
            let height = img.height;

            if (
                width > MAX_WIDTH ||
                height > MAX_HEIGHT
            ) {

                const ratio = Math.min(
                    MAX_WIDTH / width,
                    MAX_HEIGHT / height
                );

                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );

            canvas.toBlob(
                (blob) => {

                    URL.revokeObjectURL(objectURL);

                    if (!blob) {

                        reject(
                            new Error(
                                "Image compression failed."
                            )
                        );

                        return;
                    }

                    const compressedFile = new File(
                        [blob],
                        `image-${Date.now()}.jpg`,
                        {
                            type: "image/jpeg",
                            lastModified: Date.now()
                        }
                    );

                    resolve(compressedFile);
                },
                "image/jpeg",
                0.82
            );
        };

        img.onerror = () => {

            URL.revokeObjectURL(objectURL);

            reject(
                new Error(
                    "Unable to read image."
                )
            );
        };

        img.src = objectURL;
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
        } = await supabase.auth.getUser();

        if (!user) {

            showLogin();
            return;
        }

        const {
            data,
            error
        } = await supabase
            .from("admins")
            .select("user_id")
            .eq("user_id", user.id)
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

        await loadStock();
        await loadGallery();

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
                document.getElementById("email")
                    .value
                    .trim();

            const password =
                document.getElementById("password")
                    .value;

            if (loginMessage) {

                loginMessage.textContent =
                    "Logging in...";
            }

            const {
                error
            } = await supabase.auth.signInWithPassword({

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
                loginMessage.textContent = "";
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
// IMAGE PREVIEW - STOCK
// ==========================================

if (stockImage) {

    stockImage.addEventListener(
        "change",
        () => {

            const file =
                stockImage.files[0];

            if (!file) {

                if (imagePreview) {
                    imagePreview.style.display = "none";
                }

                return;
            }

            const imageURL =
                URL.createObjectURL(file);

            if (previewImage) {
                previewImage.src = imageURL;
            }

            if (imagePreview) {
                imagePreview.style.display = "block";
            }
        }
    );
}

// ==========================================
// IMAGE PREVIEW - GALLERY
// ==========================================

if (galleryImage) {

    galleryImage.addEventListener(
        "change",
        () => {

            const file =
                galleryImage.files[0];

            if (!file) {

                if (galleryImagePreview) {
                    galleryImagePreview.style.display = "none";
                }

                return;
            }

            const imageURL =
                URL.createObjectURL(file);

            if (galleryPreviewImage) {
                galleryPreviewImage.src = imageURL;
            }

            if (galleryImagePreview) {
                galleryImagePreview.style.display = "block";
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

            publishBtn.disabled = true;

            try {

                const {
                    data: {
                        user
                    }
                } = await supabase.auth.getUser();

                if (!user) {
                    throw new Error(
                        "Please login again."
                    );
                }

                const {
                    data: adminData,
                    error: adminError
                } = await supabase
                    .from("admins")
                    .select("user_id")
                    .eq("user_id", user.id)
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
                } = await supabase.storage
                    .from("stock-images")
                    .upload(
                        filePath,
                        file,
                        {
                            cacheControl: "31536000",
                            contentType: "image/jpeg",
                            upsert: false
                        }
                    );

                if (uploadError) {
                    throw uploadError;
                }

                const {
                    data: publicURLData
                } = supabase.storage
                    .from("stock-images")
                    .getPublicUrl(filePath);

                const imageURL =
                    publicURLData.publicUrl;

                stockMessage.textContent =
                    "Saving stock...";

                const {
                    error: insertError
                } = await supabase
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
                        .remove([filePath]);

                    throw insertError;
                }

                stockMessage.textContent =
                    "✅ Stock published successfully!";

                stockForm.reset();

                if (imagePreview) {
                    imagePreview.style.display = "none";
                }

                if (previewImage) {
                    previewImage.src = "";
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

                publishBtn.disabled = false;
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

    stockList.innerHTML = `
        <div class="empty-message">
            Loading stock...
        </div>
    `;

    try {

        const {
            data,
            error
        } = await supabase
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

            stockList.innerHTML = `
                <div class="empty-message">
                    No stock added yet.
                </div>
            `;

            return;
        }

        stockList.innerHTML = "";

        data.forEach(
            (item) => {

                const card =
                    document.createElement("div");

                card.className =
                    "stock-item";

                const categoryName =
                    categoryNames[item.category] ||
                    item.category ||
                    "Other";

                card.innerHTML = `
                    <img
                        src="${item.image_url}"
                        alt="${item.name}"
                        loading="lazy"
                    >

                    <div class="stock-item-info">

                        <div class="stock-category">
                            ${categoryName}
                        </div>

                        <h3>
                            ${item.name}
                        </h3>

                        <p class="stock-description">
                            ${item.description || ""}
                        </p>

                        <button
                            class="admin-btn delete-btn"
                            data-id="${item.id}"
                            data-image="${item.image_url}"
                        >
                            Delete
                        </button>

                    </div>
                `;

                stockList.appendChild(card);
            }
        );

        stockList
            .querySelectorAll(".delete-btn")
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            await deleteStock(
                                button.dataset.id,
                                button.dataset.image
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

        stockList.innerHTML = `
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
        } = await supabase
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
                        .remove([path]);
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

// ==================================================
// GALLERY - UPLOAD
// ==================================================

if (galleryForm) {

    galleryForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const originalFile =
                galleryImage.files[0];

            if (!originalFile) {

                galleryMessage.textContent =
                    "Please select a gallery image.";

                return;
            }

            if (!galleryTitle.value.trim()) {

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

            galleryPublishBtn.disabled = true;

            try {

                // ----------------------------------
                // CHECK LOGIN
                // ----------------------------------

                const {
                    data: {
                        user
                    }
                } = await supabase.auth.getUser();

                if (!user) {

                    throw new Error(
                        "Please login again."
                    );
                }

                // ----------------------------------
                // CHECK ADMIN
                // ----------------------------------

                const {
                    data: adminData,
                    error: adminError
                } = await supabase
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

                // ----------------------------------
                // COMPRESS
                // ----------------------------------

                galleryMessage.textContent =
                    "Optimizing image...";

                const file =
                    await compressImage(
                        originalFile
                    );

                // ----------------------------------
                // UNIQUE FILE NAME
                // ----------------------------------

                const fileName =
                    `${Date.now()}-${crypto.randomUUID()}.jpg`;

                const filePath =
                    `gallery/${fileName}`;

                // ----------------------------------
                // UPLOAD
                // ----------------------------------

                galleryMessage.textContent =
                    "Uploading gallery image...";

                const {
                    error: uploadError
                } = await supabase.storage
                    .from("gallery-images")
                    .upload(
                        filePath,
                        file,
                        {
                            cacheControl: "31536000",
                            contentType: "image/jpeg",
                            upsert: false
                        }
                    );

                if (uploadError) {
                    throw uploadError;
                }

                // ----------------------------------
                // PUBLIC URL
                // ----------------------------------

                const {
                    data: publicURLData
                } = supabase.storage
                    .from("gallery-images")
                    .getPublicUrl(filePath);

                const imageURL =
                    publicURLData.publicUrl;

                // ----------------------------------
                // DATABASE
                // ----------------------------------

                galleryMessage.textContent =
                    "Saving gallery image...";

                const {
                    error: insertError
                } = await supabase
                    .from("gallery")
                    .insert({

                        title:
                            galleryTitle.value.trim(),

                        image_url:
                            imageURL,

                        is_active:
                            true

                    });

                // ----------------------------------
                // DELETE IMAGE IF DB FAILS
                // ----------------------------------

                if (insertError) {

                    await supabase.storage
                        .from("gallery-images")
                        .remove([
                            filePath
                        ]);

                    throw insertError;
                }

                // ----------------------------------
                // SUCCESS
                // ----------------------------------

                galleryMessage.textContent =
                    "✅ Gallery image uploaded successfully!";

                galleryForm.reset();

                if (galleryImagePreview) {
                    galleryImagePreview.style.display =
                        "none";
                }

                if (galleryPreviewImage) {
                    galleryPreviewImage.src = "";
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

                galleryPublishBtn.disabled = false;
            }
        }
    );
}

// ==================================================
// LOAD GALLERY
// ==================================================

async function loadGallery() {

    if (!galleryList) {
        return;
    }

    galleryList.innerHTML = `
        <div class="empty-message">
            Loading gallery...
        </div>
    `;

    try {

        const {
            data,
            error
        } = await supabase
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

            galleryList.innerHTML = `
                <div class="empty-message">
                    No gallery images added yet.
                </div>
            `;

            return;
        }

        galleryList.innerHTML = "";

        data.forEach(
            (item) => {

                const card =
                    document.createElement("div");

                card.className =
                    "gallery-item";

                card.innerHTML = `
                    <img
                        src="${item.image_url}"
                        alt="${item.title}"
                        loading="lazy"
                    >

                    <div class="gallery-item-info">

                        <h3>
                            ${item.title}
                        </h3>

                        <button
                            class="admin-btn gallery-delete-btn"
                            data-id="${item.id}"
                            data-image="${item.image_url}"
                        >
                            Delete Image
                        </button>

                    </div>
                `;

                galleryList.appendChild(card);
            }
        );

        galleryList
            .querySelectorAll(".gallery-delete-btn")
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            await deleteGalleryImage(
                                button.dataset.id,
                                button.dataset.image
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

        galleryList.innerHTML = `
            <div class="empty-message">
                Unable to load gallery.
            </div>
        `;
    }
}

// ==================================================
// DELETE GALLERY IMAGE
// ==================================================

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

        // DELETE DATABASE RECORD

        const {
            error
        } = await supabase
            .from("gallery")
            .delete()
            .eq(
                "id",
                id
            );

        if (error) {
            throw error;
        }

        // DELETE STORAGE IMAGE

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