import json5 from "json5";

export const startParser = {
  validate: function (data) {
    let isValid = true;
    Object.keys(this.definition).forEach((def) => {
      if (!data[def]) isValid = false;
    });
    return isValid;
  },
  isMyTypeOfEvent: function (data) {
    // check if this event stream line is a start line
    return data.type === "start";
  },
  definition: {
    type: "string",
    timestamp: "Number",
    select: "Array",
    group: "Array"
  }
};

export const dataParser = {
  validate: function (data) {
    let isValid = true;
    Object.keys(this.definition).forEach((def) => {
      if (!data[def]) isValid = false;
    });
    return isValid;
  },
  isMyTypeOfEvent: function (data) {
    // check if this event stream line is a data line
    return data.type === "data";
  },
  definition: {
    type: "string",
    timestamp: "Number"
  }
};

export const stopParser = {
  validate: function (data) {
    let isValid = true;
    Object.keys(this.definition).forEach((def) => {
      if (!data[def]) isValid = false;
    });
    return isValid;
  },
  isMyTypeOfEvent: function (data) {
    // check if this event stream line is a stop line
    return data.type === "stop";
  },
  definition: {
    type: "string",
    timestamp: "Number"
  }
};

export const spanParser = {
  validate: function (data) {
    let isValid = true;
    Object.keys(this.definition).forEach((def) => {
      if (!data[def]) isValid = false;
    });
    return isValid;
  },
  isMyTypeOfEvent: function (data) {
    // check if this event stream line is a span line
    return data.type === "span";
  },
  definition: {
    type: "string",
    timestamp: "Number",
    begin: "Number",
    end: "Number"
  }
};

const parserStrategies = [startParser, spanParser, stopParser, dataParser];

export const parseEventStreamToList = (eventStream) => {
  let eventList = [];

  if (!eventStream || eventStream.length === 0) return [];

  eventStream.split("\n").forEach((eventStreamLine) => {
    const eventObject = json5.parse(eventStreamLine);
    //validate the objects
    parserStrategies.forEach((strategy) => {
      if (strategy.isMyTypeOfEvent(eventObject)) {
        if (strategy.validate(eventObject)) eventList.push(eventObject);
      }
    });
  });
  return eventList;
};
