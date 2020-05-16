const db = require("../models");
const translator = require("../translator.js");
const Words = db.words;
const Op = db.Sequelize.Op;

exports.translate = async (req, res) => {
    console.log("translate", req.query.text);
    let text = req.query.text;
    if (text === "") res.json( {message: 'No query text'})
    await translator.getTranslation(text)
        .then(translation => {
        //
        let result = translator.parse(translation.data);
        //console.log("parse", result);
        res.json({ message: result });
    })
    .catch(error => {
        console.log('ERROR-404');
        res.status(404).send('Not found');
    })
}

// Create and Save a new Catalog item
exports.create = async (req, res) => {
    console.log("create", req.body.phrase);
    // Validate request
    if (!req.body.phrase) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a word
    const word = {
             phrase: req.body.phrase,
                hws: req.body.hws,
         speechpart: req.body.speechpart,
           sentence: req.body.sentence,
        translation: req.body.translation,
           examples: req.body.examples,
               tags: "",
            counter: 0
    };

    //Save catalog item in the database
    Words.create(word)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Word."
            });
        });  

};

//get all records
exports.findAll = async (req, res) => {
    const phrase = req.query.phrase;
    var condition = phrase ? { phrase: { [Op.like]: `%${phrase}%` } } : null;
//console.log("findAll");  
    Words.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error occurred while retrieving words."
        });
      }); 
}

