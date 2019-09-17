const vinbazar = require("./sites/vinbazar").default;
const mywincomua = require("./sites/mywincomua").default;
const tsnua = require("./sites/tsnua").default;
const urainformcom = require("./sites/urainformcom").default;
const defaultRouter = require("./defaultRouter").default;

const routers = {
    "vinbazar.com": vinbazar,
    "www.myvin.com.ua": mywincomua,
    "tsn.ua": tsnua,
    "ura-inform.com": urainformcom,
}

const defaultR = () => {
    return defaultRouter;
}

exports.default = function(domain) {
    let router;
    router  = routers[domain];
    if (!router) {
        router = defaultR;
    }
    return router;
};