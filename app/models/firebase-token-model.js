
const mongoose = require('mongoose')

const firebaseTokenSchema = new mongoose.Schema({ 
    device: String,
    token: String,
    name: String,
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null }
})

module.exports = mongoose.model('FirebaseToken', firebaseTokenSchema)
