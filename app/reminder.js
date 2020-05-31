var firebase = require('./firebase');
var axios = require('axios');
const db = require("./models");
const Words = db.words;

module.exports.remindWord = async () => {
    console.log('remindWord.reminder', new Date())

    let devices = await getDevices()
    console.log('remindWord.devices', devices)

    let word = await this.randomWord()
    console.log('remindWord.word', word)
    
    try {
        let notif = {
            title: word.phrase,
            body:  (word.sentence ? word.sentence+'\n\n' : '')+word.translation,
            color: getTagColor(word.tags),
            id: ''+word.id
        }        
        devices.forEach(device => {
            firebase.sendMessage(device.token, notif)    
        });
        return word;

    } catch (e) {
        console.log(e)
        return e;
    }
}    

module.exports.randomWord = async () => {
    try {
        let words = await axios({
            url: process.env.API_URL+'/findtop10toremind',
            methog: 'get'
        })
        let rnd = Math.floor(Math.random() * words.data.length)
        await Words.update(
            { counter: +words.data[rnd].counter+1 }, 
            { where: { id: words.data[rnd].id } }
        );
        return words.data[rnd];
    } catch (error) {
        console.log('###Error: randomWord');
        console.error(error);
        return null
    }    
}

//get all devices from database
getDevices = async (phrase) => {    
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