// ================================
// AZZI STORE - SUPABASE AUTH
// ================================

const SUPABASE_URL =
    "https://swfiagrlqebsnvgshipu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_fh06o6KzVQdmcIpXBntySg_qI-70v4E";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
// ================================
// إنشاء حساب جديد
// ================================

async function registerUser(email, password) {

    const { data, error } =
        await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

    if (error) {
        throw error;
    }

    const message =
        document.getElementById("auth-message");

    if (data.user && !data.session) {

        message.textContent =
            "✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.";

    } else {

        message.textContent =
            "✅ تم إنشاء الحساب بنجاح!";

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1500);
    }
}
// ================================
// تسجيل الدخول
// ================================

async function loginUser(email, password) {

    const { data, error } =
        await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo:
            "https://aminazzi.github.io/azzi_store/pages/login.html"
    }
});

    if (error) {
        throw error;
    }

    const message =
        document.getElementById("auth-message");

    message.textContent =
        "✅ تم تسجيل الدخول بنجاح!";

    setTimeout(() => {

        window.location.href =
            "../index.html";

    }, 1000);
}
// ================================
// مراقبة حالة تسجيل الدخول
// ================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth event:",
            event
        );

        if (session) {

            console.log(
                "المستخدم مسجل الدخول:",
                session.user.email
            );

        } else {

            console.log(
                "لا يوجد مستخدم مسجل الدخول"
            );

        }
    }
);


// ================================
// الحصول على المستخدم الحالي
// ================================

async function getCurrentUser() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    return user;
}
// ================================
// تسجيل الخروج
// ================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return;
    }

    window.location.href =
        "pages/login.html";
}

// ================================
// تحديث زر الحساب
// ================================

async function updateAccountButton() {

    const button =
        document.getElementById("account-btn");

    if (!button) return;

    const user =
        await getCurrentUser();

    if (user) {

        button.textContent = "👤";

        button.title =
            "حسابي: " + user.email;

    } else {

        button.textContent = "👤";

        button.title =
            "تسجيل الدخول";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    updateAccountButton
);
