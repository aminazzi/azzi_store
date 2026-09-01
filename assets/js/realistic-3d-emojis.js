(() => {
    "use strict";

    const EMOJI_REGEX =
        /(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*(?:\uFE0F)?|\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3)/gu;

    const TWEMOJI =
        "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/";

    function getCodepoints(emoji) {
        return [...emoji]
            .map(char =>
                char.codePointAt(0)
                    .toString(16)
                    .toLowerCase()
            )
            .filter(code => code !== "fe0e")
            .join("-");
    }

    function createEmoji(emoji) {
        const img = document.createElement("img");

        img.src = `${TWEMOJI}${getCodepoints(emoji)}.svg`;
        img.alt = emoji;

        img.className = "realistic-emoji";

        img.loading = "lazy";
        img.decoding = "async";

        img.draggable = false;

        return img;
    }

    function replaceTextNode(node) {

        const text = node.nodeValue;

        if (!text) return;

        EMOJI_REGEX.lastIndex = 0;

        if (!EMOJI_REGEX.test(text)) return;

        EMOJI_REGEX.lastIndex = 0;

        const fragment =
            document.createDocumentFragment();

        let lastIndex = 0;
        let match;

        while (
            (match = EMOJI_REGEX.exec(text)) !== null
) {

            const emoji = match[0];

            if (match.index > lastIndex) {

                fragment.appendChild(
                    document.createTextNode(
                        text.slice(
                            lastIndex,
                            match.index
                        )
                    )
                );
            }

            fragment.appendChild(
                createEmoji(emoji)
            );

            lastIndex =
                match.index + emoji.length;
        }

        if (lastIndex < text.length) {

            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex)
                )
            );
        }

        node.parentNode.replaceChild(
            fragment,
            node
        );
    }
function scan(root) {

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

                        const tag =
                            parent.tagName;

                        if (
                            tag === "SCRIPT" ||
                            tag === "STYLE" ||
                            tag === "NOSCRIPT" ||
                            tag === "TEXTAREA" ||
                            tag === "INPUT"
                        ) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            parent.closest(
                                ".realistic-emoji"
                            )
                        ) {
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

        nodes.forEach(
            replaceTextNode
        );
    }

    function start() {

        scan(document.body);

        const observer =
            new MutationObserver(
                mutations => {

                    mutations.forEach(
                        mutation => {

                            mutation.addedNodes
                                .forEach(node => {

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
                                });
                        }
                    );
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

