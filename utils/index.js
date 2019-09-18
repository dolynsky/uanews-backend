const DOMSearcher = require("./search/DOMSearcher");
const cheerio = require("cheerio");

exports.getHttpDomainName = (url="") => {
    const matches = url.match(/(https?:\/\/)(.*?)\/.+/);
    return matches && (matches[1] + matches[2]);
}

exports.getDomainName = (url="") => {
    const matches = url.match(/(https?:\/\/)(.*?)\/.+/);
    return matches && matches[2];
}

exports.trimText = (text) => {
    return text.replace(/[ \n\t]+/g, " ");
}

exports.getContentNearNode = ($node) => {
    let content = "";

    if ($node.length > 0) {
        content = exports.trimText($node.text());
        while (content.length < 500) {
            $node = $node.parent();
            content = exports.trimText($node.text());
        }
    }
    return content;
}

exports.cleanUpTitle = (title) => {
    return title.replace(/[\[\(](фото)?,? ?(в[іи]део)?[\]\)]/gi, "");
}

exports.getTextSelector = (html, text) => {
    try {
        const $ = cheerio.load(html);
        const domSearcher = new DOMSearcher({ html });
        const matches = domSearcher.find([text]);
        let selector = "";

        if (matches.length) {
            selector = matches[0].selector;
            for (let i = 1; i < matches.length; i++) {
                if (selector.length > matches[i].selector.length) {
                    selector = matches[i].selector;
                }
            }

            let nodes = $(selector);

            if (nodes.length > 0) {
                content = exports.trimText(nodes.text());
                while (content.length < 500) {
                    nodes = nodes.parent();
                    content = exports.trimText(nodes.text());
                }
            }
        }
        return selector;
    } catch (e) {
        console.log("Error: error during text selector search:", text);
        console.log(e);
        return "";
    }
}
