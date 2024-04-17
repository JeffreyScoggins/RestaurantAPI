const express = require('express');
const router = express.Router();
const tableOrderService = require('./tableOrder.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/tableUuid/:id', getItemByTableUuid);
router.get('/categoryUuid/:id', getItemByTableUuid);
router.put('/:id', update);
router.get('/current', getCurrent);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    console.log("In tableOrder.controller register");
    tableOrderService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    tableOrderService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByTableUuid(req, res, next) {
    tableOrderService.getItemByTableUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByCategoryUuid(req, res, next) {
    tableOrderService.getItemByTableUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    tableOrderService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    tableOrderService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    tableOrderService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    tableOrderService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
