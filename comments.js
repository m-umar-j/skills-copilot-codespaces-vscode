// Create web server

// import libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Comment = require('../models/comments');
const commentRouter = express.Router();

// use body parser to parse data
commentRouter.use(bodyParser.json());

// configure commentRouter to support REST API

// route '/'
commentRouter.route('/')
// preflight request
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// get request
.get(cors.cors, (req, res, next) => {
    Comment.find(req.query)
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// post request
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.body != null) {
        // create comment
        Comment.create(req.body)
        .then((comment) => {
            // populate comment
            Comment.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        // error
        err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
    }
})
// put request
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // error
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
// delete request
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // remove all comments
    Comment.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        // send response
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// route '/:commentId'
commentRouter.route('/:commentId')
// preflight