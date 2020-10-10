/*
 * Words Node app
 */
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const schedule = require('node-schedule');
const initDatabase = require('./config/database')
const reminder = require('./app/reminder');
  
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

//routes
require("./app/routes/word-routes")(app);
require("./app/routes/token-routes")(app);
// custom 404 page
app.use( (req, res) => res.json(
    {status: 'fail', code: '404', msg: 'Page not found', request: req.method+':'+req.path}) 
)
// custom 500 page
app.use( (err, req, res, next) => res.json(
    {status: 'fail', code: '500', msg: err, request: req.method+':'+req.path}) 
)

//start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Node Words is running on port ${PORT}.`);
});

//init database
initDatabase()

// reminder.remindWord(); 
// return

//schedule word reminder
// cronParams = "0 0 4-20 * * *"; //every hour between 6am to 22pm GMT+2
// console.log('schedule', cronParams)
// var j = schedule.scheduleJob(cronParams, function(){ 
//     reminder.remindWord()
// });

module.exports = app; // for testing


//--------------------------------------------------------------------
// var rule = new schedule.RecurrenceRule();
//#A/a "0 */15 4-20 * * *" every 15 minutes
