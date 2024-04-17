const db = require('../_helpers/db');
const OrderHistory = db.OrderHistory;
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
    getOrderHistoryByDate,
    update,
    getItemByCategoryUuid,
    getItemByItemUuid,
    create,
    delete: _delete
};

async function getAll(id) {
    return await OrderHistory.find({ orgUuid: id }).select('-hash');
}

async function getById(id) {
    return await OrderHistory.findById(id);
}

async function getItemByCategoryUuid(id) {
    let orders = await OrderHistory.find({ categoryUuid: id }).select('-hash');
    return orders;
}

async function getOrderHistoryByDate(startDate, endDate) {
  console.log('start ' +startDate + ' end ' + endDate);
  let orders;
  if(endDate) {
    orders = await OrderHistory.find({"createdDate": {
        $gte: startDate,
        $lt: endDate,}});

  } else {
    orders = await OrderHistory.find({"createdDate": {
        $gte: startDate}});
  }
  return orders;
}

async function getItemByItemUuid(id) {
    let orders = await OrderHistory.find({ itemUuid: id }).select('-hash');
    return orders;
}

async function getOrderByCategoryUuid(id) {
    let items = await OrderHistory.find({ categoryUuid: id }).select('-hash');
    return items;
}


async function create(userParam) {
    const orderHistory = new OrderHistory(userParam);

    await orderHistory.save();

}

async function _delete(id) {
    await OrderHistory.findByIdAndRemove(id);
}

async function update(id, userParam) {

    const order = await OrderHistory.findById(id);

    // validate
    if (!order) throw 'OrderHistory not found';

    Object.assign(order, userParam);
    await order.save();
}
