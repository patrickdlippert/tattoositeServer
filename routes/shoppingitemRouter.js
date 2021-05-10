const express = require('express');
const Shoppingitem = require('../models/shoppingitem');
const authenticate = require('../authenticate');
const cors = require('./cors');

const shoppingitemRouter = express.Router();

shoppingitemRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Shoppingitem.find()
    .then(shoppingitems => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shoppingitems);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Shoppingitem.create(req.body)
    .then(shoppingitem => {
        console.log('Shoppingitem Created ', shoppingitem);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shoppingitem);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shopping');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Shoppingitem.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

shoppingitemRouter.route('/:shoppingitemId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Shoppingitem.findById(req.params.shoppingitemId)
    .then(shoppingitem => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shoppingitem);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /shopping/${req.params.shoppingitemId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Shoppingitem.findByIdAndUpdate(req.params.shoppingitemId, {
        $set: req.body
    }, { new: true })
    .then(shoppingitem => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shoppingitem);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Shoppingitem.findByIdAndDelete(req.params.shoppingitemId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = shoppingitemRouter;