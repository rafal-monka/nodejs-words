/*
 * Words Node app
 */
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const storage = require("./app/storage.js");

const db = require("./app/models");
//@@@development = true; production = false
db.sequelize.sync(  { force: false }  ); //!!! In development, you may need to drop existing tables and re-sync database.
storage.test();

const whitelist = [
  "http://localhost:4200", 
];

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


//include public folder with SPA app
app.use(
  express.static(path.join(__dirname, 'public'))
);

app.use(cors());
//https://stackoverflow.com/questions/56181443/how-can-i-run-angular-app-on-node-server
// app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));


require("./app/routes/word-routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Node Words is running on port ${PORT}.`);
});

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