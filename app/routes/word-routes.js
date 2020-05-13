module.exports = app => {
    const words = require("../controllers/word-controller.js");
  
    var router = require("express").Router();
    
    // Translate
    router.get("/translate/", words.translate);

    // Create a new word
    router.post("/create/", words.create);

    app.use('/api/words', router);
  };