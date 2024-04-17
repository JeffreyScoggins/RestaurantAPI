const db = require('../_helpers/db');
const Item = db.Item;

module.exports = {
    getAll,
    getById,
    getItemByCategoryUuid,
    create,
    delete: _delete
};

async function getAll(id) {
    return await Item.find({ orgUuid: id });
}

async function getById(id) {
    return await Item.findById(id);
}

async function getItemByCategoryUuid(id) {
    let items = await Item.find({ categoryUuid: id });
    return items;
}


async function create(userParam) {
    // validate
    if (await Item.findOne({ itemUuid: userParam.itemUuid })) {
        throw 'Item with uuid "' + userParam.itemUuid + '" is already taken.';
    }

    const item = new Item(userParam);
    item.imageData = userParam.imageData;
    item.imageName = userParam.imageName;
    item.imageType = userParam.imageType;

    // save item
    await item.save();
}

async function _delete(id) {
    await Item.findByIdAndRemove(id);
}
