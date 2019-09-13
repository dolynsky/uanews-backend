const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/uanews-app");
//mongoose.set("debug", true);
mongoose.Promise = Promise;

const topicSchema = new mongoose.Schema({
    topicID: { type: Number, required: true, unique: true },
    url: { type: String, required: true },
    partner: String,
    region: String,
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, default: "" },
    titleMatches: { type: Number, default: 0 },
    contentMatches: { type: Number, default: 0 },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
