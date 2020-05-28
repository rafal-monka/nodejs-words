module.exports = app => {
    const tokens = require("../controllers/token-controller.js");

    var router = require("express").Router();

    // Get all devices
    router.get("/", tokens.findAll);

    // Get a device token
    router.get("/:device", tokens.findOne);

    // Create new
    router.post("/create/", tokens.create);

     app.use('/api/tokens', router);
  };