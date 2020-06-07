/*
 * Words Node app
 */
require('dotenv').config();
const express = require("express");
request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const schedule = require('node-schedule');
//const storage = require("./app/storage.js");
const initDatabase = require('./config/database')
var reminder = require('./app/reminder');

const app = express(); //=all; corsOptions
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", (req, res) => {
    res.json({ message: "Welcome to Words application." });
});

app.get("/remind", async (req, res) => {
  let word = await reminder.remindWord();
  res.json({ message: word });
});


//include public folder with SPA app
app.use(
  express.static(path.join(__dirname, 'public'))
);


require("./app/routes/word-routes")(app);
require("./app/routes/token-routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Node Words is running on port ${PORT}.`);
});

//init database
initDatabase()

//schedule
// var rule = new schedule.RecurrenceRule();
cronParams = "0 0 4-20 * * *"; //every hour between 6am to 22pm GMT+2
console.log('schedule', cronParams)
//#A/a "0 */15 4-20 * * *" every 15 minutes
reminder.remindWord(); 
var j = schedule.scheduleJob(cronParams, function(){ 
  reminder.remindWord()
});

module.exports = app; // for testing