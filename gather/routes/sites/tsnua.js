const useRouter = require("../hocs").default;

exports.default = function(props = {}) {
    return useRouter({
        topicsSelector: "",
        nextSelector: "",
        detailTitleSelector: "h1.c-post-title",
        detailContentSelector: ".c-main",
        detailDateSelector: ".o-jumbotron .c-post-time",
        dateParser: function(dateObj) {
            return new Date(dateObj.attr("datetime"));
        },
        ...props
    });
};
