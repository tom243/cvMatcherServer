var WebSocketServerInit = require("ws").Server;

module.exports = function(server) {

    var webSocketServer = new WebSocketServerInit({server: server}),
        webSockets = {};// userID: webSocket

    webSocketServer.on('connection', function (webSocket) {
        var userID = parseInt(webSocket.upgradeReq.url.substr(1), 10);
        webSockets[userID] = webSocket;
        console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets));

        webSocket.on('message', function(message) {
            console.log('received from ' + userID + ': ' + message);
            var messageArray = JSON.parse(message);
            var toUserWebSocket = webSockets[messageArray['user']];
            if (toUserWebSocket) {
                console.log('sent to ' + messageArray['user'] + ': ' + JSON.stringify(messageArray));
                messageArray[0] = userID;
                toUserWebSocket.send(JSON.stringify(messageArray))
            }
        });

        webSocket.on('close', function () {
            delete webSockets[userID];
            console.log('deleted: ' + userID)
        })
    });

};
