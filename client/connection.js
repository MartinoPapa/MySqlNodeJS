const ws = new WebSocket('ws://localhost:8080/');
var username;
var password;
var login = false;

const msgType = {
    "login": 0,
    "query": 1
}

ws.onopen = function () {
    console.log('Connected to ' + ws.url);
};

ws.onmessage = function (e) {
    msg = JSON.parse(e.data);
    switch (msg.type) {
        case msgType.query:
            var data = JSON.parse(msg.data);
            if(msg.result){
                console.log(data);
            }
            else{
                console.warn(data.sqlMessage);
            }
            break;
        case msgType.login:
            console.log(msg);
            if(msg.result){
                login = true;
                console.log("logged in!")
                document.getElementById("login").style.display = "none";
                document.getElementById("queryForm").style.display = "inline";
            }
            else{
                login = false;
                console.log("login failed!")
            }
            break;
    }
};

function SendMessage(query, type) {
    var msg = {
        "type": type,
        "username": username,
        "password": password,
        "query": query
    }
    ws.send(JSON.stringify(msg));
}

function Login() {
    password = document.getElementById("password").value;
    username = document.getElementById("username").value;
    SendMessage("", msgType.login);
}

function Query(query){
    if(login){
        SendMessage(query, msgType.query);
    }
    else{
        console.log("you are not logged in");
    }
}