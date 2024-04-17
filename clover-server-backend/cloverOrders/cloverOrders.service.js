const config = require('../config.json');
const jwt = require('jsonwebtoken');
const request = require("request-promise");
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const https = require("https");
const User = db.User;

module.exports = {
    postNewOrder,
    getOrder,
    updateOrder,
    getUnpaidOrder,
    getOrderLineItems,
    getOrdersAndLineItems,
    postNewLineItem,
    deleteLineItem,
    postNewModification,
    getAll,
    getById,
    getOrderByCategoryUuid,
    update,
    getItemByCategoryUuid,
    getItemByItemUuid,
    getOrderTime,
    create,
    delete: _delete
};

async function postNewOrder(data) {
  console.log("post new order");
    const options = {
      method: 'post',
      url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders',
      header: 'content-type: application/json',
      body: JSON.stringify(data.order),
      qs: {access_token: data.token}
    };
    console.log('Clover New  Order');
    const response = request(options);
    return await response;
}

async function getOrder(data) {
  console.log("get order");
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id,
    qs: {access_token: data.token}
  };
  console.log('Clover get  Order');
  const response = request(options);
  return await response;
}

async function updateOrder(data) {
  console.log("get order");
  const options = {
    method: 'post',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id,
    header: 'content-type: application/json',
    body: JSON.stringify(data.order),
    qs: {access_token: data.token}
  };
  console.log('Clover get  Order');
  const response = request(options);
  return await response;
}

//url: 'https://www.clover.com/v3/merchants/'+data.merchant_id+'/orders/?filter=state=open',
async function getUnpaidOrder(data) {
  console.log("get Unpaid order");
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/',
    qs: {filter: data.filter, access_token: data.token}
  };
  console.log('Clover get  Order');
  const response = request(options);
  return await response;
}

async function getOrderLineItems(data) {
  console.log("get order");
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id+
    '/line_items?expand=modifications',
    qs: {access_token: data.token}
  };
  console.log('Clover  Order items and modifications');
  const response = request(options);
  return await response;
}

async function getOrdersAndLineItems(data) {
  console.log("get orders & lineitems");
  const options = {
    method: 'get',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+'?expand=lineItems&filter=note='+data.note,
    qs: {access_token: data.token}
  };
  console.log('Clover get  Orders & lineitems : '+options.url);
  const response = request(options);
  return await response;
}

async function postNewLineItem(data) {
  console.log("in post new line service");
  console.log("in service" + JSON.stringify(data.line_item));
  const options = {
    method: 'post',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id+'/line_items',
    header: 'content-type: application/json',
    body: JSON.stringify(data.line_item),
    qs: {access_token: data.token}
  };
  console.log('Clover New  line');
  const response = request(options);
  return await response;
}

async function deleteLineItem(data) {
  console.log("in delete line service :" + data.order_id);
  console.log("in service" + JSON.stringify(data.lineItem_id));
  const options = {
    method: 'delete',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id+'/line_items/'+data.lineItem_id,
    qs: {access_token: data.token}
  };
  console.log('Clover deleted  line');
  const response = request(options);
  return await response;
}

async function postNewModification(data) {
  console.log("Final step : in post new modification service ");
  // var jData = JSON.stringify(data.line_items);
  // var itemsData = [{"item": jData}];
  // console.log("in service" + itemsData);
  const options = {
    method: 'post',
    url: 'https://sandbox.dev.clover.com/v3/merchants/'+data.merchant_id+'/orders/'+data.order_id+'/line_items/'+data.lineitem_id+'/modifications',
    header: 'content-type: application/json',
    body: JSON.stringify(data.modification),
    qs: {access_token: data.token}
  };
  console.log('Clover New  lines');
  const response = request(options);
  return await response;
}

async function getAll(id) {
    return await Order.find({ orgUuid: id }).select('-hash');
}

async function getOrderTime(id) {
  let orders = await Order.find({ orgUuid: id }).select('-hash');
  orders = orders.filter( order => order.status !== 'complete');
  return (15 + (orders.length * 4));
}

async function getById(id) {
    return await Order.findById(id);
}

async function getItemByCategoryUuid(id, orgUuid) {
    let orders = await Order.find({categoryUuid: id, orgUuid: orgUuid}).select('-hash');
    return orders;
}

async function getItemByItemUuid(id, orgUuid) {
    let orders = await Order.find({ itemUuid: id, orgUuid: orgUuid}).select('-hash');
    return orders;
}

async function getOrderByCategoryUuid(id, orgUuid) {
    let items = await Order.find({ categoryUuid: id, orgUuid: orgUuid}).select('-hash');
    return items;
}


async function create(userParam) {
    console.log("In order.service create");
  /*  // const order = new Order(userParam);

    // save item
    // JSON.stringify(userParam);
    Order.insertMany(userParam);

    pusher.trigger('order-channel', 'new-order', {
        "added": true,
        "orgUuid": userParam[0].orgUuid
    })
    // await order.save();
 */

    const options = {
      method: 'post',
      url: 'https://sandbox.dev.clover.com/v3/merchants/'+userParam.merchant_id +'/orders',
      qs: {access_token: userParam.token},
      headers: {accept: 'application/json'}
    };
    const response = request(options);
    return await response;
  }

async function _delete(id) {
    let order = await Order.findById(id);
    pusher.trigger('order-channel', 'new-order', {
        "added": false,
        "orgUuid": order.orgUuid
    });
    await Order.findByIdAndRemove(id);
}

async function update(id, userParam) {

    const order = await Order.findById(id);

    // validate
    if (!order) throw 'Order not found';

    Object.assign(order, userParam);

    if (order.status === 'complete') {
      await order.save();
      pusher.trigger('order-ready', 'order-ready-created', order);
    } else {
      await order.save();
    }
}
