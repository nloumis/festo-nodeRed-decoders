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

//type of measurement is stored in bytes 5-8
var measurementType = (payloadArray.slice(4, 8));
//Converting the string array to a string
measurementType = measurementType.join("");


//getting 5th and 6th bytes
var measurement1 = payloadArray.slice(14, 16);
measurement1 = measurement1.join("");
var measurement1hex = parseInt(measurement1, 16);
var measurement2 = payloadArray.slice(16, 18);
measurement2 = measurement2.join("");
var measurement2hex = parseInt(measurement2, 16);

var measurement = (measurement1hex << 8 | measurement2hex);

//To be used to store the info
var measurementObject = {};

//Checking what type of measurement arrived
if (measurementType.toString() === "8008"){
    //pressure measurement
    measurementObject.type = "Pressure Differential";
    measurementObject.value = measurement;
}
else if (measurementType.toString() == "0402"){
    //temperature measurement
    measurementObject.type = "Temperature";
    measurementObject.value = (measurement/100);
}


measurementsArray.push(measurementObject);
data.measurements = measurementsArray;
msg.payload = data;

return msg;
