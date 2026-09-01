(() => {
    "use strict";

    /*
     * إذا لم نجد نسخة 3D:
     * نترك الإيموجي الأصلي ظاهرًا.
     */

    const EMOJI_MAP = {
        "🎮": "video-game",
        "⭐": "star",
        "❤️": "red-heart"
    };

    const SKIP = new Set([
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


    function isEmoji(text) {
        return (
            text in EMOJI_MAP
        );
    }


    function createEmoji(emoji) {
/*
         * نستخدم GitHub فقط.
         *
         * إذا كان الملف غير موجود،
         * لا نحذف الإيموجي.
         */

        const name = EMOJI_MAP[emoji];

        if (!name) {
            return null;
        }

        const img =
            document.createElement("img");

        img.className =
            "realistic-emoji";

        img.alt = emoji;

        img.title = emoji;

        img.draggable = false;

        img.decoding = "async";


        /*
         * مسار GitHub
         */
        img.src =
            `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${name}/3D/${name}_3d.png`;


        /*
         * إذا لم يوجد الملف:
         * نرجع الإيموجي الأصلي.
         */
        img.onerror = () => {

            img.replaceWith(
                document.createTextNode(
                    emoji
                )
            );
        };


        return img;
    }


    function replaceTextNode(node) {

        const text =
            node.nodeValue;

        if (!text) return;

        const parent =
            node.parentElement;

        if (!parent) return;

        if (
            SKIP.has(parent.tagName)
        ) {
            return;
        }
const parts =
            splitGraphemes(text);

        let found = false;


        for (const part of parts) {

            if (isEmoji(part)) {
                found = true;
                break;
            }
        }


        if (!found) return;


        const fragment =
            document.createDocumentFragment();


        for (const part of parts) {

            const image =
                createEmoji(part);


            if (image) {

                fragment.appendChild(
                    image
                );

            } else {

                /*
                 * مهم جدًا:
                 * أي شيء لا نعرفه يبقى ظاهرًا.
                 */
                fragment.appendChild(
                    document.createTextNode(
                        part
                    )
                );
            }
        }


        node.replaceWith(fragment);
    }


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


    function addStyle() {

        if (
            document.getElementById(
                "azzi-realistic-emoji"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "azzi-realistic-emoji";


        style.textContent = `

            .realistic-emoji {

                display: inline-block;

                width: 1.25em;
                height: 1.25em;

                object-fit: contain;

                vertical-align: -0.2em;

                margin: 0 .04em;

                user-select: none;

                -webkit-user-drag: none;

                filter:
                    drop-shadow(
                        0 2px 2px
                        rgba(0,0,0,.18)
                    );

                transition:
                    transform .15s ease;
            }


            .realistic-emoji:hover {

                transform:
                    scale(1.08)
                    translateY(-1px);
            }

        `;
document.head.appendChild(style);
    }


    function start() {

        addStyle();

        scan(document.body);


        /*
         * الإيموجيات التي يتم إنشاؤها
         * لاحقًا بواسطة JavaScript.
         */
        const observer =
            new MutationObserver(
                mutations => {

                    for (
                        const mutation
                        of mutations
                    ) {

                        for (
                            const node
                            of mutation.addedNodes
                        ) {

                            if (
                                node.nodeType ===
                                Node.TEXT_NODE
                            ) {

                                replaceTextNode(
                                    node
                                );

                            } else if (
                                node.nodeType ===
                                Node.ELEMENT_NODE
                            ) {

                                scan(node);
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
