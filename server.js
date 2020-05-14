/*
 * Words Node app
 */
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const storage = require("./app/storage.js");

const db = require("./app/models");
//@@@development = true; production = false
db.sequelize.sync(  { force: false }  ); //!!! In development, you may need to drop existing tables and re-sync database.
storage.test();

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Words application." });
});

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