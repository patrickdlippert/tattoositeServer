const express = require('express');
const Billboard = require('../models/billboard');
const authenticate = require('../authenticate');
const cors = require('./cors');

const billboardRouter = express.Router();

billboardRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Billboard.find()
    .then(billboards => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(billboards);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Billboard.create(req.body)
    .then(billboard => {
        console.log('Billboard Created ', billboard);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(billboard);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /billboards');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Billboard.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

billboardRouter.route('/:billboardId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Billboard.findById(req.params.billboardId)
    .then(billboard => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(billboard);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /billboards/${req.params.billboardId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Billboard.findByIdAndUpdate(req.params.billboardId, {
        $set: req.body
    }, { new: true })
    .then(billboard => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(billboard);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Billboard.findByIdAndDelete(req.params.billboardId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = billboardRouter;