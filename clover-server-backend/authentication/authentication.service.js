 const db = require('../_helpers/db');
const cloverCredentials = db.Authentication;

module.exports = {
    saveClientCredentials,
    getMerchantId,
    getCloverToken
};


async function saveClientCredentials(userParam) {

    const credentials = new cloverCredentials(userParam);
    const existingCredentials = await cloverCredentials.findOne({ merchantId: userParam.merchantId, clientId: userParam.clientId});

    if(!existingCredentials)
    {
    // save user
    await credentials.save();
    }
}     

async function getMerchantId(userParam)
{
    let storedMerchantId = await cloverCredentials.findOne({merchantId: userParam.merchant_id});

    return storedMerchantId.merchantId;
}

async function getCloverToken(userParam)
{
    let storedCloverToken = await cloverCredentials.findOne({merchantId: userParam.merchant_id});

    return storedCloverToken.cloverToken;
}