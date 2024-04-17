const db = require('../_helpers/db');
const RequestServer = db.ServerRequest;

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
    create,
    delete: _delete
};

async function getAll(id) {
    return await RequestServer.find({ orgUuid: id }).select('-hash');
}

async function create(userParam) {
    // validate
    if (await RequestServer.findOne({ messageData: userParam.messageData, orgUuid: userParam.orgUuid })) {
        let serverRequest = await RequestServer.findOne({ messageData: userParam.messageData });
        serverRequest.createdDate = Date.now();
        await serverRequest.save();
        pusher.trigger('server-request', 'server-request-created', {
            "orgUuid": userParam.orgUuid,
            "message": serverRequest.messageData
        });
    }else {
        const serverRequest = new RequestServer(userParam);
        // save item
        await serverRequest.save();
        pusher.trigger('server-request', 'server-request-created', {
            "orgUuid": userParam.orgUuid,
            "message": serverRequest.messageData
        });
    }
}

async function _delete(id) {
    await RequestServer.findByIdAndRemove(id);
}
