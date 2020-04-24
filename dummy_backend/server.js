const WebSocket = require('ws');
const InstrumentTracker = require('./utils.js');

const port = 65432;
const websocket_server = new WebSocket.Server({ port: port });

console.log('Server operational. Accepting connections on port ' + port);

const interval = 200;
const instruments = ["EURUSD", ];

const capacity = 5;

let tracking = {};
instruments.forEach(instrument => {
    tracking[instrument] = new InstrumentTracker(instrument, capacity)
})

let prices = {}
for (const instrument of instruments) {
    let price = getRandomFloat(100.0, 200.0);
    prices[instrument] = {};
    prices[instrument]["bid"] = price;
    prices[instrument]["ask"] = price + 0.5;
}

let timer = null;

function getRandomInteger(maximum) {
    return Math.floor(Math.random() * maximum);
}


function getRandomElementOf(array) {
    return array[getRandomInteger(array.length)];
}


function getRandomFloat(minimum, maximum) {
    return Math.random() * (maximum - minimum) + minimum;
}


function updatePrices(instrument) {
    let movement = getRandomFloat(-1.0, 1.0);
    prices[instrument]["bid"] += movement;
    prices[instrument]["ask"] += movement;
}


function getMessage(instrument) {
    let price = prices[instrument];
    return JSON.stringify(
        {
            "time": Date.now() / 1000.0,
            "instrument": instrument,
            "bid": price["bid"],
            "ask": price["ask"]
        }
    )
}


function messageFactory(connectedSocket) {
    let sendMessage = () => {

        // this simulates messages from the LMAX API
        // generate message string
        let instrument = getRandomElementOf(instruments);
        updatePrices(instrument);
        let message = getMessage(instrument);
        // console.log(message);

        // this is the entry point in the real socket server
        // intercept message string and dispatch
        data = JSON.parse(message);
        tracking[data.instrument].update(data);

        // create message to send to clients
        message = tracking[data.instrument].getMessage();
        console.log(message);

        // send to clients
        websocket_server.clients.forEach(function each(client) {
            if (client !== connectedSocket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
            if (client.isAlive === false) {
                client.terminate();
            }
        });

    }
    return sendMessage;
}


websocket_server.on('connection', function connection(websocket) {
    console.log('Client connected, sending random messages...');
    if (timer == null) {
        timer = setInterval(messageFactory(websocket), interval);
    }
});
