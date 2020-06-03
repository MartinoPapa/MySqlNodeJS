const http = require('http');
const port = 8080;
const WebSocketServer = require('websocket').server;

var SqlConnection = require('mysql').createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database: "database",
    port: 1433
});

const server = http.createServer();
server.listen(port);
console.log("server is listening on port " + port)

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        console.log(message.utf8Data);
        query(message.utf8Data, connection);
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
    });
});


function query(query, connection) {
    SqlConnection.query(query, function (err, result, fields) {
        if (err) throw err;
        connection.sendUTF(JSON.stringify(result));  
        console.log(result);
    });

}

