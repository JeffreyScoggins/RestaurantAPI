const express = require('express');
const router = express.Router();
const clientService = require('./authentication.service');

router.post('/saveClientCredentials', saveClientCredentials);
router.post('/getMerchantId', getMerchantId);
router.post('/getCloverToken', getCloverToken);

module.exports = router;

function saveClientCredentials(req, res, next) {
    clientService.saveClientCredentials(req.body)
        .then(users => res.send(users))
        .catch(err => next(err));
  }

function getMerchantId(req, res, next) {
        clientService.getMerchantId(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
    }

function getCloverToken(req, res, next) {
        clientService.getCloverToken(req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
    }