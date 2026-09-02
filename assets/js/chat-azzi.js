const CHAT_AZZI_URL =
    "https://swfiagrlqebsnvgshipu.supabase.co/functions/v1/chat-azzi";

const postContent =
    document.getElementById("postContent");

const publishBtn =
    document.getElementById("publishBtn");

const counter =
    document.getElementById("counter");

const postsContainer =
    document.getElementById("postsContainer");

let currentSort = "latest";


// ================================
// عداد الحروف
// ================================

postContent.addEventListener("input", () => {

    counter.textContent =
        `${postContent.value.length} / 500`;

});


// ================================
// الحصول على الجلسة
// ================================

async function getSession() {

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return null;
    }

    return data.session;
}
// ================================
// إنشاء ملف Chat AZZI للمستخدم
// ================================

async function ensureChatProfile(user) {

    if (!user) return;

    const email =
        user.email || "user";

    const base =
        email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20) || "user";

    const username =
        `${base}_${user.id.slice(0, 6)}`;

    const { error } =
        await supabaseClient
            .from("chat_azzi_profiles")
            .upsert(
                {
                    id: user.id,
                    username: username,
                    display_name: base
                },
                {
                    onConflict: "id"
                }
            );

    if (error) {
        console.error(
            "Chat profile error:",
            error
        );
    }
}


// ================================
// إرسال طلب إلى Function
// ================================

async function chatRequest(
    method,
    action,
    body = null
) {

    const session =
        await getSession();

    const headers = {
        "Content-Type":
            "application/json"
    };

    if (session?.access_token) {

        headers.Authorization =
            `Bearer ${session.access_token}`;

    }
const options = {
        method,
        headers
    };

    if (body) {
        options.body =
            JSON.stringify(body);
    }

    const response =
        await fetch(
            `${CHAT_AZZI_URL}?action=${encodeURIComponent(action)}`,
            options
        );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "حدث خطأ"
        );
    }

    return data;
}


// ================================
// تحميل المنشورات
// ================================

async function loadPosts() {

    postsContainer.innerHTML =
        `<div class="loading">
            جاري تحميل المنشورات...
        </div>`;

    try {

        const data =
            await chatRequest(
                "GET",
                "posts"
            );

        let posts =
            data.posts || [];

        if (currentSort === "popular") {

            posts.sort(
                (a, b) =>
                    (b.likes_count || 0) -
                    (a.likes_count || 0)
            );

        }

        renderPosts(posts);

    } catch (error) {

        console.error(error);

        postsContainer.innerHTML =
            `<div class="empty">
                تعذر تحميل المنشورات
            </div>`;
    }
}
// ================================
// عرض المنشورات
// ================================

function renderPosts(posts) {

    if (!posts.length) {

        postsContainer.innerHTML =
            `<div class="empty">
                لا توجد منشورات حتى الآن.
                كن أول من ينشر! ✦
            </div>`;

        return;
    }

    postsContainer.innerHTML =
        posts.map(createPostHTML).join("");

}


// ================================
// إنشاء HTML للمنشور
// ================================

function createPostHTML(post) {

    const profile =
        post.chat_azzi_profiles || {};

    const name =
        profile.display_name ||
        profile.username ||
        "مستخدم AZZI";

    const username =
        profile.username ||
        "user";

    const initial =
        name.charAt(0).toUpperCase();

    const content =
        escapeHTML(post.content);

    const time =
        formatTime(post.created_at);

    return `
        <article
            class="chat-post"
            data-post-id="${post.id}"
        >

            <div class="post-user">

                <div class="post-avatar">
                    ${escapeHTML(initial)}
                </div>

                <div>
                    <div class="post-name">
                        ${escapeHTML(name)}
                    </div>

                    <span class="post-time">
@${escapeHTML(username)}
                        · ${time}
                    </span>
                </div>

            </div>

            <div class="post-content">
                ${content}
            </div>

            <div class="post-actions">

                <button
                    onclick="likePost('${post.id}')"
                >
                    ♡ ${post.likes_count || 0}
                </button>

                <button
                    onclick="toggleComments('${post.id}')"
                >
                    💬 تعليق
                </button>

                <button
                    onclick="sharePost('${post.id}')"
                >
                    ↗ مشاركة
                </button>

            </div>

            <div
                id="comments-${post.id}"
                class="comment-box"
            >

                <textarea
                    id="comment-input-${post.id}"
                    maxlength="500"
                    placeholder="اكتب تعليقًا..."
                ></textarea>

                <button
                    onclick="sendComment('${post.id}')"
                >
                    إرسال
                </button>

                <div
                    id="comments-list-${post.id}"
class="comments"
                ></div>

            </div>

        </article>
    `;
}


// ================================
// نشر
// ================================

publishBtn.addEventListener(
    "click",
    async () => {

        const content =
            postContent.value.trim();

        if (!content) {

            alert("اكتب منشورًا أولاً");
            return;
        }

        if (content.length > 500) {

            alert(
                "المنشور يجب ألا يتجاوز 500 حرف"
            );

            return;
        }

        publishBtn.disabled = true;

        try {

            const session =
                await getSession();

            if (!session) {

                alert(
                    "يجب تسجيل الدخول أولاً"
                );

                return;
            }

            await ensureChatProfile(
                session.user
            );

            await chatRequest(
                "POST",
                "post",
                {
                    content
                }
            );

            postContent.value = "";

            counter.textContent =
                "0 / 500";

            await loadPosts();

        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "تعذر نشر المنشور"
            );

        } finally {

            publishBtn.disabled = false;

        }
    }
);
// ================================
// إعجاب
// ================================

async function likePost(postId) {

    try {

        const session =
            await getSession();

        if (!session) {

            alert(
                "سجل الدخول للإعجاب"
            );

            return;
        }

        await chatRequest(
            "POST",
            "like",
            {
                post_id: postId
            }
        );

        await loadPosts();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "تعذر تنفيذ الإعجاب"
        );
    }
}


// ================================
// التعليقات
// ================================

async function toggleComments(postId) {

    const box =
        document.getElementById(
            `comments-${postId}`
        );

    if (!box) return;

    if (
        box.style.display === "block"
    ) {

        box.style.display = "none";
        return;
    }

    box.style.display = "block";

    await loadComments(postId);
}
async function loadComments(postId) {

    const list =
        document.getElementById(
            `comments-list-${postId}`
        );

    if (!list) return;

    list.innerHTML =
        "جاري تحميل التعليقات...";

    try {

        const data =
            await chatRequest(
                "GET",
                "comments"
            );

        const comments =
            data.comments || [];

        const postComments =
            comments.filter(
                comment =>
                    comment.post_id === postId
            );

        if (!postComments.length) {

            list.innerHTML =
                `<div class="comment">
                    لا توجد تعليقات بعد.
                </div>`;

            return;
        }

        list.innerHTML =
            postComments
                .map(comment => {

                    const profile =
                        comment.chat_azzi_profiles ||
                        {};

                    const name =
                        profile.display_name ||
                        profile.username ||
                        "مستخدم";

                    return `
                        <div class="comment">
<strong>
                                ${escapeHTML(name)}
                            </strong>
                            <br>
                            ${escapeHTML(
                                comment.content
                            )}
                        </div>
                    `;

                })
                .join("");

    } catch (error) {

        console.error(error);

        list.innerHTML =
            "تعذر تحميل التعليقات";
    }
}


// ================================
// إرسال تعليق
// ================================

async function sendComment(postId) {

    const input =
        document.getElementById(
            `comment-input-${postId}`
        );

    if (!input) return;

    const content =
        input.value.trim();

    if (!content) return;

    try {

        const session =
            await getSession();

        if (!session) {

            alert(
                "يجب تسجيل الدخول أولاً"
            );

            return;
        }

        await ensureChatProfile(
            session.user
        );

        await chatRequest(
            "POST",
            "comment",
            {
                post_id: postId,
                content
            }
        );

        input.value = "";

        await loadComments(postId);

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "تعذر إرسال التعليق"
        );
    }
}
// ================================
// مشاركة
// ================================

async function sharePost(postId) {

    const url =
        `${window.location.origin}${window.location.pathname}#post-${postId}`;

    try {

        if (navigator.share) {

            await navigator.share({
                title: "Chat AZZI",
                text: "شاهد هذا المنشور في Chat AZZI",
                url
            });

        } else {

            await navigator.clipboard.writeText(url);

            alert(
                "تم نسخ رابط المنشور"
            );
        }

    } catch (error) {

        console.log(error);
    }
}


// ================================
// التبويبات
// ================================

document
    .querySelectorAll(".chat-tabs button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".chat-tabs button"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );
button.classList.add(
                    "active"
                );

                currentSort =
                    button.dataset.sort;

                loadPosts();

            }
        );

    });


// ================================
// حماية HTML
// ================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ================================
// الوقت
// ================================

function formatTime(date) {

    const d =
        new Date(date);

    const now =
        new Date();

    const seconds =
        Math.floor(
            (now - d) / 1000
        );

    if (seconds < 60)
        return "الآن";

    if (seconds < 3600)
        return `منذ ${Math.floor(seconds / 60)} د`;

    if (seconds < 86400)
        return `منذ ${Math.floor(seconds / 3600)} س`;

    if (seconds < 604800)
        return `منذ ${Math.floor(seconds / 86400)} ي`;

    return d.toLocaleDateString("ar");
}
// ================================
// التشغيل
// ================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const session =
            await getSession();

        if (session) {

            await ensureChatProfile(
                session.user
            );
        }

        await loadPosts();

    }
);
