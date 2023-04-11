//Getting the payload from TTN's message
var device_payload = msg.payload.uplink_message.frm_payload;

//Converting from Base64 to hex
var _payload = Buffer.from(device_payload, 'base64');

//Device EUI arrives in xx-aa-bb-cc-dd-ff format
//We need to change it to: xxaabbccddff 
var devEUI = msg.payload.end_device_ids.dev_eui;

var data = {};

data.eui = devEUI;

var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
data.timestamp = timestamp;


var measurementsArray = [];

var socket_status = "";
var power_factor = -1;

var bytes = _payload;

var measurement = {};

for (var i = 0; i < bytes.length;) {
    var channel_id = bytes[i++];
    var channel_type = bytes[i++];
    measurement = {};

    // VOLTAGE
    if (channel_id === 0x03 && channel_type === 0x74) {
        measurement.type = "voltage"
        measurement.value = readUInt16LE(bytes.slice(i, i + 2)) / 10;
        measurementsArray.push(measurement);
        i += 2;
    }
    // ACTIVE POWER
    else if (channel_id === 0x04 && channel_type === 0x80) {
        measurement.type = "active power"
        measurement.value = readUInt32LE(bytes.slice(i, i + 4));
        measurementsArray.push(measurement);
        i += 4;
    }
    // POWER FACTOR
    else if (channel_id === 0x05 && channel_type === 0x81) {
        measurement.type = "power factor"
        measurement.value = bytes[i];
        measurementsArray.push(measurement);
        i += 1;
    }
    // POWER CONSUMPTION
    else if (channel_id === 0x06 && channel_type == 0x83) {
        measurement.type = "power consumption"
        measurement.value = readUInt32LE(bytes.slice(i, i + 4));
        measurementsArray.push(measurement);
        i += 4;
    }
    // CURRENT
    else if (channel_id === 0x07 && channel_type == 0xc9) {
        measurement.type = "current"
        measurement.value = (readUInt16LE(bytes.slice(i, i + 2))) / 100;
        measurementsArray.push(measurement);
        i += 2;
    }
    // STATE
    else if (channel_id === 0x08 && channel_type == 0x70) {
        // decoded.state = bytes[i] == 1 || bytes[i] == 0x11 ? "open" : "close";
        i += 1;
    }
    else if (channel_id === 0xFF && channel_type == 0x3F) {
        // decoded.outage = bytes[i] == 0xFF ? 1 : 0;
    }
    else {
        break;
    }
}


data.measurements = measurementsArray;


/* ******************************************
 * bytes to number
 ********************************************/
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readUInt32LE(bytes) {
    var value =
        (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
}
msg.payload = data;

node.error(msg);
return msg;
