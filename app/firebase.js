var admin = require("firebase-admin")
var serviceAccount = require("../config/firebase-serviceaccount")

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
    databaseURL: "https://memory-248a2.firebaseio.com"
})

exports.sendMessage = (token, notif) => {
//console.log('sendMessage - token', token);
    const message = {
        data: {
            title: notif.title,
            body: notif.body, 
            color: notif.color,
            _id: notif._id            
        },
        token: token
    }
    
    //console.log('messaging().send(message)...', message);

    admin.messaging().send(message)
        .then(res => {
            console.log('message sent', res);
        })
}

