const request = require("request");
const iconv = require("iconv");

const url = "https://poglyad.te.ua/rehiony/banda-z-ternopilshhyny-dala-znaty-pro-sebe-na-kyyivshhyni.html";

request(
    {
        uri: url,
        method: "GET",
        encoding: "binary"
    },
    function(error, response, body) {
        if (error) {
            console.log(error.code);
        }
        var ctype = response.headers["content-type"];
        body = new Buffer(body, "binary");
        if (ctype.includes("charset=windows-1251")) {
            conv = new iconv.Iconv('windows-1251', "utf8");
        } else {
            conv = new iconv.Iconv("utf8", "utf8//IGNORE");
        }

        body = conv.convert(body).toString();
        console.log(body);
    }
);
