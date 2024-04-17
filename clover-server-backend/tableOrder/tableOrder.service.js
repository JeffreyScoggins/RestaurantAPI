const db = require('../_helpers/db');
const TableOrder = db.TableOrder;

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
    getItemByTableUuid,
    create,
    update,
    delete: _delete
};

async function getAll(id) {
    return await TableOrder.find( {orgUuid: id}).select('-hash');
}

async function getById(id) {
    return await TableOrder.findById(id);
}

async function getItemByTableUuid(id) {
    let orders = await TableOrder.find({ tableUuid: id }).select('-hash');
    return orders;
}


async function create(userParam) {
    // validate
  let tableData = await TableOrder.findOne({ tableUuid: userParam.tableUuid });
    if (tableData) {
        console.log("Found table order");
        tableData.total += userParam.total;
        tableData.orderItems = tableData.orderItems.concat(userParam.orderItems);
        await tableData.save();
        pusher.trigger('order-channel', 'tableOrder-added', {
            "orgUuid": userParam.orgUuid,
            "message": "hello world"
        });
    }else {
        console.log("creating table order");
        const tableData = new TableOrder(userParam);
        // save item
        await tableData.save();
        pusher.trigger('order-channel', 'tableOrder-added', {
            "orgUuid": userParam.orgUuid,
            "message": "hello world"
        });
    }
}

async function update(id, userParam) {

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.

    const tableHistory = await TableOrder.findById(id);

    // validate
    if (!tableHistory) throw 'TableHistory not found';

    Object.assign(tableHistory, userParam);
    await tableHistory.save();
  } else {
    return;
  }
}

async function _delete(id) {
    await TableOrder.findByIdAndRemove(id);
}
