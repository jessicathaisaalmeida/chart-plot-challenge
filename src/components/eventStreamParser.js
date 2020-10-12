import json5 from "json5";

const startParser = {
  validate: function (data) {
    // is valid parset command?
    return true;
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

const dataParser = {
  validate: function (data) {
    // is valid parset command?
    return true;
  },
  isMyTypeOfEvent: function (data) {
    // check if this event stream line is a data line
    return data.type === "data";
  }
};

const stopParser = {
  validate: function (data) {
    // is valid parset command?
    return true;
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

const spanParser = {
  validate: function (data) {
    // is valid parset command?
    return true;
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
  let line = 0;
  eventStream.split("\n").forEach((eventStreamLine) => {
    line++;
    eventList.push(json5.parse(eventStreamLine));
    //validate the objects
  });

  return eventList;
};
