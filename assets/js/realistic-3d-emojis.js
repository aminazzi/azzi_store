(() => {
    "use strict";

    const BASE_URL =
        "https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/";

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

    // دعم الإيموجيات المركبة مثل:
    // ❤️ 🏳️‍🌈 👨‍👩‍👧‍👦 👍🏽
    const segmenter =
        typeof Intl !== "undefined" && Intl.Segmenter
            ? new Intl.Segmenter(undefined, {
                  granularity: "grapheme"
              })
            : null;

    function isEmoji(cluster) {
        return /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/u.test(
            cluster
        );
    }

    function unicodeName(text) {
        return [...text]
            .map(char => char.codePointAt(0).toString(16))
            .join("-");
    }

    function emojiURL(emoji) {
        return `${BASE_URL}${unicodeName(emoji)}_3d.png`;
    }

    function createEmojiImage(emoji) {
        const img = document.createElement("img");
img.src = emojiURL(emoji);
        img.alt = emoji;
        img.title = emoji;
        img.className = "realistic-emoji";

        img.draggable = false;
        img.decoding = "async";

        // إذا لم توجد نسخة 3D لهذا الإيموجي
        img.onerror = () => {
            img.replaceWith(document.createTextNode(emoji));
        };

        return img;
    }

    function replaceTextNode(node) {
        const text = node.nodeValue;

        if (!text || !isEmoji(text)) return;

        const parent = node.parentElement;

        if (!parent || SKIP_TAGS.has(parent.tagName)) return;

        const parts = segmenter
            ? [...segmenter.segment(text)].map(x => x.segment)
            : [...text];

        let hasEmoji = false;

        const fragment = document.createDocumentFragment();

        for (const part of parts) {
            if (isEmoji(part)) {
                fragment.appendChild(createEmojiImage(part));
                hasEmoji = true;
            } else {
                fragment.appendChild(document.createTextNode(part));
            }
        }

        if (hasEmoji) {
            node.replaceWith(fragment);
        }
    }
function scan(root = document.body) {
        if (!root) return;

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (SKIP_TAGS.has(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (
                        parent.classList &&
                        parent.classList.contains("realistic-emoji")
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return isEmoji(node.nodeValue)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];

        let current;

        while ((current = walker.nextNode())) {
            nodes.push(current);
        }

        nodes.forEach(replaceTextNode);
    }
function addCSS() {
        if (document.getElementById("realistic-emoji-style")) return;

        const style = document.createElement("style");

        style.id = "realistic-emoji-style";

        style.textContent = `
            .realistic-emoji {
                display: inline-block;
                width: 1.25em;
                height: 1.25em;
                object-fit: contain;

                vertical-align: -0.2em;

                margin-left: 0.04em;
                margin-right: 0.04em;

                user-select: none;
                -webkit-user-drag: none;

                filter:
                    drop-shadow(0 2px 1px rgba(0,0,0,.18))
                    drop-shadow(0 4px 4px rgba(0,0,0,.12));

                transform: translateZ(0);

                transition:
                    transform .18s ease,
                    filter .18s ease;
            }

            .realistic-emoji:hover {
                transform:
                    translateY(-2px)
                    scale(1.08);

                filter:
                    drop-shadow(0 4px 2px rgba(0,0,0,.20))
                    drop-shadow(0 7px 7px rgba(0,0,0,.15));
            }

            button .realistic-emoji,
            a .realistic-emoji {
                pointer-events: none;
}
        `;

        document.head.appendChild(style);
    }

    function start() {
        addCSS();

        scan(document.body);

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        replaceTextNode(node);
                    }

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        scan(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
