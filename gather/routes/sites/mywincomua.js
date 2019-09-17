const useRouter = require("../hocs").default;
const Apify = require('apify');
const {
    utils: { log },
} = Apify;

exports.default = useRouter({
    topicsSelector: ".bg-base .entry-title a",
    nextSelector: ".page-item.active + .page-item a",
    detailTitleSelector: ".page-title",
    detailDateSelector: "time",
    dateParser: function(dateObj) {
        return new Date(dateObj.attr('datetime'));
    }
});
