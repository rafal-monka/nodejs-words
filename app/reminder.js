var firebase = require('./firebase');
var axios = require('axios');

module.exports.sendMessage = (token, notif) => {
    firebase.sendMessage(token, notif)
}
module.exports.remindWord = async () => {
    console.log('reminder', new Date())

    let devices = await getDevices()
    console.log('devices', devices)

    let word = await randomWord()
    console.log('wordR', word)
    
    try {
        let notif = {
            title: word.phrase,
            body:  word.sentence + '\n' +word.translation,
            color: getTagColor(word.tags)
        }        

        devices.forEach(device => {
            firebase.sendMessage(device.token, notif)    
        });
    } catch (e) {
        console.log(e)
    }
       
}    

randomWord = async () => {
    try {
        let words = await axios({
            url: process.env.API_URL,
            methog: 'get'
        })
        let rnd = Math.floor(Math.random() * words.data.length)
// console.log('randomWord.result', words.data[rnd])
        return words.data[rnd];
    } catch (error) {
        console.log('###Error: getTokens');
        console.error(error);
        return null
    }    
}

//get all devices from database
getDevices = async (phrase) => {
    console.log('process.env.API_TOKENS_URL', process.env.API_TOKENS_URL)
    try {
        let res = await axios({
            url: process.env.API_TOKENS_URL,
            methog: 'get'
        })
        return res.data
    } catch (error) {
        console.log('###Error: getTokens');
        console.error(error);
        return null
    }
}

//color
getTagColor = (tag) => { 
    console.log(tag);
    switch (tag) { 
        case 'A': return '#ff0000'; 
        case 'B': return '#fc9003'; 
        case 'C': return '#fcf003'; 
        default: return '#000000' 
    } 
}