const postContent = document.getElementById("postContent");
const publishBtn = document.getElementById("publishBtn");
const counter = document.getElementById("counter");
const postsContainer = document.getElementById("postsContainer");

let currentSort = "latest";

postContent.addEventListener("input", () => {
    counter.textContent = `${postContent.value.length} / 500`;
});

async function getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
}

async function ensureChatProfile(user) {
    const base = (user.email || "user")
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "user";

    const username = `${base}_${user.id.slice(0, 6)}`;

    const { error } = await supabaseClient
        .from("chat_azzi_profiles")
        .upsert({
            id: user.id,
            username,
            display_name: base
        }, { onConflict: "id" });

    if (error) throw error;
}
async function loadPosts() {
    postsContainer.innerHTML = `<div class="loading">جاري تحميل المنشورات...</div>`;

    try {
        const { data, error } = await supabaseClient
            .from("chat_azzi_posts")
            .select(`
                id,user_id,content,created_at,
                chat_azzi_profiles(username,display_name)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const posts = await Promise.all((data || []).map(async post => {
            const [likes, comments, shares] = await Promise.all([
                supabaseClient.from("chat_azzi_likes")
                    .select("*", { count: "exact", head: true })
                    .eq("post_id", post.id),
                supabaseClient.from("chat_azzi_comments")
                    .select("*", { count: "exact", head: true })
                    .eq("post_id", post.id),
                supabaseClient.from("chat_azzi_shares")
                    .select("*", { count: "exact", head: true })
                    .eq("post_id", post.id)
            ]);

            return {
                ...post,
                likes_count: likes.count || 0,
                comments_count: comments.count || 0,
                shares_count: shares.count || 0
            };
        }));
if (currentSort === "popular") {
            posts.sort((a, b) =>
                (b.likes_count + b.comments_count) -
                (a.likes_count + a.comments_count)
            );
        }

        renderPosts(posts);
    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = `<div class="empty">تعذر تحميل المنشورات</div>`;
    }
}

function renderPosts(posts) {
    if (!posts.length) {
        postsContainer.innerHTML =
            `<div class="empty">لا توجد منشورات حتى الآن.</div>`;
        return;
    }

    postsContainer.innerHTML = posts.map(post => {
        const p = post.chat_azzi_profiles || {};
        const name = p.display_name || p.username || "مستخدم AZZI";

        return `
        <article class="chat-post" data-post-id="${post.id}">
            <div class="post-user">
                <div class="post-avatar">${escapeHTML(name[0] || "A")}</div>
                <div>
                    <div class="post-name">${escapeHTML(name)}</div>
                    <span class="post-time">@${escapeHTML(p.username || "user")} · ${formatTime(post.created_at)}</span>
                </div>
            </div>

            <div class="post-content">${escapeHTML(post.content)}</div>

            <div class="post-actions">
                <button onclick="likePost('${post.id}')">
                    ❤️ ${post.likes_count}
                </button>
<button onclick="toggleComments('${post.id}')">
                    💬 ${post.comments_count}
                </button>

                <button onclick="sharePost('${post.id}')">
                    ↗ ${post.shares_count}
                </button>
            </div>

            <div id="comments-${post.id}" class="comment-box">
                <textarea id="comment-input-${post.id}"
                    maxlength="500"
                    placeholder="اكتب تعليقًا..."></textarea>

                <button onclick="sendComment('${post.id}')">إرسال</button>

                <div id="comments-list-${post.id}" class="comments"></div>
            </div>
        </article>`;
    }).join("");
}

publishBtn.addEventListener("click", async () => {
    const content = postContent.value.trim();

    if (!content) return alert("اكتب منشورًا أولاً");

    try {
        publishBtn.disabled = true;

        const session = await getSession();
        if (!session) return alert("يجب تسجيل الدخول أولاً");

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

async function likePost(postId) {
    const session = await getSession();
    if (!session) return alert("سجل الدخول للإعجاب");

    const { data } = await supabaseClient
        .from("chat_azzi_likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (data) {
        await supabaseClient
            .from("chat_azzi_likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", session.user.id);
    } else {
        await supabaseClient
            .from("chat_azzi_likes")
            .insert({
                post_id: postId,
                user_id: session.user.id
            });
    }

    await loadPosts();
}
async function toggleComments(postId) {
    const box = document.getElementById(`comments-${postId}`);
    if (!box) return;

    box.style.display =
        box.style.display === "block" ? "none" : "block";

    if (box.style.display === "block") {
        await loadComments(postId);
    }
}

async function loadComments(postId) {
    const list = document.getElementById(`comments-list-${postId}`);
    if (!list) return;

    const { data, error } = await supabaseClient
        .from("chat_azzi_comments")
        .select(`
            id,content,created_at,
            chat_azzi_profiles(username,display_name)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

    if (error) {
        list.innerHTML = "تعذر تحميل التعليقات";
        return;
    }

    list.innerHTML = data?.length
        ? data.map(c => `
            <div class="comment">
                <strong>${escapeHTML(c.chat_azzi_profiles?.display_name || "مستخدم")}</strong>
                <br>${escapeHTML(c.content)}
            </div>
        `).join("")
        : `<div class="comment">لا توجد تعليقات بعد.</div>`;
}
async function sendComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input?.value.trim();

    if (!content) return;

    const session = await getSession();
    if (!session) return alert("يجب تسجيل الدخول أولاً");

    await ensureChatProfile(session.user);

    const { error } = await supabaseClient
        .from("chat_azzi_comments")
        .insert({
            post_id: postId,
            user_id: session.user.id,
            content
        });

    if (error) return alert(error.message);

    input.value = "";
    await loadComments(postId);
    await loadPosts();
}

async function sharePost(postId) {
    const session = await getSession();
    if (!session) return alert("يجب تسجيل الدخول أولاً");

    await ensureChatProfile(session.user);

    const { error } = await supabaseClient
        .from("chat_azzi_shares")
        .upsert({
            post_id: postId,
            user_id: session.user.id
        }, { onConflict: "post_id,user_id" });

    if (error) console.error(error);
const url =
        `${location.origin}${location.pathname}#post-${postId}`;

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
    } catch {}
    
    await loadPosts();
}

document.querySelectorAll(".chat-tabs button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".chat-tabs button")
            .forEach(b => b.classList.remove("active"));

        button.classList.add("active");
        currentSort = button.dataset.sort;
        loadPosts();
    });
});

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
function formatTime(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "الآن";
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} د`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} س`;
    return new Date(date).toLocaleDateString("ar");
}

document.addEventListener("DOMContentLoaded", async () => {
    const session = await getSession();
    if (session) await ensureChatProfile(session.user);
    await loadPosts();
});
