const express = require('express');
const router = express.Router();
const orderService = require('./order.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/categoryUuid/:id/:orgUuid', getOrderByCategoryUuid);
router.get('/current', getCurrent);
router.get('/itemUuid/:id/:orgUuid', getItemByItemUuid);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/orderTime/:id', getOrderTime);


module.exports = router;

function register(req, res, next) {
    console.log("In order.controller register");
    orderService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    orderService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderByCategoryUuid(req, res, next) {
    orderService.getOrderByCategoryUuid(req.params.id, req.params.orgUuid)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    orderService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    orderService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderTime(req, res, next) {
  orderService.getOrderTime(req.params.id)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function _delete(req, res, next) {
    orderService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update(req, res, next) {
    orderService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getItemByCategoryUuid(req, res, next) {
    orderService.getItemByTableUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByItemUuid(req, res, next) {
    orderService.getItemByItemUuid(req.params.id, req.params.orgUuid)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
