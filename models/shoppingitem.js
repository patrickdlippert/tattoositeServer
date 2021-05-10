const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingitemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default: 0
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Shoppingitem = mongoose.model('Shoppingitem', shoppingitemSchema);

module.exports = Shoppingitem;