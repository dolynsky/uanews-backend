const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    url: { type: String, required: true },
    partner: String,
    region: String,
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, default: "" },
    titleMatches: { type: Number, default: 0 },
    contentMatches: { type: Number, default: 0 },
    isExcluded: { type: Boolean, default: false },
    isLoaded: { type: Boolean, default: false },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
