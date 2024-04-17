const express = require('express');
const router = express.Router();
const imageService = require('./images.service');

// routes
router.post('/register', register);
router.post('/update', update);
router.get('/getAllCategories/:id', getAllCategories);
router.get('/getAllItems/:id', getAllItems);
router.get('/:id', getById);
router.get('/current', getCurrent);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    imageService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function update(req, res, next) {
    console.log("In Image update controller");
    imageService.update(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    imageService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllCategories(req, res, next) {
    console.log("images controller - getAllCategories");
    imageService.getAllCategories(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllItems(req, res, next) {
    console.log("images controller - getAllItems");
    imageService.getAllItems(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    imageService.getById(req.params.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    imageService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
