const pagination = require("paginate-info") //https://dev.to/mcdavid95/how-to-paginate-your-nodejs-apis-1ag3
const Word = require('../models/word-model')
const translator = require("../translator.js")
const utils = require("../utils.js");

//translate  text
exports.translate = async (req, res) => {
    console.log("translate", req.query.text);
    let text = req.query.text;
    if (text === "") res.json( {message: 'No query text'})
    await translator.getTranslation(text)
        .then(translation => {
            let result = translator.parse(translation.data);
            res.json({ message: result });
        })
        .catch(error => {
            console.log('ERROR-404');
            res.status(404).send('Not found');
        })
}

//create new word
exports.create = (req, res, next) => {
    console.log("create", req.body.phrase)
    // Validate request
    if (!req.body.phrase) {
        res.status(400).send( {message: "Phrase can not be empty!"} );
        return;
    }

    // Create a word
    const obj = {
             phrase: req.body.phrase,
                hws: req.body.hws,
         speechpart: req.body.speechpart,
           sentence: req.body.sentence,
        translation: req.body.translation,
           examples: req.body.examples,
               tags: req.body.tags,
            counter: 0
    }
    let word = new Word(obj)
    word.save()
        .then(function (result){
            res.status(200).json(result)
        })
        .catch (next)          
}

//get all records
exports.findAll = (req, res, next) => {
    console.log('word-controller.findAll...')
    Word.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next)  
}

//get top 10 records (to random) to remind
exports.findTop10ToRemind = async (req, res, next) => {
    try {        
        let words = []
        let docs = await Word.find({ counter: { $gte: 0} })
        docs.forEach(doc => {
            let word = {
                _id : doc._id, 
                counter: doc.counter, 
                tags: doc.tags, 
                phrase: doc.phrase, 
                sentence: doc.sentence, 
                translation: doc.translation,
                sign: Math.sign(doc.counter),
                severity: Math.pow(2, 'ABCD'.length-'ABCD'.indexOf(doc.tags)) * (doc.counter+1)
            }
            words.push(word)
        })
        words = words.sort((a, b) => {
            if (a.counter === b.counter) { 
                return b.severity - a.severity //DESC
            } else {
                return a.counter > b.counter ? 1 : -1; //ASC
            }            
        })
        res.json(words.slice(0, 10))
    } catch(err) {
        next(err)
    }     
}

exports.getAll = async (req, res) => {
    console.log('word-controller.getAll')
    const {
      query: {
        currentPage, pageSize, search
      }
    } = req;
    console.log(req.query);
    console.log(search)
    //var searchText = "";
    var regex = new RegExp(["", search, ""].join(""), "i");

    const count = await Word.countDocuments({phrase: regex}) //estimatedDocumentCount()
    // console.log('word-controller.count', count)
    // console.log('word-controller. (currentPage, pageSize)', currentPage, pageSize)
    const { limit, offset } = pagination.calculateLimitAndOffset(currentPage, pageSize)
    // console.log('word-controller. (limit, offset)', limit, offset)

    const rows = await Word.find({phrase: regex})
        .limit(limit)
        .skip(offset)
    const meta = pagination.paginate(currentPage, count, rows, pageSize)      
    return res.status(200).send( { message: 'success', rows: rows, meta: meta } )
}

//Find a single Word
exports.findOne = (req, res, next) => {
    const id = req.params.id
    console.log('word-controller.findOne', id);
    Word.findById(id)
        .then(function (result) {
            res.json(result)
        })
        .catch (next)    
}

//Update a Word
exports.update = (req, res, next) => {
    const id = req.params.id;
    Word.findByIdAndUpdate(id, req.body, {new: true})
        .then(function (result) {
            res.json(result)
        })
        .catch (next)  
};

//Delete a Word 
exports.delete = (req, res, next) => {
    const id = req.params.id;
    console.log('delete: id', id)
    Word.deleteOne({ _id: id })
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}


//-------------------------------------------------
// "SELECT sign(counter) AS sign, "+ 
//        "POWER(2, LENGTH('ABCD')-INSTR('ABCD', tags)) * (counter+1) AS severity, "+ 
//        "id, counter, tags, phrase, sentence, translation "+
//   "FROM words t "+
//  "WHERE counter >= 0 "+ 
//  "ORDER BY sign ASC, severity DESC, id ASC "+
//  "LIMIT 10"