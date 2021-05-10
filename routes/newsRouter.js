const express = require('express');
const News = require('../models/news');
const authenticate = require('../authenticate');
const cors = require('./cors');

const newsRouter = express.Router();

newsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    News.find()
    .then(news => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(news);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    News.create(req.body)
    .then(news => {
        console.log('News Created ', news);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(news);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /news');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    News.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

newsRouter.route('/:newsId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    News.findById(req.params.newsId)
    .then(news => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(news);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /news/${req.params.newsId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    News.findByIdAndUpdate(req.params.newsId, {
        $set: req.body
    }, { new: true })
    .then(news => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(news);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    News.findByIdAndDelete(req.params.newsId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = newsRouter;