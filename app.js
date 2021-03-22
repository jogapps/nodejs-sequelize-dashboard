// package imports
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const parameters = require("./config/params");
const webParameters = require("./config/web_params.json");

// routes includes
const webRoute = require("./routes/web");

// imports initalization
const app = express();

app.locals = webParameters;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// set up public folder
app.use(express.static(path.join(__dirname, "public")));
// Static Files
// dashboard 
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));

// routes

app.use("/", webRoute);

// 404 not found
app.use(function (req, res) {
    res.status(404).render('base/404');
});


// server
const PORT = parameters.LOCAL_PORT || process.env.PORT;
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});