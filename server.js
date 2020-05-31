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
const storage = require("./app/storage.js");
var reminder = require('./app/reminder');

const db = require("./app/models");
//@@@development = true; production = false
db.sequelize.sync(  { force: false }  ); //!!! In development, you may need to drop existing tables and re-sync database.
storage.test();

const whitelist = [ "http://localhost:4200" ];

const corsOptions = {
  origin: whitelist
}
const app = express(); //=all; corsOptions

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

app.use(cors());

require("./app/routes/word-routes")(app);
require("./app/routes/token-routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Node Words is running on port ${PORT}.`);
});

console.log('process.env.DB_HOST', process.env.DB_HOST, process.env.DB_PORT);
console.log('process.env.DB_DATABASE', process.env.DB_DATABASE);
console.log('process.env.DB_USER', process.env.DB_USER);
console.log('process.env.API_TOKENS_URL', process.env.API_TOKENS_URL)

// var rule = new schedule.RecurrenceRule();
cronParams = "0 0 4-20 * * *"; //every hour between 6am to 22pm GMT+2
console.log('schedule', cronParams)
//#A/a "0 */15 4-20 * * *" every 15 minutes
reminder.remindWord(); 
// var j = schedule.scheduleJob(cronParams, function(){ 
//   reminder.remindWord()
// });


//-----------------------------------------------------------------------------------------------------------
//reminder
//reminder.remindWord();
// reminder.randomWord().then(res => {
//   console.log('server.randomWord().word', res)
// })


// //1
// let userId = '100357139298762566358'; 
// let additionalClaims = {
//   premiumAccount: false
// };
// if (false) firebase.admin.auth().createCustomToken(userId, additionalClaims)
//   .then(function(customToken) {
//     // Send token back to client
//     console.log('customToken', customToken)

//     const message = {
//       notification: {
//         title: 'SPECOZ Offers1',
//         body: 'body_data'
//       },
//       data: {
//         score: 'Test', time: 'Test'
//       },
//       token: customToken
//     }

//     firebase.admin.messaging().send(message)
//       .then(res => {
//         console.log('message sent', res);
//       })
//       .catch((error) => {
//         console.log('Error sending message:', error);
//       });
    

//   })
//   .catch(function(error) {
//     console.log('Error creating custom token:', error);
//   });

// //2
// const sendNotifications = (data) => {
//   const dataString = JSON.stringify(data)
//   const headers = {
//       'Authorization': 'key=AAAAIj0-C5M:APA91bGH3d1MF6JiQt-e2wRY4YZdjJC4S4i-LY-NwOr9bJPn9ARz0tUO5au5GZsL62WNANs0IZzhSDzNsf1gNNIOABe3xs1H_lDFgVqoQ6osSM8txlwkyKNzY9bREJtTxEvgnepLfwt3',
//       'Content-Type': 'application/json',
//       'Content-Length': dataString.length
//   }
//   const options = {
//       uri: 'https://fcm.googleapis.com/fcm/send',
//       method: 'POST',
//       headers: headers,
//       json: data
//   }

//   request(options, function (err, res, body) {
//       if (err) throw err
//       else console.log(body)
//       console.log('...')
//   })
// }

// const sendToTopics = (msg, title, topic) => {
//   const data = {
//       to: "__TO__",
//       data: {
//           body: msg,
//           title: title
//       },
//       notification: {
//         title: 'SPECOZ Offers1',
//         body: 'body_data'
//     }
//   }
//   // sendNotifications(data)
// }

// sendToTopics('Go!','Title','Topic'); 


// 
// app.get("/", (req, res) => {
//     let text = req.query.text;
//     // translator.translate(text)
//     //     .then(translation => {
//     //         //console.log("get", translation.data);
//     //         let result = translator.parse(translation.data);
//     //         //console.log("parse", result);
//     //         res.json({ message: result });
//     //     })
//     //     .catch(error => {
//     //         //console.log('ERROR-404');
//     //         console.log(error);
//     //         res.json({ message: "ERROR-404" });
//     //     });;        
// });

// translator.translate("yam"); 