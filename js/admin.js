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
// IMAGE COMPRESSION
// ==========================================

async function compressImage(file) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");


        img.onload = () => {

            const MAX_WIDTH = 1000;
            const MAX_HEIGHT = 1000;

            let width = img.width;
            let height = img.height;


            // Resize image
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


            canvas.width = width;
            canvas.height = height;


            // Draw resized image
            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );


            // Convert to JPEG
            canvas.toBlob(
                (blob) => {

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
                            [
                                blob
                            ],
                            "stock-" +
                                Date.now() +
                                ".jpg",
                            {
                                type:
                                    "image/jpeg",

                                lastModified:
                                    Date.now()
                            }
                        );


                    console.log(
                        "Original image:",
                        (
                            file.size /
                            1024 /
                            1024
                        ).toFixed(2),
                        "MB"
                    );


                    console.log(
                        "Compressed image:",
                        (
                            compressedFile.size /
                            1024 /
                            1024
                        ).toFixed(2),
                        "MB"
                    );


                    resolve(
                        compressedFile
                    );

                },
                "image/jpeg",
                0.80
            );


            URL.revokeObjectURL(
                img.src
            );
        };


        img.onerror = () => {

            reject(
                new Error(
                    "Unable to read image."
                )
            );

        };


        img.src =
            URL.createObjectURL(file);

    });
}


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

                    email: email,

                    password: password

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
// IMAGE PREVIEW
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


            // Show selected image immediately
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
// ADD NEW STOCK
// ==========================================

if (stockForm) {

    stockForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const originalFile =
                stockImage.files[0];


            // --------------------------------------
            // CHECK IMAGE
            // --------------------------------------

            if (!originalFile) {

                if (stockMessage) {

                    stockMessage.textContent =
                        "Please select an image.";

                }

                return;
            }


            // --------------------------------------
            // CHECK ORIGINAL FILE SIZE
            // --------------------------------------

            if (
                originalFile.size >
                15 * 1024 * 1024
            ) {

                if (stockMessage) {

                    stockMessage.textContent =
                        "Image size must be less than 15 MB.";

                }

                return;
            }


            // --------------------------------------
            // CHECK STOCK NAME
            // --------------------------------------

            if (
                !stockName.value.trim()
            ) {

                if (stockMessage) {

                    stockMessage.textContent =
                        "Please enter stock name.";

                }

                return;
            }


            // --------------------------------------
            // CHECK CATEGORY
            // --------------------------------------

            if (
                !stockCategory.value
            ) {

                if (stockMessage) {

                    stockMessage.textContent =
                        "Please select a category.";

                }

                return;
            }


            // --------------------------------------
            // DISABLE BUTTON
            // --------------------------------------

            publishBtn.disabled =
                true;


            try {

                // --------------------------------------
                // CHECK LOGIN
                // --------------------------------------

                if (stockMessage) {

                    stockMessage.textContent =
                        "Checking admin access...";

                }


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


                // --------------------------------------
                // CHECK ADMIN
                // --------------------------------------

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


                // --------------------------------------
                // COMPRESS IMAGE
                // --------------------------------------

                if (stockMessage) {

                    stockMessage.textContent =
                        "Optimizing image...";

                }


                const file =
                    await compressImage(
                        originalFile
                    );


                // --------------------------------------
                // CREATE UNIQUE FILE NAME
                // --------------------------------------

                const fileName =
                    `${Date.now()}-${crypto.randomUUID()}.jpg`;


                const filePath =
                    `stock/${fileName}`;


                // --------------------------------------
                // UPLOAD IMAGE
                // --------------------------------------

                if (stockMessage) {

                    stockMessage.textContent =
                        "Uploading image...";

                }


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


                // --------------------------------------
                // GET PUBLIC URL
                // --------------------------------------

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


                // --------------------------------------
                // SAVE STOCK IN DATABASE
                // --------------------------------------

                if (stockMessage) {

                    stockMessage.textContent =
                        "Saving stock...";

                }


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


                // --------------------------------------
                // IF DATABASE INSERT FAILS
                // DELETE IMAGE
                // --------------------------------------

                if (insertError) {

                    await supabase.storage
                        .from("stock-images")
                        .remove([
                            filePath
                        ]);

                    throw insertError;

                }


                // --------------------------------------
                // SUCCESS
                // --------------------------------------

                if (stockMessage) {

                    stockMessage.textContent =
                        "✅ Stock published successfully!";

                }


                // Reset form
                stockForm.reset();


                if (imagePreview) {

                    imagePreview.style.display =
                        "none";

                }


                if (previewImage) {

                    previewImage.src = "";

                }


                // Reload stock list
                await loadStock();


            } catch (error) {

                console.error(
                    "Add stock error:",
                    error
                );


                if (stockMessage) {

                    stockMessage.textContent =
                        "❌ " +
                        (
                            error.message ||
                            "Something went wrong."
                        );

                }

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

            return;
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


        stockList.innerHTML = "";


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
                        src="${item.image_url}"
                        alt="${item.name}"
                        loading="lazy"
                        decoding="async"
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


                stockList.appendChild(
                    card
                );

            }
        );


        // --------------------------------------
        // DELETE BUTTONS
        // --------------------------------------

        const deleteButtons =
            stockList.querySelectorAll(
                ".delete-btn"
            );


        deleteButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;

                        const imageURL =
                            button.dataset.image;


                        await deleteStock(
                            id,
                            imageURL
                        );

                    }
                );

            }
        );


    } catch (error) {

        console.error(
            "Load stock exception:",
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

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this stock?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        // --------------------------------------
        // DELETE DATABASE RECORD
        // --------------------------------------

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


        // --------------------------------------
        // DELETE IMAGE
        // --------------------------------------

        if (imageURL) {

            try {

                const bucketPart =
                    "/storage/v1/object/public/stock-images/";


                if (
                    imageURL.includes(
                        bucketPart
                    )
                ) {

                    const path =
                        imageURL.split(
                            bucketPart
                        )[1];


                    if (path) {

                        await supabase.storage
                            .from(
                                "stock-images"
                            )
                            .remove([
                                path
                            ]);

                    }

                }

            } catch (
                imageDeleteError
            ) {

                console.warn(
                    "Image delete warning:",
                    imageDeleteError
                );

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
            (
                error.message ||
                "Something went wrong."
            )
        );

    }

}


// ==========================================
// AUTH STATE CHANGE
// ==========================================

supabase.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );

    }
);


// ==========================================
// INITIAL CHECK
// ==========================================

console.log(
    "✅ Bablu Garments admin.js loaded"
);


checkAdmin();