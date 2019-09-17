module.exports = function(initial) {
    const DEPTH = initial ? 1 : 1;
    const regions = [
        "kiev",
        /*"ivano_frankovsk",
        "lutsk",
        "zhitomir",
        "lvov",
        "poltava",
        "ternopol",
        "hmelnitskij",
        "chernovtsy",
        "dnepropetrovsk",
        "uzhgorod",
        "kirovograd",
        "nikolaev",
        "rovno",
        "kharkov",
        "cherkassy",
        "vinnitsa",
        "zaporozhje",
        "odessa",
        "sumy",
        "herson",
        "chernigov"*/
    ];
    let urls = [];
    regions.forEach(city => {
        for (let page = 1; page <= DEPTH; page++) {
            urls.push(getUkrNetUrl(city, page));
        }
    });
    return urls;
}

function getUkrNetUrl(city, page) {
    const template = "https://www.ukr.net/news/dat/{city}/{page}";
    let url = template.replace("{city}", city);
    if (page > 1) {
        url = url.replace("{page}", String(page) + "/");
    } else {
        url = url.replace("{page}", "");
    }
    return url;
}