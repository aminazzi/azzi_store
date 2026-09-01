(() => {
    "use strict";

    /*
     * GitHub فقط
     * Fluent UI Emoji 3D
     */
    const GITHUB =
        "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/";

    /*
     * الإيموجيات المطلوبة في AZZI STORE
     *
     * نحدد اسم المجلد/الملف بدل التخمين.
     */
    const EMOJI_MAP = {

        // Mods
        "🎮": "video-game/3D/video-game_3d.png",

        // النجمة
        "⭐": "star/3D/star_3d.png",

        // القلب
        "❤️": "red-heart/3D/red-heart_3d.png",

        // رموز أخرى موجودة في الموقع
        "🔍": "magnifying-glass-tilted-left/3D/magnifying-glass-tilted-left_3d.png",
        "🌐": "globe-with-meridians/3D/globe-with-meridians_3d.png",
        "👤": "bust-in-silhouette/3D/bust-in-silhouette_3d.png",
        "✕": "multiply/3D/multiply_3d.png",
        "❌": "cross-mark/3D/cross-mark_3d.png",
        "✅": "check-mark-button/3D/check-mark-button_3d.png",
        "⚠️": "warning/3D/warning_3d.png",
        "📦": "package/3D/package_3d.png",
        "📚": "books/3D/books_3d.png",
        "💻": "laptop/3D/laptop_3d.png",
        "🤖": "robot/3D/robot_3d.png",
        "🎥": "video-camera/3D/video-camera_3d.png",
        "📞": "telephone-receiver/3D/telephone-receiver_3d.png",
        "🎁": "wrapped-gift/3D/wrapped-gift_3d.png",
        "🔐": "locked-with-key/3D/locked-with-key_3d.png",
        "🚪": "door/3D/door_3d.png",
        "🏠": "house/3D/house_3d.png"
    };
const SKIP_TAGS = new Set([
        "SCRIPT",
        "STYLE",
        "NOSCRIPT",
        "TEXTAREA",
        "INPUT",
        "OPTION",
        "SELECT",
        "CODE",
        "PRE",
        "SVG"
    ]);


    /*
     * ضروري للإيموجيات المركبة
     */
    const segmenter =
        typeof Intl !== "undefined" &&
        Intl.Segmenter
            ? new Intl.Segmenter("ar", {
                granularity: "grapheme"
            })
            : null;


    function splitGraphemes(text) {

        if (segmenter) {
            return [...segmenter.segment(text)]
                .map(x => x.segment);
        }

        return [...text];
    }


    /*
     * إنشاء صورة من GitHub
     */
    function createEmojiImage(emoji) {

        const path = EMOJI_MAP[emoji];

        if (!path) {
            return null;
        }

        const img = document.createElement("img");

        img.className = "realistic-emoji";

        img.alt = emoji;

        img.title = emoji;

        img.draggable = false;

        img.decoding = "async";

        img.src = GITHUB + path;
/*
         * إذا فشل ملف GitHub،
         * نعيد الإيموجي الأصلي.
         */
        img.onerror = () => {

            img.replaceWith(
                document.createTextNode(emoji)
            );
        };


        return img;
    }


    /*
     * استبدال Text Nodes
     */
    function replaceTextNode(node) {

        const text = node.nodeValue;

        if (!text) return;

        const parent = node.parentElement;

        if (!parent) return;

        if (SKIP_TAGS.has(parent.tagName)) {
            return;
        }


        const parts = splitGraphemes(text);

        let found = false;


        for (const part of parts) {

            if (EMOJI_MAP[part]) {

                found = true;

                break;
            }
        }
if (!found) return;


        const fragment =
            document.createDocumentFragment();


        for (const part of parts) {

            const image =
                createEmojiImage(part);


            if (image) {

                fragment.appendChild(image);

            } else {

                fragment.appendChild(
                    document.createTextNode(part)
                );
            }
        }


        node.replaceWith(fragment);
    }


    /*
     * فحص الصفحة
     */
    function scan(root) {

        if (!root) return;


        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT
            );


        const nodes = [];

        let node;


        while (
            (node = walker.nextNode())
        ) {
            nodes.push(node);
        }


        nodes.forEach(
            replaceTextNode
        );
    }
/*
     * تصميم الإيموجيات
     */
    function addCSS() {

        if (
            document.getElementById(
                "azzi-realistic-emoji-css"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "azzi-realistic-emoji-css";


        style.textContent = `

            .realistic-emoji {

                width: 1.25em;
                height: 1.25em;

                display: inline-block;

                object-fit: contain;

                vertical-align: -0.2em;

                margin:
                    0 .03em;

                user-select: none;

                pointer-events: none;

                -webkit-user-drag: none;

                filter:
                    drop-shadow(
                        0 2px 2px
                        rgba(0,0,0,.18)
                    );

                transition:
                    transform .15s ease,
                    filter .15s ease;
            }


            button .realistic-emoji,
            a .realistic-emoji {

                pointer-events: none;
            }
.realistic-emoji:hover {

                transform:
                    scale(1.08)
                    translateY(-1px);

                filter:
                    drop-shadow(
                        0 4px 4px
                        rgba(0,0,0,.20)
                    );
            }


            /*
             * النجوم
             */
            .review-stars .realistic-emoji,
            .rating .realistic-emoji {

                width: 1.05em;
                height: 1.05em;

                vertical-align: -0.14em;
            }
        `;


        document.head.appendChild(style);
    }


    /*
     * التشغيل
     */
    function start() {

        addCSS();

        scan(document.body);


        /*
         * مراقبة العناصر التي ينشئها JavaScript
         */
        const observer =
            new MutationObserver(
                mutations => {

                    for (
                        const mutation of mutations
                    ) {

                        for (
                            const added
                            of mutation.addedNodes
                        ) {

                            if (
                                added.nodeType ===
                                Node.TEXT_NODE
                            ) {

                                replaceTextNode(
                                    added
                                );
} else if (
                                added.nodeType ===
                                Node.ELEMENT_NODE
                            ) {

                                scan(added);
                            }
                        }
                    }
                }
            );


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    } else {

        start();
    }

})();
