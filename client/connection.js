const ws = new WebSocket('ws://localhost:8080/');

ws.onopen = function () {
    console.log('Connected to ' + ws.url);
};

ws.onmessage = function (e) {
    data = JSON.parse(e.data);
    console.log(data);
};

function SendMessage(query) {
    console.log(query);
    ws.send(query);
}