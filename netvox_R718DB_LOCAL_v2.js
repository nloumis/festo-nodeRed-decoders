// This version to be used when LORA input node is set to "Data Type: Bytes"

var _payload = msg.payload;

//Device EUI arrives in xx-aa-bb-cc-dd-ff format
//We need to change it to: xxaabbccddff 
var devEui = msg.eui.toString();

var data = {};
switch (msg.port) {
    case 6:
        
        data.eui = devEui.replace(/\-/g,"");
        //Getting a timestamp
        var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        data.timestamp = timestamp;

        //Creating empty array to store the data
        var measurementsArray=[]


        //getting 4th byte - Battery
        var hex = _payload[3];

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
        var statusHexDecimal = _payload[4];

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
