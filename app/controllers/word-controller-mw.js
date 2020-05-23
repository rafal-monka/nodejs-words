var axios = require('axios');
require('dotenv').config();

const MW_URL = "https://dictionaryapi.com/api/v3/references/collegiate/json";
const MW_API_KEY = "333b297d-ee78-4c3e-9882-0f3fad0ca076";


const getTranslation = (phrase) => {
  const DICT_EN_URL = MW_URL+"/"+phrase;
  try {
      return axios({
          url: DICT_EN_URL,
          methog: 'get',
          params: {
              key: MW_API_KEY
          }
      })
  } catch (error) {
      console.log('###Error: getTranslationMW');
      console.error(error);
  }
}

exports.translate = async (req, res) => {
  console.log("translate (MW)", req.params.word);
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

