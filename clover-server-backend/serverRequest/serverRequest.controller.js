const express = require('express');
const router = express.Router();
const serverRequestService = require('./serverRequest.service');

// routes
router.post('/register', register);
router.get('/getAll/:id', getAll);
router.delete('/:id', _delete);


module.exports = router;

function register(req, res, next) {
    serverRequestService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    serverRequestService.getAll(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    serverRequestService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
