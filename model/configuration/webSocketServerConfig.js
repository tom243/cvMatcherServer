/*jslint node: true */
"use strict";

var WebSocketServerInit = require("ws").Server;

module.exports = function (server) {

    var webSocketServer = new WebSocketServerInit({server: server});
    var webSockets = {};// userID: webSocket

    webSocketServer.on("connection", function (webSocket) {

        var userID = webSocket.upgradeReq.url.substr(1);
        webSockets[userID] = webSocket;

        /* when message is received */
        webSocket.on("message", function (message) {
            console.log("received from " + userID + ": " + message);
            var messageArray = JSON.parse(message);
            var toUserWebSocket = webSockets[messageArray.user];
            if (toUserWebSocket) {
                console.log("sent to " + messageArray.user + ": " + JSON.stringify(messageArray));
                messageArray[0] = userID;
                toUserWebSocket.send(JSON.stringify(messageArray)); // send message
            }
        });

        webSocket.on("close", function () {
            delete webSockets[userID];
        });
    });

};