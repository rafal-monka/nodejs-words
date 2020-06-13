var firebase = require('./firebase');
var axios = require('axios');
const Word = require('./models/word-model')

module.exports.remindWord = async () => {
    console.log('remindWord.reminder', new Date())
    try {
        let devices = await getDevices()
        console.log('remindWord.devices', devices)

        if (devices === null || devices.length === 0) {
            throw new Error('No devices found')
        }

        let word = await this.randomWord()
        console.log('remindWord.word', word)
        if (word === null) {
            throw new Error('No words found')
        }

        let notif = {
            title: word.phrase+' ['+word.counter+']',
            body:  (word.sentence ? word.sentence+'\n\n' : '')+word.translation,
            color: getTagColor(word.tags),
            _id: ''+word._id
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
    const url = 'http://localhost:'+process.env.PORT+'/api/words/findtop10toremind'
    //console.log('reminder.randomWord:url', url)
    try {
        let words = await axios({
            url: url, 
            methog: 'get'
        })
        console.log('words.data.length',words.data.length)
        if (words.data.status === 'fail' || words.data.length === 0) throw new Error('Can not findtop10toremind')
        let rnd = Math.floor(Math.random() * words.data.length)
        await Word.findByIdAndUpdate(words.data[rnd]._id, { counter: +words.data[rnd].counter+1 })
        return words.data[rnd];
    } catch (error) {
        console.error(error);
        return null
    }    
}

//get all devices from database
getDevices = async (phrase) => {
    const url = 'http://localhost:'+process.env.PORT+'/api/tokens/' // ###devices?    
    //console.log('reminder.getDevices:url', url)
    try {
        let res = await axios({
            url: url,
            methog: 'get'
        })
        return res.data
    } catch (error) {
        console.log('###Error: getTokens');
        console.error(error);
        return null
    }
}

//message color
getTagColor = (tag) => { 
    console.log(tag);
    switch (tag) { 
        case 'A': return '#ff0000'; 
        case 'B': return '#fc9003'; 
        case 'C': return '#fcf003'; 
        default: return '#000000' 
    } 
}