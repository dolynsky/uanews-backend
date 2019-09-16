const vinbazar = require("./sites/vinbazar").default;
const mywincomua = require("./sites/mywincomua").default;

const routers = {
    "vinbazar.com": vinbazar,
    "www.myvin.com.ua": mywincomua,
}

exports.default = routers;