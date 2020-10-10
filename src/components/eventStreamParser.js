export const getValueFromString = (data) => {
  if (!data) return null;
  data = data.trim();
  if (data.indexOf("null") !== -1) return null;
  if (data[0] === "'") return data.substring(1, data.length - 1);
  else if (!isNaN(data) && !isNaN(parseFloat(data))) return Number(data);
  else if (data[0] === "[") return getArrayFromString(data);
};

function getArrayFromString(data) {
  if (!data) return null;
  data = data.trim().substring(1, data.length - 1);
  let theArray = [];

  data.split(",").forEach((element) => {
    theArray.push(getValueFromString(element));
  });
  return theArray;
}

export const getPropsFromSimpleString = (data) => {
  let props = {};
  if (!data) return null;
  data.split(",").forEach((prop) => {
    let propName = prop.split(":")[0].trim();
    let propValue = prop.split(":")[1];
    if (propValue) {
      propValue = propValue.trim();
      propValue = getValueFromString(propValue);
    }

    props[propName] = propValue;
  });
  return props;
};

export const findPropStringInStringEvent = (key, theType, eventString) => {
  if (eventString.indexOf(key) === -1) return null;
  if (theType === "Array") {
    let final = eventString.indexOf("]", eventString.indexOf(key));

    //separate the key from the value of the property and treat the value
    return eventString.substring(eventString.indexOf(key), final);
  } else {
    let final = eventString.indexOf(",", eventString.indexOf(key));
    return eventString.substring(eventString.indexOf(key), final);
  }
};

export const parseEventStringToObject = (eventString) => {
  /* a string is very well formed:
   *  with the keys:
   *      type: "String",
   *      timestamp: "Number",
   *      select: "Array",
   *      group: "Array"
   *  each kind of prop, from the definition, is searched in the eventString
   */
  let startPropsDefinitions = {
    type: "String",
    timestamp: "Number",
    select: "Array",
    group: "Array"
  };

  let props = {};

  //if type is start we get O

  eventString = eventString.replace("{", "").replace("}", "");

  let isStart =
    getPropsFromSimpleString(
      findPropStringInStringEvent("type", "String", eventString)
    ).type === "start";

  if (isStart)
    Object.keys(startPropsDefinitions).forEach((key) => {
      if (eventString.indexOf(key) !== -1) {
        let eventPropString = findPropStringInStringEvent(
          key,
          startPropsDefinitions[key],
          eventString
        );
        if (startPropsDefinitions[key] === "Array") {
          //separate the key from the value of the property and treat the value
          let propName = eventPropString.split(":")[0].trim();
          let propValue = eventPropString.split(":")[1];
          propValue = getArrayFromString(propValue);

          //generate the key/value pair of the prop
          props[propName] = propValue;
        } else {
          //get the prop (key/value pair) from the patch
          let propsAuxiliar = getPropsFromSimpleString(
            eventPropString.substring(eventPropString.indexOf("{") + 1)
          );
          props[key] = propsAuxiliar[key];
        }
      }
    });
  else return getPropsFromSimpleString(eventString);
  return props;
};

export const parseEventStreamToList = (eventStream) => {
  let eventList = [];
  eventStream.split("\n").forEach((eventString) => {
    // spcilly treats a start type event because of the arrays inside
    let event = parseEventStringToObject(eventString);
    if (event && Object.keys(event).length > 0) eventList.push(event);
  });
  console.log(eventList);

  return eventList;
};
