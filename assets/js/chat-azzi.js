(function () {

    "use strict";


    const STORAGE_KEY = "azzi_chat_posts";


    let posts = loadPosts();

    let currentFilter = "latest";


    const postInput =
        document.getElementById("postInput");

    const publishButton =
        document.getElementById("publishPostBtn");

    const postsContainer =
        document.getElementById("postsContainer");

    const postCounter =
        document.getElementById("postCounter");


    /* ==========================================
       تحميل المنشورات
    ========================================== */

    function loadPosts() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) return [];

            const data =
                JSON.parse(saved);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(error);

            return [];
        }
    }


    /* ==========================================
       حفظ المنشورات
    ========================================== */

    function savePosts() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(posts)
        );
    }
/* ==========================================
       إنشاء منشور
    ========================================== */

    function createPost() {

        if (!postInput) return;


        const content =
            postInput.value.trim();


        if (!content) {

            alert("اكتب شيئًا أولًا.");

            return;
        }


        if (content.length > 500) {

            alert(
                "المنشور طويل جدًا."
            );

            return;
        }


        const post = {

            id:
                Date.now().toString(),

            username:
                "زائر AZZI",

            content:
                content,

            likes:
                0,

            liked:
                false,

            replies:
                [],

            createdAt:
                Date.now()

        };


        posts.unshift(post);

        savePosts();

        postInput.value = "";

        updateCounter();

        renderPosts();

    }


    /* ==========================================
       عداد الأحرف
    ========================================== */

    function updateCounter() {

        if (!postInput || !postCounter)
            return;


        postCounter.textContent =
            `${postInput.value.length} / 500`;
    }
/* ==========================================
       الوقت
    ========================================== */

    function formatTime(timestamp) {

        const diff =
            Date.now() - timestamp;


        const minute =
            60 * 1000;

        const hour =
            60 * minute;

        const day =
            24 * hour;


        if (diff < minute)
            return "الآن";


        if (diff < hour)
            return (
                Math.floor(diff / minute)
                + " دقيقة"
            );


        if (diff < day)
            return (
                Math.floor(diff / hour)
                + " ساعة"
            );


        return (
            Math.floor(diff / day)
            + " يوم"
        );
    }


    /* ==========================================
       ترتيب المنشورات
    ========================================== */

    function getFilteredPosts() {

        const list =
            [...posts];


        if (currentFilter === "popular") {

            list.sort(
                (a, b) =>
                    b.likes - a.likes
            );

        } else {

            list.sort(
                (a, b) =>
                    b.createdAt - a.createdAt
            );
        }


        return list;
    }
/* ==========================================
       عرض المنشورات
    ========================================== */

    function renderPosts() {

        if (!postsContainer)
            return;


        const list =
            getFilteredPosts();


        if (list.length === 0) {

            postsContainer.innerHTML = `
                <div class="empty-chat">
                    <div style="font-size:40px">
                        ✦
                    </div>

                    <p>
                        لا توجد منشورات حتى الآن.
                    </p>

                    <p>
                        كن أول شخص ينشر في Chat AZZI.
                    </p>
                </div>
            `;

            return;
        }


        postsContainer.innerHTML =
            list
                .map(renderPost)
                .join("");
    }


    /* ==========================================
       حماية HTML
    ========================================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }
/* ==========================================
       منشور واحد
    ========================================== */

    function renderPost(post) {

        const likedClass =
            post.liked
                ? "liked"
                : "";


        const replies =
            Array.isArray(post.replies)
                ? post.replies
                : [];


        return `

        <article
            class="chat-post"
            data-post-id="${post.id}">


            <div class="chat-post-header">

                <div class="chat-avatar">
                    ز
                </div>

                <div>

                    <div class="chat-user-name">
                        ${escapeHTML(post.username)}
                    </div>

                    <div class="chat-post-time">
                        ${formatTime(post.createdAt)}
                    </div>

                </div>

            </div>


            <div class="chat-post-content">
                ${escapeHTML(post.content)}
            </div>


            <div class="chat-actions">

                <button
                    class="chat-action ${likedClass}"
                    data-action="like">

                    ${post.liked ? "❤️" : "♡"}
                    ${post.likes}

                </button>


                <button
                    class="chat-action"
                    data-action="reply">

                    💬
                    ${replies.length}
</button>


                <button
                    class="chat-action"
                    data-action="share">

                    ↗ مشاركة

                </button>

            </div>


            <div class="reply-box">

                <textarea
                    maxlength="300"
                    placeholder="اكتب إجابة..."></textarea>

                <button
                    data-action="send-reply">

                    إرسال

                </button>

            </div>


            ${
                replies.length
                ?
                `
                <div style="margin-top:10px">
                    ${replies
                        .map(
                            reply => `
                            <div
                                style="
                                    margin-top:8px;
                                    padding:10px;
                                    border-radius:12px;
                                    background:rgba(255,255,255,.04);
                                ">
<strong>
                                    ${escapeHTML(
                                        reply.username
                                    )}
                                </strong>

                                <div style="margin-top:4px">
                                    ${escapeHTML(
                                        reply.content
                                    )}
                                </div>

                            </div>
                            `
                        )
                        .join("")}
                </div>
                `
                :
                ""
            }

        </article>

        `;
    }


    /* ==========================================
       التفاعل
    ========================================== */

    postsContainer?.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button)
                return;


            const article =
                button.closest(
                    ".chat-post"
                );
if (!article)
                return;


            const post =
                posts.find(
                    item =>
                        item.id ===
                        article.dataset.postId
                );


            if (!post)
                return;


            const action =
                button.dataset.action;


            /* إعجاب */

            if (action === "like") {

                post.liked =
                    !post.liked;


                post.likes +=
                    post.liked
                        ? 1
                        : -1;


                savePosts();

                renderPosts();

                return;
            }


            /* فتح الإجابة */

            if (action === "reply") {

                const box =
                    article.querySelector(
                        ".reply-box"
                    );


                box?.classList.toggle(
                    "active"
                );

                return;
            }


            /* إرسال الإجابة */

            if (
                action ===
                "send-reply"
            ) {

                const textarea =
                    article.querySelector(
                        ".reply-box textarea"
                    );
const text =
                    textarea?.value.trim();


                if (!text)
                    return;


                if (!Array.isArray(post.replies))
                    post.replies = [];


                post.replies.push({

                    username:
                        "زائر AZZI",

                    content:
                        text

                });


                savePosts();

                renderPosts();

                return;
            }


            /* مشاركة */

            if (action === "share") {

                const shareText =
                    `منشور من Chat AZZI:\n\n${post.content}`;


                if (
                    navigator.share
                ) {

                    navigator.share({
                        title: "Chat AZZI",
                        text: shareText
                    });

                } else {

                    navigator.clipboard
                        ?.writeText(
                            shareText
                        );

                    alert(
                        "تم نسخ المنشور."
                    );
                }
            }

        }
    );
/* ==========================================
       التبويبات
    ========================================== */

    document
        .querySelectorAll(".chat-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".chat-tab"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    currentFilter =
                        this.dataset.filter;


                    renderPosts();

                }
            );

        });


    /* ==========================================
       الأحداث
    ========================================== */

    publishButton?.addEventListener(
        "click",
        createPost
    );


    postInput?.addEventListener(
        "input",
        updateCounter
    );


    /* ==========================================
       التشغيل
    ========================================== */

    updateCounter();

    renderPosts();

})();

