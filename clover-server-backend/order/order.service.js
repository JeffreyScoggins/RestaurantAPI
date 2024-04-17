const db = require('../_helpers/db');
const Order = db.Order;
const Pusher = require('pusher');

const pusher = new Pusher({
    origin: "http://localhost:*",
    appId: '',
    key: '',
    secret: '',
    cluster: '',
    useTLS: true
});

module.exports = {
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

async function getAll(id) {
    return await Order.find({ orgUuid: id }).select('-hash');
}

async function getOrderTime(id) {
  let orders = Order.find({ orgUuid: id }).select('-hash');
  orders = orders.filter( order => order.status !== 'complete');
  return (15 + (orders.length * 4)).toJSON();
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
    // const order = new Order(userParam);

    // save item
    // JSON.stringify(userParam);
    Order.insertMany(userParam);

    pusher.trigger('order-channel', 'new-order', {
        "added": true,
        "orgUuid": userParam[0].orgUuid
    })
    // await order.save();
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
