
const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({ 
    phrase: String,
    hws: String,
    speechpart: String,
    sentence: String,
    translation: String,
    examples : String,
    tags : String,
    counter : Number,
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null }
})

module.exports = mongoose.model('Word', wordSchema)
