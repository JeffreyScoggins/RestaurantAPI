const express = require('express');
const router = express.Router();
const orderHistoryService = require('./orderHistory.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/categoryUuid/:id', getOrderByCategoryUuid);
router.get('/date/:startDate/:endDate', getOrderHistoryByDate);
router.get('/current', getCurrent);
router.get('/itemUuid/:id', getItemByItemUuid);
router.put('/:id', update);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    orderHistoryService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    orderHistoryService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderByCategoryUuid(req, res, next) {
    orderHistoryService.getOrderByCategoryUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderHistoryByDate(req, res, next) {
  orderHistoryService.getOrderHistoryByDate(req.params.startDate, req.params.endDate)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function getAll(req, res, next) {
    orderHistoryService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    orderHistoryService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    orderHistoryService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update(req, res, next) {
    orderHistoryService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getItemByCategoryUuid(req, res, next) {
    orderHistoryService.getItemByTableUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByItemUuid(req, res, next) {
    orderHistoryService.getItemByItemUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
