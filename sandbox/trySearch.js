const axios = require("axios");
const DOMSearcher = require("../gather2/search/DOMSearcher");

const url = "https://openkyiv.info/ru/news/na-mostu-snova-otkryli-steklyannye-sekcii";

axios.get(url).then(res => {
    const ds = new DOMSearcher({html: res.data});
    //console.log("res.data:", res.data.length);
    const result = ds.find(["На велопешеходном мосту снова открыли стеклянные секции (видео)"]);
    console.log(result);
});
