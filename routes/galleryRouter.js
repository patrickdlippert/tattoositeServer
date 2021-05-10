const express = require('express');
const Gallery= require('../models/gallery');
const authenticate = require('../authenticate');
const cors = require('./cors');

const galleryRouter = express.Router();

galleryRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Gallery.find()
    .then(gallery => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gallery);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Gallery.create(req.body)
    .then(gallery => {
        console.log('Gallery Created ', gallery);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(gallery);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /gallery');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Gallery.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = galleryRouter;