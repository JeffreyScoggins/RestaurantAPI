const config = require('../config.json');
const jwt = require('jsonwebtoken');
const request = require("request-promise");
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const https = require("https");
const User = db.User;

module.exports = {
    authenticate,
    getAllCategories,
    getAllItems,
    getAllItemsByCategoryUuid,
    getItemByItemId,
    getAllCategoriesByItemUuid,
    getAllModifierGroupsByItem,
    getAllModifiersByGroupId,
};

async function authenticate(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/oauth/token?&client_id=' +userParam.client_id
      +'&client_secret='
      +'&code=' +userParam.code,
    headers: {accept: 'application/json'}
  };
  console.log('cloverApi service authenticate Merlyn');
  const response = request(options);
  return await response;
}

async function getAllCategories(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id+'/categories',
    qs: {access_token: userParam.token}
  };
  const response = request(options);
  return await response;
}



async function getAllItems(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id+'/items/?limit=1000',
    qs: {access_token: userParam.token}
  };
  const response = request(options);
  return await response;
}

async function getAllItemsByCategoryUuid(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/categories/' +userParam.category_id +'/items',
    qs: {access_token: userParam.token},
    headers: {accept: 'application/json'}
  };
  const response = request(options);
  return await response;
}

async function getItemByItemId(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/items/' +userParam.item_id,
    qs: {access_token: userParam.token},
    headers: {accept: 'application/json'}
  };
  const response = request(options);
  return await response;
}

async function getAllCategoriesByItemUuid(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/items/' +userParam.item_id +'/categories',
    qs: {access_token: userParam.token},
    headers: {accept: 'application/json'}
  };
  const response = request(options);
  return await response;
}

async function getAllModifierGroupsByItem(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/modifier_groups?expand=modifiers&filter=item.id=' +userParam.item_id,
    qs: {access_token: userParam.token},
    headers: {accept: 'application/json'}
  };
  const response = request(options);
  return await response;
}

async function getAllModifiersByGroupId(userParam) {
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/modifier_groups/' +userParam.modifiersGroupId
      + '/modifiers?expand=modifiers',
    qs: {access_token: userParam.token},
    headers: {accept: 'application/json'}
  };
  const response = request(options);
  return await response;
}

