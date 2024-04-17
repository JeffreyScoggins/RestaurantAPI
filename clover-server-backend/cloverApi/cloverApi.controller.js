const express = require('express');
const router = express.Router();
const cloverService = require('./cloverApi.service');

// routes
router.post('/authenticate', authenticate);
router.post('/categories', getAllCategories);
router.post('/items', getAllItems);
router.post('/itemsByCategory', itemsByCategory);
router.post('/itemByItemId', itemByItemId);
router.post('/categoriesByItems', categoriesByItems);
router.post('/modifierGroupsByItemId', getAllModifierGroupsByItemId);
router.post('/modifiersByGroupId', getAllModifiersByGroupId);

module.exports = router;

function authenticate(req, res, next) {
    cloverService.authenticate(req.body)
        .then(user => user ? res.send(user) : res.status(400).json({ message: 'Credentials are incorrect' }))
        .catch(err => next(err));
}


function getAllCategories(req, res, next) {
    cloverService.getAllCategories(req.body)
        .then(users => res.send(users))
        .catch(err => next(err));
}

function getAllItems(req, res, next) {
    cloverService.getAllItems(req.body)
        .then(user => user ? res.send(user) : res.status(400).json({ message: 'Message body is incorrect' }))
        .catch(err => next(err));
}

function itemsByCategory(req, res, next) {
    cloverService.getAllItemsByCategoryUuid(req.body)
      .then(users => res.send(users))
      .catch(err => next(err));
}

function itemByItemId(req, res, next) {
  cloverService.getItemByItemId(req.body)
    .then(users => res.send(users))
    .catch(err => next(err));
}

function categoriesByItems(req, res, next) {
  cloverService.getAllCategoriesByItemUuid(req.body)
    .then(users => res.send(users))
    .catch(err => next(err));
}

function getAllModifierGroupsByItemId(req, res, next) {
  cloverService.getAllModifierGroupsByItem(req.body)
    .then(users => res.send(users))
    .catch(err => next(err));
}

function getAllModifiersByGroupId(req, res, next) {
  cloverService.getAllModifiersByGroupId(req.body)
    .then(users => res.send(users))
    .catch(err => next(err));
}
