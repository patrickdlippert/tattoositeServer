const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // Find the user's favorites document using ID from passport authentication
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Find the user's favorites document using ID from passport authentication
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            // Looping over the array of campsites that we got in the req.body
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    // for each fav obj, push the _id to the campsites field from the document
                    // if it's not already in the data document
                    favorite.campsites.push(fav._id)
                }
            })
            favorite.save()  // Save favorites document to MongoDB
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            // No existing favorites document for this user, so create a new one
            Favorite.create({
                user: req.user._id,
                campsites: req.body
            })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));

        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Find and delete the user's entire favorites document using ID from passport authentication
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            // Send response to client
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 200; // Send OK status
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});


favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
})


.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    // Find the user's favorites document using ID from passport authentication
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            // See if the campsiteId passed in the URL is not already in the user's list of favorites
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                // Add the campsiteId from the URL to the array of campsites
                favorite.campsites.push(req.params.campsiteId)
                favorite.save() // Save the user's updated favorites document to MongoDB
                .then((favorite) => {
                    console.log('Favorite Created ', favorite);
                    // Send response to client with the user's favorites document
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));

            } else {
                res.statusCode = 200; // Send status OK
                res.setHeader('Content-Type', 'text/plain');
                res.end('That campsite is already in the list of favorites!');
            }
        
        } else {
            // This user does not have any favorites saved, so create a new favorites document
            // and add the campsiteId from the URL
            Favorite.create({
                user: req.user._id,
                campsites: req.params.campsiteId
            })
            .then(favorite => {
                // Send response to client with the user's favorites document that contains one campsite
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Find the user's favorites document using ID from passport authentication
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        // See if the campsiteId from the URL is present in the list of user's favorites
        let campsiteIndex = favorite.campsites.indexOf(req.params.campsiteId);
        if(campsiteIndex !== -1) {
            // Delete the campsiteId from the list of favorites
            favorite.campsites.splice(campsiteIndex, 1);
            favorite.save() // Save the updated array to MongoDB
                .then((favorite) => {
                    console.log('Favorite Deleted ', favorite);
                    // Send response to client
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
        } else {
            res.statusCode = 200; // Send OK status
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;