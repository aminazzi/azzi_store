// ============================================
// Chat AZZI
// يعمل مباشرة مع Supabase
// ============================================

const SUPABASE_URL =
    "https://swfiagrlqebsnvgshipu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_fh06o6KzVQdmcIpXBntySg_qI-70v4E";

const chatSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

let currentSort = "latest";

// ============================================
// بدء التطبيق
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const postContent = document.getElementById("postContent");
    const publishBtn = document.getElementById("publishBtn");
    const counter = document.getElementById("counter");

    if (!postContent || !publishBtn || !counter) {
        console.error("Chat AZZI: عناصر HTML غير موجودة");
        return;
    }
// عداد الحروف
    postContent.addEventListener("input", () => {
        counter.textContent =
            `${postContent.value.length} / 500`;
    });

    // زر النشر
    publishBtn.addEventListener("click", publishPost);

    // التبويبات
    document
        .querySelectorAll(".chat-tabs button")
        .forEach(button => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".chat-tabs button")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });

                button.classList.add("active");

                currentSort =
                    button.dataset.sort || "latest";

                loadPosts();
            });

        });

    // تحميل المنشورات
    loadPosts();
});
// ============================================
// الحصول على الجلسة
// ============================================

async function getSession() {

    const {
        data,
        error
    } = await chatSupabase.auth.getSession();

    if (error) {

        console.error(
            "Session error:",
            error
        );

        return null;
    }

    return data.session;
}

// ============================================
// إنشاء بروفايل Chat AZZI
// مهم:
// لا نستخدم upsert حتى لا نحتاج UPDATE policy
// ============================================

async function ensureChatProfile(user) {

    if (!user) {
        return false;
    }

    // أولاً نبحث عن البروفايل
    const {
        data: existingProfile,
        error: selectError
    } = await chatSupabase
        .from("chat_azzi_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (selectError) {

        console.error(
            "Profile select error:",
            selectError
        );

        return false;
    }
// موجود بالفعل
    if (existingProfile) {
        return true;
    }

    // إنشاء اسم مستخدم
    const email =
        user.email || "user";

    let base =
        email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
            .slice(0, 20);

    if (!base) {
        base = "user";
    }

    const username =
        `${base}_${user.id.slice(0, 6)}`;

    // إنشاء البروفايل مرة واحدة فقط
    const {
        error: insertError
    } = await chatSupabase
        .from("chat_azzi_profiles")
        .insert({
            id: user.id,
            username: username,
            display_name: base
        });

    if (insertError) {

        console.error(
            "Profile insert error:",
            insertError
        );

        // نحاول التأكد هل أُنشئ بالفعل
        // بسبب طلب آخر في نفس الوقت
        const {
            data: checkAgain
        } = await chatSupabase
            .from("chat_azzi_profiles")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

        if (checkAgain) {
            return true;
        }

        return false;
    }

    return true;
}
// ============================================
// تحميل المنشورات
// ============================================

async function loadPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    postsContainer.innerHTML =
        `<div class="loading">
            جاري تحميل المنشورات...
        </div>`;

    try {

        let query =
            chatSupabase
                .from("chat_azzi_posts")
                .select(`
                    id,
                    user_id,
                    content,
                    likes_count,
                    created_at,
                    chat_azzi_profiles (
                        username,
                        display_name
                    )
                `);

        if (currentSort === "popular") {

            query =
                query.order(
                    "likes_count",
                    {
                        ascending: false
                    }
                );

        } else {

            query =
                query.order(
                    "created_at",
                    {
                        ascending: false
                    }
                );
        }

        const {
            data: posts,
            error
        } = await query;

        if (error) {
            throw error;
        }
// معرفة منشورات أعجب بها المستخدم
        const session =
            await getSession();

        let likedIds =
            new Set();

        if (session) {

            const {
                data: myLikes,
                error: likesError
            } = await chatSupabase
                .from("chat_azzi_likes")
                .select("post_id")
                .eq(
                    "user_id",
                    session.user.id
                );

            if (!likesError && myLikes) {

                likedIds =
                    new Set(
                        myLikes.map(
                            like => like.post_id
                        )
                    );
            }
        }

        renderPosts(
            posts || [],
            likedIds
        );

    } catch (error) {

        console.error(
            "Load posts error:",
            error
        );

        postsContainer.innerHTML =
            `<div class="empty">
                تعذر تحميل المنشورات
            </div>`;
    }
}
// ============================================
// عرض المنشورات
// ============================================

function renderPosts(posts, likedIds) {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) {
        return;
    }

    if (!posts.length) {

        postsContainer.innerHTML =
            `<div class="empty">
                لا توجد منشورات حتى الآن.<br>
                كن أول من ينشر! ✦
            </div>`;

        return;
    }

    postsContainer.innerHTML =
        posts
            .map(post =>
                createPostHTML(
                    post,
                    likedIds.has(post.id)
                )
            )
            .join("");
}

// ============================================
// إنشاء HTML للمنشور
// ============================================

function createPostHTML(post, liked) {

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

    const likes =
        Number(post.likes_count || 0);

    return `
        <article
            class="chat-post"
            data-post-id="${post.id}"
            id="post-${post.id}">

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
                        ·
                        ${time}
                    </span>
                </div>

            </div>

            <div class="post-content">
                ${content}
            </div>

            <div class="post-actions">

                <button
type="button"
                    onclick="likePost('${post.id}')">
                    ${liked ? "♥" : "♡"} ${likes}
                </button>

                <button
                    type="button"
                    onclick="toggleComments('${post.id}')">
                    💬 تعليق
                </button>

                <button
                    type="button"
                    onclick="sharePost('${post.id}')">
                    ↗ مشاركة
                </button>

            </div>

            <div
                id="comments-${post.id}"
                class="comment-box"
                style="display:none;">

                <textarea
                    id="comment-input-${post.id}"
                    maxlength="500"
                    placeholder="اكتب تعليقًا..."></textarea>

                <button
                    type="button"
                    onclick="sendComment('${post.id}')">
                    إرسال
                </button>

                <div
                    id="comments-list-${post.id}"
                    class="comments">
                </div>

            </div>

        </article>
    `;
}
// ============================================
// نشر منشور
// ============================================

async function publishPost() {

    const postContent =
        document.getElementById("postContent");

    const publishBtn =
        document.getElementById("publishBtn");

    const counter =
        document.getElementById("counter");

    if (!postContent || !publishBtn) {
        return;
    }

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
// يجب أن يكون له بروفايل
        const profileReady =
            await ensureChatProfile(
                session.user
            );

        if (!profileReady) {

            alert(
                "تعذر إنشاء ملف Chat AZZI للمستخدم"
            );

            return;
        }

        const {
            error
        } = await chatSupabase
            .from("chat_azzi_posts")
            .insert({
                user_id: session.user.id,
                content: content
            });

        if (error) {
            throw error;
        }

        postContent.value = "";

        if (counter) {
            counter.textContent =
                "0 / 500";
        }

        await loadPosts();

    } catch (error) {

        console.error(
            "Publish error:",
            error
        );

        alert(
            error.message ||
            "تعذر نشر المنشور"
        );

    } finally {

        publishBtn.disabled = false;
    }
}
// ============================================
// الإعجاب
// ============================================

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

        const {
            data: existing,
            error: selectError
        } = await chatSupabase
            .from("chat_azzi_likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", session.user.id)
            .maybeSingle();

        if (selectError) {
            throw selectError;
        }

        if (existing) {

            const {
                error
            } = await chatSupabase
                .from("chat_azzi_likes")
                .delete()
                .eq(
                    "id",
                    existing.id
                );

            if (error) {
                throw error;
            }
} else {

            // التأكد من وجود البروفايل
            const profileReady =
                await ensureChatProfile(
                    session.user
                );

            if (!profileReady) {

                alert(
                    "تعذر إنشاء ملف Chat AZZI"
                );

                return;
            }

            const {
                error
            } = await chatSupabase
                .from("chat_azzi_likes")
                .insert({
                    post_id: postId,
                    user_id: session.user.id
                });

            if (error) {
                throw error;
            }
        }

        await loadPosts();

    } catch (error) {

        console.error(
            "Like error:",
            error
        );

        alert(
            error.message ||
            "تعذر تنفيذ الإعجاب"
        );
    }
}

// ============================================
// فتح / إغلاق التعليقات
// ============================================

async function toggleComments(postId) {

    const box =
        document.getElementById(
            `comments-${postId}`
        );

    if (!box) {
        return;
    }

    if (
        box.style.display === "block"
    ) {

        box.style.display = "none";

        return;
    }
box.style.display = "block";

    await loadComments(postId);
}

// ============================================
// تحميل التعليقات
// ============================================

async function loadComments(postId) {

    const list =
        document.getElementById(
            `comments-list-${postId}`
        );

    if (!list) {
        return;
    }

    list.innerHTML =
        "جاري تحميل التعليقات...";

    try {

        const {
            data: comments,
            error
        } = await chatSupabase
            .from("chat_azzi_comments")
            .select(`
                id,
                post_id,
                user_id,
                content,
                created_at,
                chat_azzi_profiles (
                    username,
                    display_name
                )
            `)
            .eq(
                "post_id",
                postId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }
if (
            !comments ||
            !comments.length
        ) {

            list.innerHTML =
                `<div class="comment">
                    لا توجد تعليقات بعد.
                </div>`;

            return;
        }

        list.innerHTML =
            comments
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

        console.error(
            "Comments error:",
            error
        );

        list.innerHTML =
            "تعذر تحميل التعليقات";
    }
}
// ============================================
// إرسال تعليق
// ============================================

async function sendComment(postId) {

    const input =
        document.getElementById(
            `comment-input-${postId}`
        );

    if (!input) {
        return;
    }

    const content =
        input.value.trim();

    if (!content) {
        return;
    }

    if (content.length > 500) {

        alert(
            "التعليق يجب ألا يتجاوز 500 حرف"
        );

        return;
    }

    try {

        const session =
            await getSession();

        if (!session) {

            alert(
                "يجب تسجيل الدخول أولاً"
            );

            return;
        }

        const profileReady =
            await ensureChatProfile(
                session.user
            );

        if (!profileReady) {

            alert(
                "تعذر إنشاء ملف Chat AZZI"
            );

            return;
        }
const {
            error
        } = await chatSupabase
            .from("chat_azzi_comments")
            .insert({
                post_id: postId,
                user_id: session.user.id,
                content: content
            });

        if (error) {
            throw error;
        }

        input.value = "";

        await loadComments(postId);

    } catch (error) {

        console.error(
            "Comment error:",
            error
        );

        alert(
            error.message ||
            "تعذر إرسال التعليق"
        );
    }
}

// ============================================
// مشاركة المنشور
// ============================================

async function sharePost(postId) {

    const url =
        `${window.location.origin}` +
        `${window.location.pathname}` +
        `#post-${postId}`;

    try {

        if (
            navigator.share
        ) {

            await navigator.share({
                title: "Chat AZZI",
                text: "شاهد هذا المنشور في Chat AZZI",
                url: url
            });

        } else if (
            navigator.clipboard
        ) {

            await navigator.clipboard.writeText(
                url
            );
alert(
                "تم نسخ رابط المنشور"
            );

        } else {

            alert(url);
        }

    } catch (error) {

        console.log(
            "Share cancelled:",
            error
        );
    }
}

// ============================================
// حماية HTML
// ============================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}
// ============================================
// الوقت
// ============================================

function formatTime(date) {

    const d =
        new Date(date);

    const now =
        new Date();

    const seconds =
        Math.floor(
            (now - d) / 1000
        );

    if (seconds < 60) {
        return "الآن";
    }

    if (seconds < 3600) {

        return `منذ ${
            Math.floor(seconds / 60)
        } د`;
    }

    if (seconds < 86400) {

        return `منذ ${
            Math.floor(seconds / 3600)
        } س`;
    }

    if (seconds < 604800) {

        return `منذ ${
            Math.floor(seconds / 86400)
        } ي`;
    }

    return d.toLocaleDateString("ar");
}
    
