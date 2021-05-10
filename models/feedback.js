const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phoneNum: {
        type: String
    },
    email: {
        type: String
    },
    agree: {
        type: Boolean,
        default: false
    },
    contactType: {
        type: String
    },
    feedback: {
        type: String
    }
});


feedbackSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Feedback', feedbackSchema);