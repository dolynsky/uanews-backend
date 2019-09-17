const request = require("request");
const iconv = require("iconv");

module.exports = async function(url) {
    return new Promise((resolve, reject) => {
        console.log(`Processing ${url}`);
        request(
            {
                uri: url,
                method: "GET",
                encoding: "binary",
                rejectUnauthorized: false,
                insecure: true
            },
            async function(error, response, body) {
                if (error) {
                    console.log(`ERROR: Could not get response: ${error}`);
                    reject(error);
                }
                var ctype = response.headers["content-type"];
                body = Buffer.from(body, "binary");
                if (ctype.includes("charset=windows-1251")) {
                    conv = new iconv.Iconv("windows-1251", "utf8");
                } else {
                    conv = new iconv.Iconv("utf8", "utf8//IGNORE");
                }
                body = conv.convert(body).toString();
                resolve(body);
            }
        );
    });
};
