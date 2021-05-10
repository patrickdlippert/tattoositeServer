const express = require('express');
const Galleryimage = require('../models/galleryimage');
const authenticate = require('../authenticate');
const cors = require('./cors');

const galleryimageRouter = express.Router();

galleryimageRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Galleryimage.find()
    .then(galleryimages => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(galleryimages);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Galleryimage.create(req.body)
    .then(galleryimage => {
        console.log('Galleryimage Created ', galleryimage);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(galleryimage);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /galleryimages');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Galleryimage.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

galleryimageRouter.route('/:galleryimageId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Galleryimage.findById(req.params.galleryimageId)
    .then(galleryimage => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(galleryimage);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /galleryimages/${req.params.galleryimageId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Galleryimage.findByIdAndUpdate(req.params.galleryimageId, {
        $set: req.body
    }, { new: true })
    .then(galleryimage => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(galleryimage);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Galleryimage.findByIdAndDelete(req.params.galleryimageId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = galleryimageRouter;