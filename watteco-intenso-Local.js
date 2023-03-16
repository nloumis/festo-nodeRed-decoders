function float32Process(h) {
    var sign = (h & 0x8000) >> 15;
    var exp = (h & 0x7F80) >> 7;
    var fraction = (h & 0x007F) << 16;

    if (exp == 0) {
        return (sign ? -1 : 1) * Math.pow(2, -126) * (fraction / Math.pow(2, 23));
    } else if (exp == 0xFF) {
        return fraction ? NaN : ((sign ? -1 : 1) * Infinity);
    }

    return (sign ? -1 : 1) * Math.pow(2, exp - 127) * (1 + (fraction / Math.pow(2, 23)));
}



//Getting the payload from TTN's message
var _payload = msg.payload;

var devEui = msg.eui.toString();

var data = {};

data.eui = devEui.replace(/\-/g,"");

var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
data.timestamp = timestamp;


var measurementsArray = []


//Getting 
var value1 = _payload[7]; 
var value2 = _payload[8];
var value3 = _payload[9];
var value4 = _payload[10];

var value = (value1*256*256*256+value2*256*256+value3*256+value4);

var valueFloat = float32Process(value);

var measurement1 = {
    type: "current",
    value: valueFloat
}

measurementsArray.push(measurement1);

data.measurements = measurementsArray;

msg.payload = data;

return msg;
