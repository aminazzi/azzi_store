const postContent = document.getElementById("postContent");
const publishBtn = document.getElementById("publishBtn");
const counter = document.getElementById("counter");
const postsContainer = document.getElementById("postsContainer");
let currentSort = "latest";
// ================================
// عداد الحروف
// ================================
postContent.addEventListener("input", () => {
    counter.textContent = `${postContent.value.length} / 500`;
});


// ================================
// الحصول على الجلسة
// ================================

async function getSession() {
    const { data, error } = await supabaseClient.auth.getSession();

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
    const email = user.email || "user";

    const base = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";

    const username = `${base}_${user.id.slice(0, 6)}`;

    const { error } = await supabaseClient
        .from("chat_azzi_profiles")
        .upsert(
            {
                id: user.id,
                username: username,
                display_name: base
            },
            { onConflict: "id" }
        );

    if (error) {
        console.error("Chat profile error:", error);
    }
}
// ================================
// تحميل المنشورات (يشوفها الجميع)
// ================================
async function loadPosts() {
    postsContainer.innerHTML = `<div class="loading">جاري تحميل المنشورات...</div>`;
    try {
        let query = supabaseClient
            .from("chat_azzi_posts")
            .select("*, chat_azzi_profiles(username, display_name)");
        if (currentSort === "popular") {
            query = query.order("likes_count", { ascending: false });
        } else {
            query = query.order("created_at", { ascending: false });
        }
        const { data: posts, error } = await query;
        if (error) throw error;
        // نجيب أعجابات المستخدم الحالي عشان نلوّن زر ♡ إذا أعجب فعلاً
        const session = await getSession();
        let likedIds = new Set();

        if (session) {
            const { data: myLikes } = await supabaseClient
                .from("chat_azzi_likes")
                .select("post_id")
                .eq("user_id", session.user.id);

            likedIds = new Set((myLikes || []).map(l => l.post_id));
        }

        renderPosts(posts || [], likedIds);

    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = `<div class="empty">تعذر تحميل المنشورات</div>`;
    }
}
// ================================
// عرض المنشورات
// ================================
function renderPosts(posts, likedIds) {
    if (!posts.length) {
        postsContainer.innerHTML = `<div class="empty">
            لا توجد منشورات حتى الآن.
            كن أول من ينشر! ✦
        </div>`;
        return;
    }
    postsContainer.innerHTML = posts
        .map(post => createPostHTML(post, likedIds.has(post.id)))
        .join("");
}
// ================================
// إنشاء HTML للمنشور
// ================================
function createPostHTML(post, liked) {
    const profile = post.chat_azzi_profiles || {};
    const name = profile.display_name || profile.username || "مستخدم AZZI";
    const username = profile.username || "user";
    const initial = name.charAt(0).toUpperCase();
    const content = escapeHTML(post.content);
    const time = formatTime(post.created_at);

    return `
        <article class="chat-post" data-post-id="${post.id}">

            <div class="post-user">
                <div class="post-avatar">${escapeHTML(initial)}</div>
                <div>
                    <div class="post-name">${escapeHTML(name)}</div>
                    <span class="post-time">
                        @${escapeHTML(username)} · ${time}
                    </span>
                </div>
            </div>

            <div class="post-content">${content}</div>

            <div class="post-actions">
                <button onclick="likePost('${post.id}')">
${liked ? "♥" : "♡"} ${post.likes_count || 0}
                </button>
                <button onclick="toggleComments('${post.id}')">
                    💬 تعليق
                </button>
                <button onclick="sharePost('${post.id}')">
                    ↗ مشاركة
                </button>
            </div>
            <div id="comments-${post.id}" class="comment-box">
                <textarea
                    id="comment-input-${post.id}"
                    maxlength="500"
                    placeholder="اكتب تعليقًا..."
                ></textarea>
                <button onclick="sendComment('${post.id}')">إرسال</button>
                <div id="comments-list-${post.id}" class="comments"></div>
            </div>
        </article>
    `;
}
// ================================
// نشر
// ================================
publishBtn.addEventListener("click", async () => {
    const content = postContent.value.trim();
    if (!content) {
        alert("اكتب منشورًا أولاً");
        return;
    }
    if (content.length > 500) {
        alert("المنشور يجب ألا يتجاوز 500 حرف");
        return;
    }
    publishBtn.disabled = true;
    try {
        const session = await getSession();

        if (!session) {
            alert("يجب تسجيل الدخول أولاً");
            return;
        }
await ensureChatProfile(session.user);
        const { error } = await supabaseClient
            .from("chat_azzi_posts")
            .insert({
                user_id: session.user.id,
                content
            });
        if (error) throw error;
        postContent.value = "";
        counter.textContent = "0 / 500";
        await loadPosts();
    } catch (error) {
        console.error(error);
        alert(error.message || "تعذر نشر المنشور");
    } finally {
        publishBtn.disabled = false;
    }
});
// ================================
// إعجاب (تبديل: إعجاب / إلغاء إعجاب)
// ================================

async function likePost(postId) {
    try {
        const session = await getSession();

        if (!session) {
            alert("سجل الدخول للإعجاب");
            return;
        }
const { data: existing } = await supabaseClient
            .from("chat_azzi_likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", session.user.id)
            .maybeSingle();
        if (existing) {
            const { error } = await supabaseClient
                .from("chat_azzi_likes")
                .delete()
                .eq("id", existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabaseClient
                .from("chat_azzi_likes")
                .insert({
                    post_id: postId,
                    user_id: session.user.id
                });

            if (error) throw error;
        }

        await loadPosts();

    } catch (error) {
        console.error(error);
        alert(error.message || "تعذر تنفيذ الإعجاب");
    }
}
// ================================
// التعليقات
// ================================
async function toggleComments(postId) {
    const box = document.getElementById(`comments-${postId}`);
    if (!box) return;
    if (box.style.display === "block") {
        box.style.display = "none";
        return;
    }
    box.style.display = "block";
    await loadComments(postId);
}
async function loadComments(postId) {
    const list = document.getElementById(`comments-list-${postId}`);
    if (!list) return;
    list.innerHTML = "جاري تحميل التعليقات...";
    try {
        const { data: comments, error } = await supabaseClient
            .from("chat_azzi_comments")
            .select("*, chat_azzi_profiles(username, display_name)")
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        if (!comments || !comments.length) {
            list.innerHTML = `<div class="comment">لا توجد تعليقات بعد.</div>`;
            return;
        }
list.innerHTML = comments
            .map(comment => {
                const profile = comment.chat_azzi_profiles || {};
                const name = profile.display_name || profile.username || "مستخدم";
                return `
                    <div class="comment">
                        <strong>${escapeHTML(name)}</strong>
                        <br>
                        ${escapeHTML(comment.content)}
                    </div>
                `;
            })
            .join("");
    } catch (error) {
        console.error(error);
        list.innerHTML = "تعذر تحميل التعليقات";
    }
}


// ================================
// إرسال تعليق
// ================================

async function sendComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;

    const content = input.value.trim();
    if (!content) return;

    try {
        const session = await getSession();

        if (!session) {
            alert("يجب تسجيل الدخول أولاً");
            return;
        }
await ensureChatProfile(session.user);
        const { error } = await supabaseClient
            .from("chat_azzi_comments")
            .insert({
                post_id: postId,
                user_id: session.user.id,
                content
            });
        if (error) throw error;
        input.value = "";
        await loadComments(postId);
    } catch (error) {
        console.error(error);
        alert(error.message || "تعذر إرسال التعليق");
    }
}
// ================================
// مشاركة
// ================================

async function sharePost(postId) {
    const url = `${window.location.origin}${window.location.pathname}#post-${postId}`;

    try {
        if (navigator.share) {
            await navigator.share({
                title: "Chat AZZI",
                text: "شاهد هذا المنشور في Chat AZZI",
                url
            });
        } else {
            await navigator.clipboard.writeText(url);
            alert("تم نسخ رابط المنشور");
        }
    } catch (error) {
        console.log(error);
    }
}
// ================================
// التبويبات
// ================================
document.querySelectorAll(".chat-tabs button").forEach(button => {
    button.addEventListener("click", () => {
        document
            .querySelectorAll(".chat-tabs button")
            .forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentSort = button.dataset.sort;
        loadPosts();
    });
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
    const d = new Date(date);
    const now = new Date();
    const seconds = Math.floor((now - d) / 1000);

    if (seconds < 60) return "الآن";
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} د`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} س`;
    if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} ي`;

    return d.toLocaleDateString("ar");
}
// ================================
// التشغيل
// ================================

document.addEventListener("DOMContentLoaded", async () => {
    const session = await getSession();

    if (session) {
        await ensureChatProfile(session.user);
    }

    await loadPosts();
});
