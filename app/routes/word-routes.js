module.exports = app => {
    const words = require("../controllers/word-controller.js");
    const mw = require("../controllers/word-controller-mw.js");

    var router = require("express").Router();
    
    // Get all words
    router.get("/", words.findAll);

    // Get all words to remind
    router.get("/findtop10toremind", words.findTop10ToRemind);

    // Get a word
    router.get("/find/:id", words.findOne);

    // Get a word
    router.delete("/delete/:id", words.delete);

    // Tag a word with id
    router.put("/:id", words.update);

    // Translate
    router.get("/translate/", words.translate);

    // Translate Merriam-Webster
    router.get("/translatemw/:word", mw.translate);

    // Create a new word
    router.post("/create/", words.create);

    // Get all words
    router.get("/page/", words.getAll); 

    // // One word (HTML)
    // router.get("/htmlone/:id", words.htmlone);

    // // Pages (HTML)
    // router.get("/htmlpage/:currentpage", words.htmlpage);

    app.use('/api/words', router);
  };