require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
const jwt = require('./clover-server-backend/_helpers/jwt');
const errorHandler = require('./clover-server-backend/_helpers/error-handler');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.use(express.static(__dirname + '/dist/softServer'));

// app.get('/*', function(req,res) {
//
//   res.sendFile(path.join(__dirname+'/dist/softServer/index.html'));
// });

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./clover-server-backend/users/users.controller'));
app.use('/cloverApi', require('./clover-server-backend/cloverApi/cloverApi.controller'));
app.use('/cloverOrders', require('./clover-server-backend/cloverOrders/cloverOrders.controller'));
app.use('/categories', require('./clover-server-backend/categories/categories.controller'));
app.use('/items', require('./clover-server-backend/items/items.controller'));
app.use('/images', require('./clover-server-backend/images/images.controller'));
app.use('/tableOrder', require('./clover-server-backend/tableOrder/tableOrder.controller'));
//app.use('/orders', require('./clover-server-backend/order/order.controller'));
//app.use('/orders', require('./clover-server-backend/cloverOrders/cloverOrders.controller'));
app.use('/orderHistory', require('./clover-server-backend/orderHistory/orderHistory.controller'));
app.use('/serverRequest', require('./clover-server-backend/serverRequest/serverRequest.controller'));
app.use('/clientCredentials', require('./clover-server-backend/authentication/authentication.controller'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname+'/dist/softServer/index.html'));
});

// global error handler
app.use(errorHandler);

// start server
console.log('In server.js'); //*MES*
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
