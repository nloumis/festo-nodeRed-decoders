var data = {};
data.eui = msg.payload.deviceSerialNumber;

var measurementsArray=[];
let measurementsEvents = msg.payload.measurementsEvents; 
data.timestamp="";

for (var i = 0; i<  measurementsEvents.length; i++){
    let _type = measurementsEvents[i].channelType.toLowerCase();

    let events = measurementsEvents[i].events;
    //iterating through the measurements of this type
    for (var j = 0; j < events.length; j++){
        let _value = events[j].value;
        data.timestamp = events[j].timestamp;
        var measurement ={}
        measurement.type = _type;
        measurement.value = _value;
        measurementsArray.push(measurement);
        data.measurements= measurementsArray;
        //sending every message individually as the timestamps are unique per value. 
        //This is because the device can store measurements in a buffer before uploading them
        msg.payload = data;
        node.send(msg);
        measurementsArray=[];
    }
}

return ;
