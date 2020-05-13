var axios = require('axios');
var DomParser = require('dom-parser');

exports.getTranslation = (phrase) => {
    const CONST_URL = "https://www.diki.pl/slownik-angielskiego?q=";
    try {
        return axios({
            url: CONST_URL,
            methog: 'get',
            params: {
                q: phrase
            }
        })
    } catch (error) {
        console.log('###Error: getTranslation');
        console.error(error);
    }
}

exports.parse = (html) => {    
    var parser = new DomParser();
    var dom = parser.parseFromString(html);
    let translations = [];
    let dE = dom.getElementsByClassName('foreignToNativeMeanings')[0];   
    if (dE) {
        let ts = dE.getElementsByClassName('plainLink');
        if (ts) ts.forEach(element => {
            translations.push(element.innerHTML);    
        });
    }
    return translations;
}


// exports.translate = async (text) => {
//     return await getTranslation(text);
// }

// const translateXXX = async (text) => {
//     await getTranslation(text)
//         .then(translation => {
//         //console.log("get", translation.data);
//         let result = parse(translation.data);
//         //console.log("parse", result);
//         res.json({ message: result });
//     })
//     .catch(error => {
//         //console.log('ERROR-404');
//         console.log(error);
//         res.json({ message: "ERROR-404" });
//     })
// }