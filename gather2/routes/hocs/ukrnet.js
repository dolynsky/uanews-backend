const Apify = require("apify");
const { Topic, checkUrlLoaded } = require("../../model");
const {
    utils: { log }
} = Apify;
exports.default = () => {
    return {
        MAIN: async ({ $, request }, { requestQueue }) => {
            /*await Apify.utils.enqueueLinks({
                $,
                requestQueue,
                selector: topicsSelector,
                baseUrl: request.loadedUrl,
                transformRequestFunction: req => {
                    req.userData.label = "DETAIL";
                    return req;
                }
            });*/

            log.debug('---------------------------');
            log.debug(JSON.parse($(this).html()));
        }
    };
};
