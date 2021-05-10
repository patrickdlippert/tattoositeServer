const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billboardSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    altText: {
        type: String,
        required: true
    },
    header: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Billboard = mongoose.model('Billboard', billboardSchema);

module.exports = Billboard;