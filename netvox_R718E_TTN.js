//Getting the payload from TTN's message
var device_payload = msg.payload.uplink_message.frm_payload;

//Converting from Base64 to hex
var decoded = Buffer.from(device_payload, 'base64').toString('hex')
var devEUI = msg.payload.end_device_ids.dev_eui;

var data = {};

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

switch (msg.payload.uplink_message.f_port) {
    case 6:

        data.eui = devEUI;
        var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        data.timestamp = timestamp;

        var measurementsArray = []
        var payloadArray = decoded.split("");
       
        //getting 3rd byte - Report Type
        var reportTypeHex = payloadArray.slice(4, 6);
        reportTypeHex = reportTypeHex.join("");
        var reportTypeDecimal = parseInt(reportTypeHex, 16);

        if (reportTypeDecimal === 0){
            //don't care
        }
        else if (reportTypeDecimal===1){

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
                volt = hex / 10;

            var measurement1 = {
                type: "voltage",
                value: volt
            }
            measurementsArray.push(measurement1);

            // -------------------------------
            // AccelerationX
            // --------------------------------
            //getting 5th and 6th bytes
            var accelX1 = payloadArray.slice(8, 10);
            accelX1 = accelX1.join("");
            var accelX1hex = parseInt(accelX1, 16);
           // node.error(accelX1hex);
            var accelX2 = payloadArray.slice(10, 12);
            accelX2 = accelX2.join("");
            var accelX2hex = parseInt(accelX2, 16); 
           // node.error(accelX2hex);

            var accelerationX = parseFloat(float32Process(accelX2hex << 8 | accelX1hex).toFixed(6));

           // node.error(velocityX);

            var measurement2 =
            {
                type: "accelerationX",
                value: accelerationX
            }
            measurementsArray.push(measurement2);


            // -------------------------------
            // AccelerationY
            // --------------------------------
            //getting 7th and 8th bytes
            var accelY1 = payloadArray.slice(12, 14);
            accelY1 = accelY1.join("");
            var accelY1hex = parseInt(accelY1, 16);
           // node.error(accelY1hex);
            var accelY2 = payloadArray.slice(14, 16);
            accelY2 = accelY2.join("");
            var accelY2hex = parseInt(accelY2, 16);
         //  node.error(accelY2hex);

            var accelerationY = parseFloat(float32Process(accelY2hex << 8 | accelY1hex).toFixed(6));

           // node.error(velocityY);
            var measurement3 =
            {
                type: "accelerationY",
                value: accelerationY
            }
            measurementsArray.push(measurement3);

            // -------------------------------
            // AccelerationZ
            // --------------------------------
            //getting 9th and 10th bytes
            var accelZ1 = payloadArray.slice(16, 18);
            accelZ1 = accelZ1.join("");
            var accelZ1hex = parseInt(accelZ1, 16);
            var accelZ2 = payloadArray.slice(18, 20);
            accelZ2 = accelZ2.join("");
            var accelZ2hex = parseInt(accelZ2, 16);
         

            var accelerationZ = parseFloat(float32Process(accelZ2hex << 8 | accelZ1hex).toFixed(6));

          
            var measurement4 =
            {
                type: "accelerationZ",
                value: accelerationZ
            }
            measurementsArray.push(measurement4);

        }
        else if(reportTypeDecimal===2){

            node.error("Report type 2");
            //TODO on 15/03/2023

            // -------------------------------
            // VelocityX
            // --------------------------------
            //getting 4th and 5th bytes
            var velocityX1 = payloadArray.slice(6, 8);
            velocityX1 = velocityX1.join("");
            var velocityX1hex = parseInt(velocityX1, 16);
            
            var velocityX2 = payloadArray.slice(8, 10);
            velocityX2 = velocityX2.join("");
            var velocityX2hex = parseInt(velocityX2, 16);
            
            var velocityX = parseFloat(float32Process(velocityX2hex << 8 | velocityX1hex).toFixed(6));

            // node.error(velocityX);

            var measurement1 =
            {
                type: "velocityX",
                value: velocityX
            }
            measurementsArray.push(measurement1);

            // -------------------------------
            // VelocityY
            // --------------------------------
            //getting 6th and &th bytes
            var velocityY1 = payloadArray.slice(10, 12);
            velocityY1 = velocityY1.join("");
            var velocityY1hex = parseInt(velocityY1, 16);

            var velocityY2 = payloadArray.slice(12, 14);
            velocityY2 = velocityY2.join("");
            var velocityY2hex = parseInt(velocityY2, 16);

            var velocityY = parseFloat(float32Process(velocityY2hex << 8 | velocityY1hex).toFixed(6));

            // node.error(velocityX);

            var measurement2 =
            {
                type: "velocityY",
                value: velocityY
            }
            measurementsArray.push(measurement2);

            // -------------------------------
            // VelocityZ
            // --------------------------------
            //getting 6th and &th bytes
            var velocityZ1 = payloadArray.slice(14, 16);
            velocityZ1 = velocityZ1.join("");
            var velocityZ1hex = parseInt(velocityZ1, 16);

            var velocityZ2 = payloadArray.slice(16, 18);
            velocityZ2 = velocityZ2.join("");
            var velocityZ2hex = parseInt(velocityZ2, 16);

            var velocityZ = parseFloat(float32Process(velocityZ2hex << 8 | velocityZ1hex).toFixed(6));

            // node.error(velocityX);

            var measurement3 =
            {
                type: "velocityZ",
                value: velocityZ
            }
            measurementsArray.push(measurement3);



            // -------------------------------
            // TEMPERATURE
            // --------------------------------
        
            var temperature = payloadArray.slice(18,22);
            temperature = temperature.join("");
            var temperatureDecimal = parseInt(temperature,16);
            temperatureDecimal = temperatureDecimal/10
            var measurement4 =
            {
                type: "temperature",
                value: temperatureDecimal
            }
            measurementsArray.push(measurement4);

        }

        data.measurements = measurementsArray;

        msg.payload = data;
        node.error(data);
        break;
    case 7:
        //TODO
        // NOT NECESSARY TO FETCH DATA. USED FOR CONFIGURATION
        break;

}


return msg;
