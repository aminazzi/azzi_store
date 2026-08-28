// ================================
// AZZI STORE - SUPABASE AUTH
// الجزء 1/5
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

    if (data.user && !data.session) {

        message.textContent =
            "✅ تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.";

    } else {

        message.textContent =
            "✅ تم إنشاء الحساب بنجاح!";

        setTimeout(() => {

            window.location.href =
                "../index.html";

        }, 1500);
    }
}
// ================================
// تسجيل الدخول
// الجزء 2/5
// ================================

async function loginUser(email, password) {

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

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
// الحصول على المستخدم الحالي
// ================================

async function getCurrentUser() {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "Get user error:",
            error
        );

        return null;
    }

    return user;
}
// ================================
// تسجيل الخروج
// الجزء 3/5
// ================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(
            "Logout error:",
            error
        );

        alert(
            "حدث خطأ أثناء تسجيل الخروج"
        );

        return;
    }

    window.location.href =
        "/azzi_store/pages/login.html";
}


// ================================
// تحديث زر الحساب
// ================================

async function updateAccountButton() {

    const button =
        document.getElementById(
            "account-btn"
        );

    if (!button) return;

    const user =
        await getCurrentUser();

    if (user) {

        button.innerHTML =
            '<span class="top-icon">👤</span>' +
            '<span class="top-label">حسابي</span>';

        button.title =
            "الحساب: " + user.email;

    } else {

        button.innerHTML =
            '<span class="top-icon">👤</span>' +
            '<span class="top-label">تسجيل الدخول</span>';

        button.title =
            "تسجيل الدخول";
    }
}
// ================================
// تشغيل التحقق عند فتح الصفحة
// الجزء 4/5
// ================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        await updateAccountButton();

    }
);


// ================================
// مراقبة حالة الحساب
// ================================

supabaseClient.auth.onAuthStateChange(
    function(event, session) {

        console.log(
            "حالة الحساب:",
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

        updateAccountButton();
    }
);
// ================================
// التحقق الإضافي من الجلسة
// الجزء 5/5
// ================================

async function checkLoginStatus() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Session error:",
            error
        );

        return null;
    }

    if (session) {

        console.log(
            "الجلسة موجودة:",
            session.user.email
        );

    } else {

        console.log(
            "لا توجد جلسة حالية"
        );
    }

    return session;
}


// ================================
// تشغيل فحص الجلسة
// ================================

checkLoginStatus();
