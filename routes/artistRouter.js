const express = require('express');
const Artist = require('../models/artist');
const authenticate = require('../authenticate');
const cors = require('./cors');

const artistRouter = express.Router();

artistRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Artist.find()
    .then(artists => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(artists);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Artist.create(req.body)
    .then(artist => {
        console.log('Artist Created ', artist);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(artist);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /artists');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Artist.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

artistRouter.route('/:artistId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Artist.findById(req.params.artistId)
    .populate('comments.author')
    .then(artist => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(artist);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /artists/${req.params.artistId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Artist.findByIdAndUpdate(req.params.artistId, {
        $set: req.body
    }, { new: true })
    .then(artist => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(artist);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Artist.findByIdAndDelete(req.params.artistId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = artistRouter;