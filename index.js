const http = require('http');
const port = 8080;
const WebSocketServer = require('websocket').server;

const msgType = {
    "login": 0,
    "query": 1
}

const server = http.createServer();
server.listen(port);
console.log("server is listening on port " + port)

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        var msg = JSON.parse(message.utf8Data)
        messageManager(msg, connection);
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

function messageManager(msg, connection) {
    switch (msg.type) {
        case msgType.query:
            queryManager(msg, function (err, data) {
                if (err) {
                    SendMessage(msgType.query, false, JSON.stringify(err), connection)
                } else {
                    SendMessage(msgType.query, true, JSON.stringify(data), connection)
                }
            });
            break;
        case msgType.login:
            connectionManager(msg, function (err, data) {
                if (err) {
                    SendMessage(msgType.login, false, "", connection);
                } else {
                    SendMessage(msgType.login, true, "", connection);
                }
            });
            break;
    }

}

function queryManager(msg, callback) {
    var SqlConnection = require('mysql').createConnection({
        host: "localhost",
        user: msg.username,
        password: msg.password,
        database: "videonoleggio",
        port: 1433
    });
    SqlConnection.query(msg.query, function (err, result, fields) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

function connectionManager(msg, callback) {
    var SqlConnection = require('mysql').createConnection({
        host: "localhost",
        user: msg.username,
        password: msg.password,
        database: "videonoleggio",
        port: 1433
    });

    SqlConnection.connect(function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });

    SqlConnection.end();
}

function SendMessage(type, result, data, connection) {
    var msg = {
        "type": type,
        "result": result,
        "data": data,
    }
    connection.sendUTF(JSON.stringify(msg));
}