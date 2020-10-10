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

function getPropsFromSimpleString(data) {
  let props = {};
  data.split(",").forEach((prop) => {
    let propName = prop.split(":")[0].trim();
    let propValue = prop.split(":")[1];
    propValue = propValue.trim();
    propValue = getValueFromString(propValue);

    props[propName] = propValue;
  });
  return props;
}

const propsDefinitions = {
  timestamp: "Number",
  select: "Array",
  group: "Array"
};

export const parseEventStreamToList = (eventStream) => {
  let instructions = [];
  eventStream.split("\n").forEach((row) => {
    row = row
      .trim()
      .substring(1, row.length - 1)
      .split("type:")[1]
      .trim();

    if (row.indexOf("start") !== -1) {
      while (row.indexOf(",") !== -1) {
        row = row.substring(row.indexOf(",") + 1).trim();
        let props = {};
        Object.keys(propsDefinitions).forEach((key) => {
          if (row.indexOf(key) !== -1) {
            let final = 0;
            if (propsDefinitions[key] === "Array") {
              final = row.indexOf("]");
              let propsAuxiliar = row.substring(0, final);
              let propName = propsAuxiliar.split(":")[0].trim();
              let propValue = propsAuxiliar.split(":")[1];
              propValue = getArrayFromString(propValue);
              props[propName] = propValue;
              row = row.substring(final + 1);
              final = row.indexOf(",");
            } else {
              final = row.indexOf(",");
              let propsAuxiliar = getPropsFromSimpleString(
                row.substring(0, final)
              );
              props[key] = propsAuxiliar[key];
            }
            row = row.substring(final + 1);
          }
        });

        if (Object.keys(props).length > 0) {
          props["type"] = "start";
          instructions.push(props);
        }
      }
    } else {
      let props = getPropsFromSimpleString(row.substring(row.indexOf(",") + 1));
      props["type"] = row.substring(1, row.indexOf(",") - 1).trim();
      instructions.push(props);
    }
  });

  return instructions;
};
