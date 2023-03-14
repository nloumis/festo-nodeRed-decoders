//Getting the payload from TTN's message
var device_payload = msg.payload.uplink_message.frm_payload;

//Converting from Base64 to hex
var decoded = Buffer.from(device_payload, 'base64').toString('hex')

//Getting dev eui
var devEUI = msg.payload.end_device_ids.dev_eui;
function getDeviceName(dev) {
    var deviceName = {
        26: "R718DA",
        27: "R718DB",
        33: "R718J",
        37: "R718LB",
        39: "R718MBA",
        79: "R311FA",
        91: "R718Q",
        130: "R730MBA",
        137: "R730DA",
        139: "R730DB",
        141: "R730LB",
        151: "R718QA",
        168: "R311DA",
        169: "R311DB",
        183: "R720F"
    };
    return deviceName[dev];
}
var data = {};
switch (msg.payload.uplink_message.f_port) {
    case 6:

        data.eui = devEUI;
        var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        data.timestamp = timestamp;


        var measurementsArray=[]

       
        var payloadArray = decoded.split("");
        //getting the 2nd Byte from the Hex
        var deviceTypeHex = payloadArray.slice(2, 4);
        deviceTypeHex = deviceTypeHex.join("");
        var deviceTypeDecimal = parseInt(deviceTypeHex, 16);
        // data.Device = getDeviceName(deviceTypeDecimal);

        //getting 3rd byte - Report Type
        var reportTypeHex = payloadArray.slice(4, 6);
        reportTypeHex = reportTypeHex.join("");
        var reportTypeDecimal = parseInt(reportTypeHex, 16);

        //getting 4th byte - Battery
        var batteryHex = payloadArray.slice(6, 8);
        batteryHex = batteryHex.join("");
        var hex = parseInt(batteryHex, 16);

        var volt;
        if (hex & 0x80) {
            var tmp_v = hex & 0x7F;
            volt = tmp_v / 10;
            // data.Volt = (tmp_v / 10);
        }
        else
            // data.Volt = hex/10;
            volt = hex/10;
        
        var measurement1 = {
            type: "voltage",
            value: volt
        }
        measurementsArray.push(measurement1);

        //getting 5th byte - Status
        var statusHex = payloadArray.slice(8, 10);
        statusHex = statusHex.join("");
        var statusHexDecimal = parseInt(statusHex, 16);

        // data.Status = statusHexDecimal;
        var measurement2 = {
            type: "vibration",
            value: statusHexDecimal
        }
        measurementsArray.push(measurement2);

        data.measurements = measurementsArray;
        
        msg.payload = data;
        break;
    case 7:
        //TODO
        // NOT NECESSARY TO FETCH DATA. USED FOR CONFIGURATION
        break;

}

return msg;
