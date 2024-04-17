const express = require('express');
const router = express.Router();
const itemService = require('./items.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/categoryUuid/:id', getItemByCategoryUuid);
router.get('/current', getCurrent);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    itemService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    itemService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByCategoryUuid(req, res, next) {
    itemService.getItemByCategoryUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    itemService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    itemService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    itemService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}