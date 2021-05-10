const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const galleryimageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    typecode: {
        type: Number,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image_thumb: {
        type: String,
        required: true
    },
    image_full: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Galleryimage = mongoose.model('Galleryimage', galleryimageSchema);

module.exports = Galleryimage;