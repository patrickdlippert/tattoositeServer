const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    name_short: {
        type: String,
        required: true,
    },
    typecode: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;