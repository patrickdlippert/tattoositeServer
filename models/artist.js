const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    name_short: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;