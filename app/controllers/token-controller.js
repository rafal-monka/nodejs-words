var axios = require('axios');
require('dotenv').config();
const db = require("../models");

const Tokens = db.tokens;
const Op = db.Sequelize.Op;

// Create 
exports.create = async (req, res) => {
    console.log("create", req.body.phrase);
    // Validate request
    if (!req.body.device && !req.body.token) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create
    const token = {
        device: req.body.device,
        token: req.body.token
    };

    //First delete (if exists)
    Tokens.destroy({
        where: { device: token.device }
      })
        .then(num => {
          if (num == 1) {
            console.log( "Deleted successfully!" + token.device);
          } else {
            console.log( `Cannot delete with token.device=${token.device}. Maybe Item was not found!`);
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete with id=" + token.device
          });
        }); 

    //Insert into the database
    Tokens.create(token)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating token."
            });
        });  

};


// Find a single 
exports.findOne = (req, res) => {
    const device = req.params.device;

    Tokens.findOne({
        where: {
            device: device
        }
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving device=" + device
      });
    });  
};



exports.findAll = (req, res) => {
    Tokens.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving records."
        });
      });  
};


// Update 
exports.update = (req, res) => {
  const id = req.params.id;
console.log('update');
  Tokens.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update with id=${id}. Maybe was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating with id=" + id
      });
    });  
};
