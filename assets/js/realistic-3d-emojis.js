(function () {
    "use strict";

    // GitHub فقط
    const GITHUB_BASE =
        "https://raw.githubusercontent.com/shuding/fluentui-emoji-unicode/main/assets/";

    // العناصر التي لا نريد تعديل محتواها
    const SKIP_TAGS = new Set([
        "SCRIPT",
        "STYLE",
        "TEXTAREA",
        "INPUT",
        "SELECT",
        "OPTION",
        "CODE",
        "PRE"
    ]);

    // Emoji detection
    const emojiRegex = /\p{Extended_Pictographic}/u;

    function codePoints(text) {
        return Array.from(text)
            .map(char => char.codePointAt(0).toString(16).toLowerCase())
            .join("-");
    }

    function removeVariationSelector(text) {
        return Array.from(text)
            .filter(char => char.codePointAt(0) !== 0xfe0f)
            .map(char => char.codePointAt(0).toString(16).toLowerCase())
            .join("-");
    }

    function isEmoji(text) {
        return emojiRegex.test(text);
    }

    function loadImage(url) {
        return new Promise(resolve => {
            const img = new Image();

            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);

            img.src = url;
        });
    }

    async function findEmojiImage(emoji) {
        const fullCode = codePoints(emoji);
        const noVariation = removeVariationSelector(emoji);

        const urls = [];
// الطريقة الأساسية
        urls.push(
            `${GITHUB_BASE}${fullCode}_3d.png`
        );

        // بدون Variation Selector
        if (noVariation !== fullCode) {
            urls.push(
                `${GITHUB_BASE}${noVariation}_3d.png`
            );
        }

        // جرب أيضًا نسخة بدون أجزاء غير أساسية
        const uniqueUrls = [...new Set(urls)];

        for (const url of uniqueUrls) {
            if (await loadImage(url)) {
                return url;
            }
        }

        return null;
    }

    function createEmojiImage(emoji, url) {
        const img = document.createElement("img");

        img.className = "realistic-emoji";
        img.src = url;
        img.alt = emoji;
        img.title = emoji;

        img.style.width = "1.2em";
        img.style.height = "1.2em";
        img.style.objectFit = "contain";
        img.style.display = "inline-block";
        img.style.verticalAlign = "-0.18em";
        img.style.margin = "0 2px";

        return img;
    }

    async function replaceTextNode(textNode) {
        const text = textNode.nodeValue;

        if (!text || !isEmoji(text)) {
            return;
        }

        const parent = textNode.parentElement;

        if (!parent || SKIP_TAGS.has(parent.tagName)) {
            return;
        }
if (parent.closest(".realistic-emoji-container")) {
            return;
        }

        const fragment = document.createDocumentFragment();

        // تقسيم النص إلى أحرف/Emoji
        const chars = Array.from(text);

        let buffer = "";

        async function flushBuffer() {
            if (buffer) {
                fragment.appendChild(
                    document.createTextNode(buffer)
                );
                buffer = "";
            }
        }

        for (let i = 0; i < chars.length; i++) {

            let emoji = chars[i];

            // دعم Emoji المركبة مثل ❤️ و 👨‍👩‍👧‍👦
            if (
                chars[i + 1] === "\u200d" &&
                chars[i + 2]
            ) {
                emoji =
                    chars[i] +
                    chars[i + 1] +
                    chars[i + 2];

                i += 2;
            }

            // نجرب Emoji الحالي
            if (isEmoji(emoji)) {

                const url = await findEmojiImage(emoji);

                if (url) {
                    await flushBuffer();

                    const img = createEmojiImage(
                        emoji,
                        url
                    );

                    fragment.appendChild(img);
                    continue;
                }
            }

            buffer += emoji;
        }
await flushBuffer();

        if (textNode.parentNode) {
            textNode.parentNode.replaceChild(
                fragment,
                textNode
            );
        }
    }

    async function scan(root) {

        if (!root) return;

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {

                        const parent =
                            node.parentElement;

                        if (!parent) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            SKIP_TAGS.has(
                                parent.tagName
                            )
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            parent.classList.contains(
                                "realistic-emoji"
                            )
) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (!isEmoji(node.nodeValue)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

        const nodes = [];

        let node;

        while (
            (node = walker.nextNode())
        ) {
            nodes.push(node);
        }

        for (const textNode of nodes) {
            await replaceTextNode(textNode);
        }
    }

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
                width: 1.2em !important;
                height: 1.2em !important;
                object-fit: contain;
                display: inline-block;
                vertical-align: -0.18em;
                margin: 0 2px;
            }
        `;
document.head.appendChild(style);
    }

    async function start() {

        addCSS();

        await scan(document.body);
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            start
        );
    } else {
        start();
    }

})();

