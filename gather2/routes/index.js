const vinbazar = require("./sites/vinbazar").default;
const mywincomua = require("./sites/mywincomua").default;
const defaultRouter = require("./defaultRouter").default;

const routers = {
    "vinbazar.com": vinbazar,
    "www.myvin.com.ua": mywincomua,
}

exports.default = function(domain) {
    let router;
    router  = routers[domain];
    if (!router) {
        router = defaultRouter;
    }
    return router;
};