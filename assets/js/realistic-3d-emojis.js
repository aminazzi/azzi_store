(() => {
    "use strict";

    // GitHub فقط
    const BASE_URL =
        "https://raw.githubusercontent.com/shuding/fluentui-emoji-unicode/main/assets/";

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
     * تقسيم النص إلى Grapheme Clusters
     *
     * هذا مهم جدًا للإيموجيات المركبة:
     * 👨‍👩‍👧‍👦
     * 🏳️‍🌈
     * ❤️
     * 👍🏽
     * 🎮
     * ⭐⭐⭐⭐⭐
     */
    const segmenter =
        typeof Intl !== "undefined" && Intl.Segmenter
            ? new Intl.Segmenter("en", {
                  granularity: "grapheme"
              })
            : null;

    function splitGraphemes(text) {
        if (segmenter) {
            return [...segmenter.segment(text)].map(x => x.segment);
        }

        return [...text];
    }
/*
     * تحويل الإيموجي الكامل إلى Unicode filename
     *
     * مثال:
     * ❤️
     * تصبح:
     * 2764-fe0f
     */
    function unicodeName(emoji) {
        return [...emoji]
            .map(char =>
                char.codePointAt(0)
                    .toString(16)
                    .padStart(4, "0")
            )
            .join("-");
    }

    /*
     * بعض المستودعات تستخدم أسماء بدون FE0F
     * لذلك نجرب أكثر من احتمال.
     */
    function getPossibleNames(emoji) {
        const normal = unicodeName(emoji);

        const withoutVariation = [...emoji]
            .filter(char => char.codePointAt(0) !== 0xfe0f)
            .map(char =>
                char.codePointAt(0)
                    .toString(16)
                    .padStart(4, "0")
            )
            .join("-");

        return [
            normal,
            withoutVariation
        ].filter((value, index, array) =>
            value && array.indexOf(value) === index
        );
    }

    function isEmojiCluster(cluster) {
/*
         * Extended_Pictographic يغطي أغلب الإيموجيات
         * بما فيها الإيموجيات المركبة.
         */
        return /[\p{Extended_Pictographic}]/u.test(cluster);
    }

    /*
     * إنشاء صورة 3D
     */
    function createEmojiImage(emoji) {
        const img = document.createElement("img");

        img.className = "realistic-emoji";
        img.alt = emoji;
        img.title = emoji;

        img.draggable = false;
        img.decoding = "async";

        const names = getPossibleNames(emoji);

        let index = 0;

        function tryNext() {
            if (index >= names.length) {
                /*
                 * إذا لم نجد نسخة 3D لهذا الإيموجي،
                 * نعيد الإيموجي الأصلي بدل كسر الصفحة.
                 */
                img.replaceWith(
                    document.createTextNode(emoji)
                );

                return;
            }

            img.src =
                `${BASE_URL}${names[index]}_3d.png`;

            index++;
        }

        img.onerror = tryNext;

        tryNext();

        return img;
    }
/*
     * استبدال الإيموجيات داخل Text Node
     */
    function replaceTextNode(node) {
        const text = node.nodeValue;

        if (!text) return;

        const parent = node.parentElement;

        if (!parent) return;

        if (SKIP_TAGS.has(parent.tagName)) return;

        const parts = splitGraphemes(text);

        let containsEmoji = false;

        for (const part of parts) {
            if (isEmojiCluster(part)) {
                containsEmoji = true;
                break;
            }
        }

        if (!containsEmoji) return;

        const fragment =
            document.createDocumentFragment();

        for (const part of parts) {
            if (isEmojiCluster(part)) {
                fragment.appendChild(
                    createEmojiImage(part)
                );
            } else {
                fragment.appendChild(
                    document.createTextNode(part)
                );
            }
        }

        node.replaceWith(fragment);
    }
/*
     * فحص الصفحة كاملة
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

        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(replaceTextNode);
    }

    /*
     * CSS
     */
    function addCSS() {
        if (
            document.getElementById(
                "realistic-emoji-style"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "realistic-emoji-style";

        style.textContent = `
            .realistic-emoji {
                display: inline-block;

                width: 1.25em;
                height: 1.25em;

                object-fit: contain;

                vertical-align: -0.2em;

                margin: 0 0.04em;

                user-select: none;

                -webkit-user-drag: none;

                filter:
                    drop-shadow(
                        0 2px 1px rgba(0,0,0,.18)
                    )
                    drop-shadow(
                        0 4px 5px rgba(0,0,0,.12)
                    );
transition:
                    transform .18s ease,
                    filter .18s ease;
            }

            .realistic-emoji:hover {
                transform:
                    translateY(-2px)
                    scale(1.08);

                filter:
                    drop-shadow(
                        0 4px 2px rgba(0,0,0,.20)
                    )
                    drop-shadow(
                        0 7px 7px rgba(0,0,0,.15)
                    );
            }

            button .realistic-emoji,
            a .realistic-emoji {
                pointer-events: none;
            }
        `;

        document.head.appendChild(style);
    }

    /*
     * تشغيل النظام
     */
    function start() {
        addCSS();

        scan(document.body);

        /*
         * مراقبة أي Emoji يتم إضافته
         * لاحقًا بواسطة JavaScript.
         */
        const observer =
            new MutationObserver(mutations => {

                for (const mutation of mutations) {

                    for (const added of mutation.addedNodes) {

                        if (
                            added.nodeType ===
                            Node.TEXT_NODE
                        ) {
                            replaceTextNode(added);
                        }
else if (
                            added.nodeType ===
                            Node.ELEMENT_NODE
                        ) {
                            scan(added);
                        }
                    }
                }
            });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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
