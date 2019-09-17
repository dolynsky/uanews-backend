const useRouter = require("../hocs").default;

exports.default = function(props = {}) {
    return useRouter({
        topicsSelector: "",
        nextSelector: "",
        detailTitleSelector: ".news_view h1",
        detailContentSelector: "#hypercontext",
        detailDateSelector: ".datetime",
        dateParser: function(dateObj) {
            const results = dateObj.text();
            const match = results.match(/(\d+):(\d+).(\d+)\.(\d)+\.(\d+)/);
            return new Date(match[5], match[4]-1, match[3], match[1], match[2]);
        },
        ...props
    });
};
