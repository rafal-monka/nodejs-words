const FirebaseToken = require('../models/firebase-token-model')

// Create 
exports.create = (req, res, next) => {
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
        token: req.body.token,
        name: req.body.name
    }

    // Delete first (if exists)
    console.log("token-controller.findOneAndDelete...")
    FirebaseToken.findOneAndDelete({ device: obj.device })
        .then(function (result){
            //Insert token into database
            let token = new FirebaseToken(obj)
            token.save()
                .then(function (result){
                    res.status(200).json(result)
                })
                .catch (next) 

        })
        .catch(next)
}

// Find a token by device
exports.findOne = (req, res, next) => {
    const device = req.params.device
    console.log('token-controller.findOne by device', device)
    FirebaseToken.findOne({ device: device })
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

// Find all tokens/devices
exports.findAll = (req, res, next) => {
    FirebaseToken.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}
