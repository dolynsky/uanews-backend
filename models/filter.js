const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
    text: { type: String, required: true, unique: true },
    isExclude: { type: Boolean, default: false }
});

const Filter = mongoose.model("Filter", filterSchema);

module.exports = Filter;
