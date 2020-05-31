const pagination = require("paginate-info");
var axios = require('axios');
require('dotenv').config();
const db = require("../models");
const dbConfig = require("../config/db-config");
const translator = require("../translator.js");

const Words = db.words;
const Op = db.Sequelize.Op;


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

//get top 10 records (to random) to remind
exports.findTop10ToRemind = async (req, res) => {
  console.log('findTop10ToRemind');
  try {
      let pool = dbConfig.getConnectionPool();         
      pool.query(
        "SELECT sign(counter) AS sign, "+ 
               "POWER(2, LENGTH('ABCD')-INSTR('ABCD', tags)) * (counter+1) AS severity, "+ 
               "id, counter, tags, phrase "+
          "FROM words t "+
         "WHERE counter >= 0 "+ 
         "ORDER BY sign ASC, severity DESC, id ASC "+
         "LIMIT 10", 
        [], function(error, data, fields) {
            if (error) throw error;    
            const results = JSON.parse(JSON.stringify(data));
            res.send(results);         
        });
  } catch (e) {
      console.log(e.toString());
  } 
}

//https://dev.to/mcdavid95/how-to-paginate-your-nodejs-apis-1ag3
exports.getAll = async (req, res) => {
    // try {
      const {
        query: {
          currentPage, pageSize
        }
      } = req;
      console.log(req.query);
      const { limit, offset } = pagination.calculateLimitAndOffset(currentPage, pageSize);
      const { rows, count } = await Words.findAndCountAll({ limit, offset});
      console.log(currentPage, count, pageSize);
      const meta = pagination.paginate(currentPage, count, rows, pageSize);
      return res.status(200).send( { message: 'success', rows: rows, meta: meta } );
    // } catch (error) {
    //   return res.status(500).send( {message: 'error', text: error} );
    // }
  };

// Find a single Word with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Words.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Word with id=" + id
      });
    });  
};

// Update a Word by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
console.log('update');
  Words.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Word was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Word with id=${id}. Maybe Word was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Word with id=" + id
      });
    });  
};

// Delete a Word with the specified id in the request
exports.delete = (req, res) => {
  //console.log("delete (Item)/"+req.params.id);
  const id = req.params.id;

  Words.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Word was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Word with id=${id}. Maybe Word was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Word with id=" + id
      });
    });  
};

// exports.htmlone = async (req, res) => {
//   const CONST_URL = process.env.API_URL;
//   try {
//       console.log("htmlone", req.params.id);
//       axios({
//           url: CONST_URL+"/find/"+req.params.id,
//           methog: 'get'
//       }).then(response => {
//         console.log("response");
//         // console.log(response.data);
//         let data = 
//           "<html><body><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />"
//           +"<button onclick=\"history.back()\">Back</button>"
//           +"<h1>"+response.data.phrase+"</h1>"
//           +"<h2>"+response.data.sentence+"</h2>"
//           +"<pre>"
//           +JSON.stringify(response.data,null,2)
//           +"<pre></body></html>"; 
//         res.writeHead(200, {
//             'Content-Type': 'text/html'
//         });
//         res.write(data);
//         res.end();
//       }).catch(error => {
//           console.error('#1', error);  
//           res.status(500).send({
//               message: error
//             });
//       })

//   } catch (error) {
//       console.error('#2', error);
//       res.status(500).send({
//         message: error
//       });
//   }
// }


// exports.htmlpage = async (req, res) => {
//   const CONST_URL = process.env.API_URL;
//   const CONST_PAGE_SIZE = process.env.API_PAGE_SIZE;
//   function navStr(page) {
//     return "/api/words/htmlpage/"+page;
//   }
//   try {
//       console.log("htmlpage", req.params.currentpage);
//       axios({
//           url: CONST_URL+"/page/",
//           methog: 'get',
//           params: {
//             pageSize: CONST_PAGE_SIZE,
//             currentPage: req.params.currentpage
//           }
//       }).then(response => {
//         console.log("response");
//         // console.log(response.data);
//         let str = "";
//         response.data.rows.forEach(element => {
//             str += "<li><a href=\"/api/words/htmlone/"+element.id+"\">"+element.phrase+"</a></li>";
//         })

//         let data = 
//           "<html><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />"
//           +"<body>"
//           +"<h4>"+CONST_URL+"</h4>"
//           +(req.params.currentpage>1 ?"<button onclick=\"window.location='"+navStr(+req.params.currentpage-1)+"'\">&lt;</button>&nbsp;&nbsp;&nbsp;": "")
//           +"<button onclick=\"window.location='"+navStr(+req.params.currentpage+1)+"'\">&gt;</button>"
//           +"<ul>"+str+"</ul>"
//           +"<pre>"
//           +JSON.stringify(response.data,null,2)
//           +"<pre></body></html>"; 
//         res.writeHead(200, {
//             'Content-Type': 'text/html'
//         });
//         res.write(data);
//         res.end();
//       }).catch(error => {
//           console.error('#1', error);  
//           res.status(500).send({
//               message: error
//             });
//       })

//   } catch (error) {
//       console.error('#2', error);
//       res.status(500).send({
//         message: error
//       });
//   }

// }