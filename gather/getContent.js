const axios = require("axios");
const cheerio = require("cheerio");
const calcContentMatches = require("./calcContentMatches");
const https = require("https");

const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = async function(topic) {
    await axios
        .get(encodeURI(topic.url), { httpsAgent: agent })
        .then(res => {
            const $ = cheerio.load(res.data);
            console.log(`Gathering content for: ${topic.title}. URL: ${topic.url}`);
            const title = topic.title.replace(
                /[\[\(](фото)?,? ?(в[іи]део)?[\]\)]/gi,
                ""
            );
            let content = "";

            console.log($('h1').text())

            const selectors = [
                { name: "article", selector: "article", exact: true },
                {
                    name: "h1/h2",
                    selector: `h1:icontains("${title}"),h2:icontains("${title}")`
                },
                {
                    name: "class title",
                    selector: `body *[class*="title"]:contains("${title}")`
                }
            ];

            for (const { name, selector, exact } of selectors) {
                let nodes = $(selector);
                if (nodes.length > 0) {
                    content = trimText(nodes.text());
                    if (!exact) {
                        while (content.length < 500) {
                            nodes = nodes.parent();
                            content = trimText(nodes.text());
                        }
                    } else {
                        content = trimText(nodes.text());
                        if (content < 500) {
                            content = "";
                        }
                    }
                }
                if (content.length >= 500) {
                    console.log(`getContent: ${name} found // URL: ${topic.url}`);
                    break;
                } else {
                    console.log(`getContent: ${name} not found // URL: ${topic.url}`);
                }
            }

            if (content) {
                console.log(`Content length: ${content.length}`);
            } else {
                console.log(`Could not find content: ${topic.url}`);
            }

            topic.content = content;
        })
        .catch(e => {
            console.log(`${e} // URL: ${topic.url}`);

        })
        .finally(() => {
            topic
                .save()
                .then(() => {
                    if (topic.content) {
                        calcContentMatches(topic);
                    }
                })
                .catch(() => {});
        });
};

function trimText(text) {
    return text.replace(/[ \n\t]+/g, " ");
}

function get500charsAroundNode(nodes) {
    let content = trimText(nodes.text());
    while (content.length < 500) {
        nodes = nodes.parent();
        content = trimText(nodes.text());
    }
    return content;
}
