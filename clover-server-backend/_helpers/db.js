const config = require('../config');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Category: require('../categories/categories.model'),
    Item: require('../items/items.model'),
    Image: require('../images/images.model'),
    TableOrder: require('../tableOrder/tableOrder.model'),
    Order: require('../order/order.model'),
    OrderHistory: require('../orderHistory/orderHistory.model'),
    ServerRequest: require('../serverRequest/serverRequest.model'),
    Modifier: require('../shared/modifiers.model'),
    apiAuth: require('../cloverApi/cloverApi.model'),
    Authentication: require('../authentication/authentication.model')
};
