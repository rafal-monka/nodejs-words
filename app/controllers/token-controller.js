const FirebaseToken = require('../models/firebase-token-model')

// Create 
exports.create = async (req, res) => {
    console.log("token-controller.create (device, token)", req.body.device, req.body.token);
    // Validate request
    if (!req.body.device && !req.body.token) {
        res.status(400).send({
            message: "Device and token can not be empty!"
        });
        return
    }

    // Create record
    const obj = {
        device: req.body.device,
        token: req.body.token
    }

    // Delete first (if exists)
    console.log("token-controller.findOneAndDelete...")
    FirebaseToken.findOneAndDelete({ device: obj.device }, function (err) {
        if (err) console.error(err)
        console.log("token-controller.findOneAndDelete success")

        //Insert token into database
        console.log("token-controller.save1...")
        let token = new FirebaseToken(obj)
        console.log("token-controller.save2...")
        token.save(function (err) {
            console.log("token-controller.save3...")
            if (err) {
                console.error(err) //return handleError(err); //###
                res.json(err)
            }
            console.log("token-controller.save success", token)
            res.json(token)
        }) 
    })          
}

// Find a token by device
exports.findOne = (req, res) => {
    const device = req.params.device
    console.log('token-controller.findOne by device', device)
    FirebaseToken.findOne({ device: device }, function (err, token) {
        if (err) console.error(err)
        console.log("token-controller.findOne success");
        res.json(token)   
    })   
}

// Find all tokens/devices
exports.findAll = (req, res) => {
  FirebaseToken.find({}, function (err, docs) {
      if (err) console.error(err)
      res.json(docs)        
  })   
}
