const db = require('../_helpers/db');
const Image = db.Image;

module.exports = {
    getAllCategories,
    getAllItems,
    getById,
    create,
    update,
    delete: _delete
};

async function getAllCategories(mId) {
    console.log("getAllCategories : ", mId);
    return await Image.find({ merchantId: mId, isCategory: true});
}

async function getAllItems(mId) {
    console.log("getAllItems: ", mId);
    return await Image.find({ merchantId: mId, isCategory: false});
}

async function getById(mId, categoryId) {
    return await Image.findOne({ merchantId: mId, cloverDataId: categoryId, isCategory: true }).select('-hash');
}

async function create(userParam) {
    // validate
    // if (await Image.findOne({ imageName: userParam.imageName })) {
    //     throw 'Image "' + userParam.imageName + '" is already taken';
    // }

    const image = new Image(userParam);
    // image.imageData = userParam.imageData;
    Object.assign(image, userParam);

    // save language
    await image.save();
}

async function update(userParam) {
    // validate
    // if (await Image.findOne({ imageName: userParam.imageName })) {
    //     throw 'Image "' + userParam.imageName + '" is already taken';
    // }
    console.log("Images services :", userParam.cloverDataId)
    const image = new Image(userParam);
    // image.imageData = userParam.imageData;
    // image.imageName = userParam.imageName;
    // image.imageType = userParam.imageType;
    //  Object.assign(image, userParam);

    console.log("update image check");

    const existingImage = await Image.findOne({ merchantId: userParam.merchantId, cloverDataId: userParam.cloverDataId });

    console.log("update image found? ", image.cloverDataName);
    if (!existingImage) {
        // save image
        console.log("Saving image  ");
        await image.save();
    }
    else {
        //   Object.assign(image, userParam);
        // console.log("old image  ", existingImage.imageData );
        await existingImage.updateOne({ $set: { imageData: userParam.imageData } });
    }

}

async function _delete(id) {
    await Image.findByIdAndRemove(id);
}
