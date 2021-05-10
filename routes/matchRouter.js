const express = require('express');
const Match = require('../models/match');
const authenticate = require('../authenticate');
const cors = require('./cors');
const REASONS = require('./reasons');

const matchRouter = express.Router();
const scoreWeight = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3 ]; // Weight to apply to each of the 12 score items

matchRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Match.find()
    .populate('artist')
    .then(matches => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(matches);
    })
    .catch(err => next(err));
})
.post(cors.cors, (req, res, next) => {
    // Find all artist match documents from MongoDB
    Match.find()
    .populate('artist')  // Take the artist's ObjectID and populate witih info from the Artist documents
    .then(matches => {
        //console.log(req.body); // Match form sent from client

        // Loop over all of the artist match data from the database and pull out the artist's self-score
        // for the criteria that the user has selected. Each value ranges from 0 to 100. Also prepare a
        // text description of the score to be transmitted back to the client.
        if(matches) {
            matches.forEach(match => {
                //console.log(match);
                let scores = [];
                let scoreNotes = [];
                scores[0] = match.numtattoos[req.body.numTattoos];
                scoreNotes[0] = REASONS[0][req.body.numTattoos];
                scores[1] = match.painthreshold[req.body.painThreshold];
                scoreNotes[1] = REASONS[1][req.body.painThreshold];
                scores[2] = match.overfifty[req.body.overFifty];
                scoreNotes[2] = REASONS[2][req.body.overFifty];
                scores[3] = match.iscoverup[req.body.isCoverUp];
                scoreNotes[3] = REASONS[3][req.body.isCoverUp];
                scores[4] = match.isextension[req.body.isExtension];
                scoreNotes[4] = REASONS[4][req.body.isExtension];
                scores[5] = match.isclearidea[req.body.isClearIdea];
                scoreNotes[5] = REASONS[5][req.body.isClearIdea];
                scores[6] = match.isopentoartist[req.body.isOpenToArtist];
                scoreNotes[6] = REASONS[6][req.body.isOpenToArtist];
                scores[7] = match.iscolor[req.body.isColor];
                scoreNotes[7] = REASONS[7][req.body.isColor];
                scores[8] = match.sizetattoo[req.body.sizeTattoo];
                scoreNotes[8] = REASONS[8][req.body.sizeTattoo];
                scores[9] = match.locationtattoo[req.body.locationTattoo];
                scoreNotes[9] = REASONS[9][req.body.locationTattoo];
                scores[10]= match.themetattoo[req.body.themeTattoo];
                scoreNotes[10] = REASONS[10][req.body.themeTattoo];
                scores[11]= match.styletattoo[req.body.styleTattoo];
                scoreNotes[11] = REASONS[11][req.body.styleTattoo];

                // Sum up all of the individual scores for this artist. Add the line-item score
                // to the description response to give the user even more detail about the scoring, but
                // limit this to scores of 90 or greater.
                let total = 0;
                let totalWeights = 0;
                for(let i = 0, j = 0; i < scores.length; i++) {
                    if (scores[i] >= 90) {
                        match.reasons[j] = scoreNotes[i] + " Score: " + scores[i] +"%";
                        j++;
                    }
                    total += scores[i] * scoreWeight[i];
                    totalWeights += scoreWeight[i];
                }
                // If the artist is unavailable on the user-selected date, then add this to the top
                // of the scoring.
                if((match.dateappointment).includes(req.body.dateAppointment)) {
                    match.reasons.unshift("**Artist not available on " + req.body.dateAppointment + ". Contact for alternate dates.");

                }
                // Calculate the overall average weighed score between 0 and 100%
                match.score = total / totalWeights; // Update the calculated score for the artist (send to client, don't update database)
                console.log(`Average score for ${match.artist.name}: ` + match.score);
            })
        }
        matches.sort((a,b) => (a.score < b.score) ? 1: -1); //Sort the matches with highest scores first

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(matches.slice(0,2)); // Return contents of the top 2 highest-scored match documents
    })

    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /match');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Find and delete the user's entire match document using ID from passport authentication
    Match.findOneAndDelete({user: req.user._id})
    .then(match => {
        if(match) {
            // Send response to client
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(match);
        } else {
            res.statusCode = 200; // Send OK status
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any matchs to delete.');
        }
    })
    .catch(err => next(err));
});


matchRouter.route('/:artistId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /matchs/${req.params.campsiteId}`);
})


.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Match.create({artist: req.params.artistId, score: 95})
    .then(match => {
        console.log('Match Record Created ', match);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(match);
    })
    .catch(err => next(err));
})


.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Match.create(req.body)
    .then(match => {
        console.log('Match Scorecard Created ', match);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(match);
    })
    .catch(err => next(err));
})



.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /matchs/${req.params.campsiteId}`);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Find the user's matchs document using ID from passport authentication
    Match.findOne({user: req.user._id})
    .then(match => {
        // See if the campsiteId from the URL is present in the list of user's matchs
        let campsiteIndex = match.campsites.indexOf(req.params.campsiteId);
        if(campsiteIndex !== -1) {
            // Delete the campsiteId from the list of matchs
            match.campsites.splice(campsiteIndex, 1);
            match.save() // Save the updated array to MongoDB
                .then((match) => {
                    console.log('Match Deleted ', match);
                    // Send response to client
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(match);
                })
                .catch(err => next(err));
        } else {
            res.statusCode = 200; // Send OK status
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any matchs to delete.');
        }
    })
    .catch(err => next(err));
});

module.exports = matchRouter;