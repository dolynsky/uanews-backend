const useRouter = require("../hocs").default;

exports.default = useRouter({
    topicsSelector: ".view_news .title_wrapper .title a",
    nextSelector: ".arrow_next a",
    detailTitleSelector: ".page_title",
    detailDateSelector: ".date_timestamp",
    dateParser: function(dateObj) {
        return new Date(parseInt(dateObj.text()) * 1000);
    }
});
