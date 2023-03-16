//Getting the payload from TTN's message
var _payload = msg.payload;

var devEui = msg.eui.toString();

var data = {};

data.eui = devEui.replace(/\-/g,"");

var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
data.timestamp = timestamp;


var measurementsArray = []

//Getting type of measurement
var measurementType = _payload[2];

var measurement = (_payload[7] << 8 | _payload[8]);

var measurementObject ={};
if(measurementType == 0x80){
    //presure measurement
    measurementObject.type = "Differential pressure";
    measurementObject.value = measurement;
}
else{
    //Temperature
    measurementObject.type = "Temperature";
    measurementObject.value = (measurement/100);
}


measurementsArray.push(measurementObject);

data.measurements = measurementsArray;

msg.payload = data;

return msg;
