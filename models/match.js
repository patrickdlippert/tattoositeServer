const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    score: {
        type: Number
    },
    numtattoos: [{
        type: Number
    }],
    painthreshold: [{
        type: Number
    }],
    overfifty: [{
        type: Number
    }],
    iscoverup: [{
        type: Number
    }],
    isextension: [{
        type: Number
    }],
    isclearidea: [{
        type: Number
    }],
    isopentoartist: [{
        type: Number
    }],
    iscolor: [{
        type: Number
    }],
    sizetattoo: [{
        type: Number
    }],
    locationtattoo: [{
        type: Number
    }],
    themetattoo: [{
        type: Number
    }],
    styletattoo: [{
        type: Number
    }],
    dateappointment: [{
        type: String
    }],
    reasons: [{
        type: String
    }] 

}, {
    timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;