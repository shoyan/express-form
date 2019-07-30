var express = require('express')
var ejs = require('ejs')
var bodyParser = require("body-parser");

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('ejs', ejs.renderFile)

app.get('/', (req, res) => {
  res.render('index.ejs',
    {title: "Express Form"})
})

app.post('/', (req, res) => {
  res.render('request.ejs',
    {
      title: "Express Form",
      body: req.body 
  })
})


var server = app.listen(3000, () => {
  console.log('Server is running!')
})
