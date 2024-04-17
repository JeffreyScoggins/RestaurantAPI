const db = require('../_helpers/db');
const Category = db.Category;

module.exports = {
    getAll,
    getById,
    create,
    delete: _delete
};

async function getAll(id) {
    return await Category.find({ orgUuid: id}).select('-hash');
}

async function getById(id) {
    return await Category.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    // if (await Category.findOne({ categoryName: userParam.categoryName })) {
    //     throw 'Category "' + userParam.categoryName + '" is already taken';
    // }

    const category = new Category(userParam);
    category.imageData = userParam.imageData;
    category.imageName = userParam.imageName;
    category.imageType = userParam.imageType;
    Object.assign(category, userParam);

    // save language
    await category.save();
}

async function _delete(id) {
    await Category.findByIdAndRemove(id);
}
