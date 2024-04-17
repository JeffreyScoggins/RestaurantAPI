const express = require('express');
const router = express.Router();
const categoryService = require('./categories.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/current', getCurrent);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    categoryService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    categoryService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    categoryService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    categoryService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    categoryService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
