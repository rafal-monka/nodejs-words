require('dotenv').config();

module.exports = serviceAccount = {
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

  //-----------------------------------
  //var ./config/memory-248a2-e9d79b4455b3.json");
//console.log('FIREBASE_PRIVATE_KEY', process.env.FIREBASE_PRIVATE_KEY.replace(/@/g, "\n"));
//console.log('FIREBASE_CLIENT_EMAIL', process.env.FIREBASE_CLIENT_EMAIL);

