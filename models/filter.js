const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/uanews-app");
//mongoose.set("debug", true);
mongoose.Promise = Promise;

const filterSchema = new mongoose.Schema({
    text: { type: String, required: true, unique: true }
});

const Filter = mongoose.model("Filter", filterSchema);

module.exports = Filter;
