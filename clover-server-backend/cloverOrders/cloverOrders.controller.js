const express = require('express');
const router = express.Router();
const cloverOrderService = require('./cloverOrders.service');

// routes
router.post('/register', register);
router.post('/createOrder', postNewOrder);
router.post('/getOrder', getOrder);
router.post('/updateOrder', updateOrder);
router.post('/getUnpaidOrder', getUnpaidOrder);
router.post('/getOrderLineItems', getOrderLineItems);
router.post('/getOrdersAndLineItems', getOrdersAndLineItems);
router.post('/createLineItem', postNewLineItem);
router.post('/deleteLineItem', deleteLineItem);
router.post('/createItemModification', postNewModification);
router.get('/getAll/:id', getAll);
router.get('/:id', getById);
router.get('/categoryUuid/:id/:orgUuid', getOrderByCategoryUuid);
router.get('/current', getCurrent);
router.get('/itemUuid/:id/:orgUuid', getItemByItemUuid);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/orderTime/:id', getOrderTime);


module.exports = router;

function postNewOrder(req, res, next) {
    console.log("In cloverORders controller");
    cloverOrderService.postNewOrder(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
        console.log("In cloverORders back");
}

function getOrder(req, res, next) {
    console.log("In GET cloverOrders controller");
    cloverOrderService.getOrder(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function updateOrder(req, res, next) {
    console.log("In update cloverOrders controller");
    cloverOrderService.updateOrder(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function getUnpaidOrder(req, res, next) {
    console.log("In GET unpaid cloverOrders controller");
    cloverOrderService.getUnpaidOrder(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function getOrderLineItems(req, res, next) {
    console.log("In GET getOrderLineItems controller");
    cloverOrderService.getOrderLineItems(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function getOrdersAndLineItems(req, res, next) {
    console.log("In GET cloverORders controller");
    cloverOrderService.getOrdersAndLineItems(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
}

function postNewLineItem(req, res, next) {
    console.log("In cloverORders post new line controller");
  //  console.log(JSON.stringify(req));
    cloverOrderService.postNewLineItem(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
        console.log("In cloverORder line back");
}

function deleteLineItem(req, res, next) {
    console.log("In cloverORders delete lineitem controller");
  //  console.log(JSON.stringify(req));
    cloverOrderService.deleteLineItem(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
        console.log("In cloverORder back after line delete");
}

function postNewModification(req, res, next) {
    console.log("In cloverORders post new modification controller");
  //  console.log(JSON.stringify(req));
    cloverOrderService.postNewModification(req.body)
        .then(data => res.send(data))
        .catch(err => next(err));
        console.log("In cloverORder modification back");
}

function register(req, res, next) {
    console.log("In order.controller register");
    cloverOrderService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    cloverOrderService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderByCategoryUuid(req, res, next) {
    cloverOrderService.getOrderByCategoryUuid(req.params.id, req.params.orgUuid)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    cloverOrderService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    cloverOrderService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getOrderTime(req, res, next) {
  cloverOrderService.getOrderTime(req.params.id)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function _delete(req, res, next) {
    cloverOrderService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update(req, res, next) {
    cloverOrderService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getItemByCategoryUuid(req, res, next) {
    cloverOrderService.getItemByTableUuid(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getItemByItemUuid(req, res, next) {
    cloverOrderService.getItemByItemUuid(req.params.id, req.params.orgUuid)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
