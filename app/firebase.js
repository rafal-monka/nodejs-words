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


//2 HTTP (not used)
// const sendNotification = (data) => {
//     const dataString = JSON.stringify(data)
//     const headers = {
//         'Authorization': 'key=AAAAPz2Qc_g:APA91bEpycCndpmtsa9DmMhXQOBGTqs43eyLFC_huzA6DUUrcDEQqDxLsha122xhcPjmJnFvd_bb1krv7zRE8C4yP65m2UNOmlAfJZiZQrJzXijhCKU9PEYkrp4P4P22fPvo7UKunLvv',
//         'Content-Type': 'application/json',
//         'Content-Length': dataString.length
//     }
//     const options = {
//         uri: 'https://fcm.googleapis.com/fcm/send',
//         method: 'POST',
//         headers: headers,
//         json: data
//     }
  
//     request(options, function (err, res, body) {
//         if (err) throw err
//         else console.log(body)
//         console.log('...')
//     })
//   }
  
  
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