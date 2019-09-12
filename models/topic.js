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
    rating: { type: Number, default: 0 },
    ratingAvailable: { type: Boolean, default: false }
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
