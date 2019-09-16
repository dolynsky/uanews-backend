module.exports = function(initial) {
    console.log("getURLS: initial", initial);
    return [
        ...getUkrNetUrls(initial),
        //"https://kp.ua/life/",
    ];
}

function getUkrNetUrls(initial) {
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

/*
https://kp.ua/tag/12844-novosty-khersona-proysshestvyia?fbclid=IwAR3Nk9DuMokG0Pff3EHb_JfjsShmkFl1lbiODWMCvtiv4FUQ8w1ubdFpoVE
http://cripo.com.ua/?fbclid=IwAR1erql-jkhpJnth_9kq7ntLmgBL1p_gvb9MK-7I1DyLJmg3IR-qDarBCGg
https://fakty.ua/?fbclid=IwAR2W3TvQCqnyiYMGYxXg8B2oXdDCLr4bt7Wy8p_BF-t9K7BjO6YoBu11tVM
https://gazeta.ua/?fbclid=IwAR3ZZRQ1s_TtLYbicBUY5Xk_4BeFBS0j4_zA1mbqgb_nhyTSxno9MHPdUUQ
https://dp.informator.ua/?fbclid=IwAR3qVWKu_qxz0v3qgpsvezAv9psQRNzFV9U-kNXg26ojm12_rCRVbChctmk
https://kriminal.ictv.ua/?fbclid=IwAR3MlVGpE__iI6CPlW0F5ojVhjkSu7G3vERB6VcWrjORPJH-eL06ns9ufb8
https://ntn.ua/ru/products/programs/svidok/news?fbclid=IwAR3MlVGpE__iI6CPlW0F5ojVhjkSu7G3vERB6VcWrjORPJH-eL06ns9ufb8
https://uanova.net/accidents/14889-mat-ubila-grudnogo-rebenka-smartfonom-v-harkove.html?fbclid=IwAR1ezSnlBnfqnW_adEbmtaOuVWTfJStyMauEXIs0h5RDH_ILqzObsmpZmDY
*/