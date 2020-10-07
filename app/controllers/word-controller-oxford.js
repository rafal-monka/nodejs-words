var axios = require('axios');
require('dotenv').config();

const OXFORD_URL = "https://od-api.oxforddictionaries.com/api/v2"
const OXFORD_API_KEY = "1deefa9368667e815345f5c008c84bfa"
const OXFORD_APP_ID = "05ab0e54"

const getTranslation = (phrase) => {
  const DICT_EN_URL = OXFORD_URL+"/entries/en-gb/"+phrase;
  try {
      return axios({
          url: DICT_EN_URL,
          methog: 'get',
          params: {
              app_id: OXFORD_APP_ID,
              app_key: OXFORD_API_KEY
          }
      })
  } catch (error) {
      console.log('###Error: getTranslationMW');
      console.error(error);
  }
}

exports.translate = async (req, res) => {
  console.log("translate (OXFORD)", req.params.word);
  let text = req.params.word;
  if (text === "") res.json( {message: 'No query text'})
  await getTranslation(text)
      .then(translation => {
      //
      //let result = translator.parse(translation.data);
      console.log("shortdef", translation.data[0].shortdef);
      console.log("quotes", translation.data[0].quotes);      
      res.json( translation.data );
  })
  .catch(error => {
      console.log('ERROR-404');
      res.status(404).send('Not found');
  })
}

