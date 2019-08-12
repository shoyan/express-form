var express = require("express");
const { check, validationResult } = require("express-validator");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var admin = require("firebase-admin");

require("dotenv").config();

var serviceAccount = require(process.env.FIREBASE_JSON_PATH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://express-form.firebaseio.com"
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("ejs", ejs.renderFile);

app.get("/", (req, res) => {
  bookingData = [
    {
      date: "2019-08-10",
      dayOfWeek: "土",
      list: [
        {
          time: "10:00",
          state: null
        },
        {
          time: "11:00",
          state: null
        }
      ]
    },
    {
      date: "2019-08-11",
      dayOfWeek: "日",
      list: [
        {
          time: "10:00",
          state: "●"
        },
        {
          time: "11:00",
          state: "▲"
        }
      ]
    },
    {
      date: "2019-08-12",
      dayOfWeek: "月",
      list: [
        {
          time: "10:00",
          state: "▲"
        },
        {
          time: "11:00",
          state: "●"
        }
      ]
    },
    {
      date: "2019-08-13",
      dayOfWeek: "火",
      list: [
        {
          time: "10:00",
          state: "●"
        },
        {
          time: "11:00",
          state: "●"
        }
      ]
    },
    {
      date: "2019-08-14",
      dayOfWeek: "水",
      list: [
        {
          time: "10:00",
          state: "●"
        },
        {
          time: "11:00",
          state: "●"
        }
      ]
    },
    {
      date: "2019-08-15",
      dayOfWeek: "木",
      list: [
        {
          time: "10:00",
          state: "●"
        },
        {
          time: "11:00",
          state: "●"
        }
      ]
    },
    {
      date: "2019-08-16",
      dayOfWeek: "金",
      list: [
        {
          time: "10:00",
          state: "●"
        },
        {
          time: "11:00",
          state: "●"
        }
      ]
    }
  ];
  const times = bookingData[0].list.map(l => l.time);
  console.log(times);
  res.render("form.ejs", { title: "Express Form", bookingData, times });
});

app.get("/bookings", (req, res) => {
  var db = admin.database();
  var dataRef = db.ref("bookings");
  dataRef.once(
    "value",
    function(snapshot) {
      res.render("bookings.ejs", { title: "予約一覧", bookings: snapshot.val() });
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
});

app.post(
  "/",
  [
    check("mc")
      .not()
      .isEmpty(),
    check("name")
      .not()
      .isEmpty(),
    check("booking_date")
      .not()
      .isEmpty(),
    check("sex")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("index.ejs", { title: "Create Genre", errors: errors.array() });
      return;
    }

    var db = admin.database();
    var ref = db.ref("bookings");
    if (typeof req.body.mc === "string") {
      req.body.mc = [req.body.mc];
    }
    ref.push(req.body);

    res.render("request.ejs", {
      title: "Express Form",
      body: req.body
    });
  }
);

var server = app.listen(3000, () => {
  console.log("Server is running!");
});
