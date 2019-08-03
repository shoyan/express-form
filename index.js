var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var admin = require("firebase-admin");
require("dotenv").config();

var serviceAccount = require(process.env.FIREBASE_JSON_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://express-form.firebaseio.com"
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.engine("ejs", ejs.renderFile);

app.get("/", (req, res) => {
  res.render("index.ejs", { title: "Express Form" });
});

app.post("/", (req, res) => {
  var db = admin.database();
  var ref = db.ref("bookings");
  ref.push(JSON.stringify(req.body));

  res.render("request.ejs", {
    title: "Express Form",
    body: req.body
  });
});

var server = app.listen(3000, () => {
  console.log("Server is running!");
});
