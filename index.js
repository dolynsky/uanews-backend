const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const topicRoutes = require("./routes/topics");
const gather = require("./gather");
const rebuildRating = require("./gather/rebuildRating");

app.use(morgan("tiny"));
app.use(cors());
app.use("/api/topics", topicRoutes);

app.use(function(req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
});

app.listen(3001, function() {
    console.log("Server starting on port 3001");
});

cron.schedule("* * * * *", gather);

//gather();
//rebuildRating();