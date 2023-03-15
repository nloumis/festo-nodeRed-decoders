//Getting the payload from TTN's message
var device_payload = msg.payload.uplink_message.frm_payload;

//Converting from Base64 to hex
var decoded = Buffer.from(device_payload, 'base64').toString('hex')
var devEUI = msg.payload.end_device_ids.dev_eui;

var data = {};

data.eui = devEUI;
var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
data.timestamp = timestamp;

var measurementsArray = []
var payloadArray = decoded.split("");

//Current value are 15-22
var sliced = payloadArray.slice(14, 22);
//Converting the string array to a string
sliced = sliced.join("");
//Parsing the string to hex
var buf = new Buffer(sliced, "hex");
//parsing the hex to float
var number = buf.readFloatBE(0).toFixed(5);


var measurement1 = {
    type: "current",
    value: number
}

measurementsArray.push(measurement1);

data.measurements = measurementsArray;

msg.payload = data;

return msg;
