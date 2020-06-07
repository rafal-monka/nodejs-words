module.exports = app => {
    const words = require("../controllers/word-controller.js");
    const mw = require("../controllers/word-controller-mw.js");

    var router = require("express").Router();
    
    // Create a new word
    router.post("/create/", words.create);

    // Find all words ###not used???
    router.get("/", words.findAll);

    // Get a word
    router.get("/find/:id", words.findOne);

    // Delete a word
    router.delete("/delete/:id", words.delete);

    // Update a word
    router.put("/:id", words.update);

    // Translate
    router.get("/translate/", words.translate);

    // Get top 10 words to remind
    router.get("/findtop10toremind", words.findTop10ToRemind);

    // Get all words (paginations)
    router.get("/page/", words.getAll); 

    // Translate Merriam-Webster
    router.get("/translatemw/:word", mw.translate);

    app.use('/api/words', router);
  };