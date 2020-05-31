require('dotenv').config();
var admin = require("firebase-admin");

//var serviceAccount = require("./config/memory-248a2-e9d79b4455b3.json");
console.log('FIREBASE_PRIVATE_KEY', process.env.FIREBASE_PRIVATE_KEY.replace(/@/g, "\n"));
console.log('FIREBASE_CLIENT_EMAIL', process.env.FIREBASE_CLIENT_EMAIL);

var serviceAccount = {
    "type": "service_account",
    "project_id": "memory-248a2",
    "private_key_id": "e9d79b4455b30249975618502c61af30787f21a4",
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/@/g, "\n"), 
    "client_email": process.env.FIREBASE_CLIENT_EMAIL, 
    "client_id": "116268897815062284769",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5ve7h%40memory-248a2.iam.gserviceaccount.com"
  }

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
  databaseURL: "https://memory-248a2.firebaseio.com"
})

exports.sendMessage = (token, notif) => {
console.log('sendMessage - token', token);
// console.log("notif.body", notif.body);
    const message = {
        // notification: { //info: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification
        //     title: notif.title,
        //     body: notif.body,    
        // },
        // android:{
        //     notification: { 
        //         channel_id: "channel_id_1", 
        //         color: notif.color, 
        //         click_action: "OPEN_ACTIVITY_1"
        //     },
        //     priority:"normal"    
        // },
        data: {
            title: notif.title,
            body: notif.body, 
            color: notif.color,
            id: notif.id            
        },
        token: token
    }
    
    admin.messaging().send(message)
        .then(res => {
            console.log('message sent', res);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}


//2 HTTP
const sendNotification = (data) => {
    const dataString = JSON.stringify(data)
    const headers = {
        'Authorization': 'key=AAAAPz2Qc_g:APA91bEpycCndpmtsa9DmMhXQOBGTqs43eyLFC_huzA6DUUrcDEQqDxLsha122xhcPjmJnFvd_bb1krv7zRE8C4yP65m2UNOmlAfJZiZQrJzXijhCKU9PEYkrp4P4P22fPvo7UKunLvv',
        'Content-Type': 'application/json',
        'Content-Length': dataString.length
    }
    const options = {
        uri: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: headers,
        json: data
    }
  
    request(options, function (err, res, body) {
        if (err) throw err
        else console.log(body)
        console.log('...')
    })
  }
  
  
  
//   sendNotification({
//       to : 'crndz3kBQ96146uIFzZfgl:APA91bE-AU1QF8Tz-AoF9CEDPIglw6ucTTvtWM3uPTifBxjSRdEdqcsXj2HZ8Sf4YTvd_MTvalzinExxqgt617yUQ_yTt8mLWKTL9C5Hn_zWkKGOIZImgbd59DQFBmz0Ka-KgBbiFgLk',
//       notification: { //info: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification
//         title: 'TEST',
//         body: 'TEST BODY',    
//       },
//       data: {
//         score: "5x1",
//         time: "15:10"
//       },
//       direct_book_ok : true
//   })