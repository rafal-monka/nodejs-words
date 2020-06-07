const pagination = require("paginate-info");
const Word = require('../models/word-model')
const translator = require("../translator.js");

//translate  text
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

//create new word
exports.create = async (req, res) => {
    console.log("create", req.body.phrase)
    // Validate request
    if (!req.body.phrase) {
        res.status(400).send({
            message: "Phrase can not be empty!"
        });
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
               tags: "",
            counter: 0
    }
    let word = new Word(obj)
    word.save(function (err) {
        if (err) {
            console.error(err) //return handleError(err); //###
            res.json(err)
        }
        res.json(word)
    }) 
}

//get all records
exports.findAll = async (req, res) => {
    Word.find({}, function (err, docs) {
        if (err) console.error(err)
        res.json(docs)        
    }) 
}

//get top 10 records (to random) to remind
//###...
exports.findTop10ToRemind = async (req, res) => {
    console.log('word-controller.findTop10ToRemind')
  
    Word.find({counter: { $gte: 0} }, function (err, docs) {
        if (err) console.error(err)
        let words = []
        docs.forEach(doc => {
            let word = {
                _id : doc._id, 
                counter: doc.counter, 
                tags: doc.tags, 
                phrase: doc.phrase, 
                sentence: doc.sentence, 
                translation: doc.translation,
                sign: Math.sign(doc.counter),
                severity : Math.pow(2, 'ABCD'.length-'ABCD'.indexOf(doc.tags)) * (doc.counter+1)
            }
            words.push(word)
        })
        words = words.sort((a, b) => {
          if (a.counter === b.counter) { //ASC
            return b.severity - a.severity
          } else {
            return a.counter > b.counter ? 1 : -1;
          }            
        })
        //console.log('words', words)
        res.json(words)        
    })

        // "SELECT sign(counter) AS sign, "+ 
        //        "POWER(2, LENGTH('ABCD')-INSTR('ABCD', tags)) * (counter+1) AS severity, "+ 
        //        "id, counter, tags, phrase, sentence, translation "+
        //   "FROM words t "+
        //  "WHERE counter >= 0 "+ 
        //  "ORDER BY sign ASC, severity DESC, id ASC "+
        //  "LIMIT 10"
}

//https://dev.to/mcdavid95/how-to-paginate-your-nodejs-apis-1ag3
exports.getAll = async (req, res) => {
    console.log('word-controller.getAll')
    const {
      query: {
        currentPage, pageSize
      }
    } = req;
    try {
        console.log(req.query);
        const count = await Word.estimatedDocumentCount()
        console.log('word-controller.count', count)
        console.log('word-controller. (currentPage, pageSize)', currentPage, pageSize)
        const { limit, offset } = pagination.calculateLimitAndOffset(currentPage, pageSize)
        console.log('word-controller. (limit, offset)', limit, offset)
        const rows = await Word.find({})
            .limit(limit)
            .skip(offset)
        const meta = pagination.paginate(currentPage, count, rows, pageSize)      
        return res.status(200).send( { message: 'success', rows: rows, meta: meta } )
    } catch (error) {
        return res.status(500).send(error)
    }
}

//Find a single Word
exports.findOne = (req, res) => {
    const id = req.params.id
    console.log('word-controller.findOne', id);
    Word.findById(id, function (err, doc) {
        if (err) console.error(err)
        res.send(doc)
    })
}

//Update a Word
exports.update = (req, res) => {
    const id = req.params.id;
    console.log('word-controller.update', id);
    Word.findByIdAndUpdate(id, req.body, function (err) {
        if (err) console.error(err)
        console.log('Word.findByIdAndUpdate success')
        res.status(200).send() 
    })    
};

//Delete a Word 
exports.delete = (req, res) => {
    const id = req.params.id;
    console.log('word-controller.delete', id)

    Word.deleteOne({ _id: id }, function (err) {
        if (err) console.error(err)
        console.log('Word.deleteOne success')
        res.status(200).send() 
    })  
}
