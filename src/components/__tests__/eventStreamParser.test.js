const parser = require("./../eventStreamParser.js");

it("should identify a start event", () => {
  const event = {
    type: "start",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.startParser.isMyTypeOfEvent(event)).toBe(true);
});

it("shouldn't identify a not start event as start one", () => {
  const event = {
    type: "span",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.startParser.isMyTypeOfEvent(event)).toBe(false);
});

it("should validate a right start event", () => {
  const event = {
    type: "start",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.startParser.validate(event)).toBe(true);
});

it("should fail in validation of a bad formatted start event", () => {
  const event = {
    type: "start"
  };
  expect(parser.startParser.validate(event)).toBe(false);
});

it("should identify a span event", () => {
  const event = {
    type: "span",
    timestamp: 1605013270000,
    begin: 1605013270000,
    end: 1605013270000
  };
  expect(parser.spanParser.isMyTypeOfEvent(event)).toBe(true);
});

it("shouldn't identify a not span event as span one", () => {
  const event = {
    type: "start",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.spanParser.isMyTypeOfEvent(event)).toBe(false);
});

it("should validate a right span event", () => {
  const event = {
    type: "span",
    timestamp: 1605013270000,
    begin: 1605013270000,
    end: 1605013270000
  };
  expect(parser.spanParser.validate(event)).toBe(true);
});

it("should fail in validation of a bad formatted span event", () => {
  const event = {
    type: "span"
  };
  expect(parser.spanParser.validate(event)).toBe(false);
});

it("should identify a stop event", () => {
  const event = { type: "stop", timestamp: 1605013270000 };
  expect(parser.stopParser.isMyTypeOfEvent(event)).toBe(true);
});

it("shouldn't identify a not stop event as start one", () => {
  const event = {
    type: "start",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.stopParser.isMyTypeOfEvent(event)).toBe(false);
});

it("should validate a right stop event", () => {
  const event = {
    type: "stop",
    timestamp: 1605013270000
  };
  expect(parser.stopParser.validate(event)).toBe(true);
});

it("should fail in validation of a bad formatted stop event", () => {
  const event = {
    type: "stop"
  };
  expect(parser.stopParser.validate(event)).toBe(false);
});

it("should identify a data event", () => {
  const event = { type: "data", timestamp: 1605013270000 };
  expect(parser.dataParser.isMyTypeOfEvent(event)).toBe(true);
});

it("shouldn't identify a not data event as data one", () => {
  const event = {
    type: "start",
    timestamp: 1605013270000,
    select: ["select1", "select2"],
    group: ["group1", "group2"]
  };
  expect(parser.dataParser.isMyTypeOfEvent(event)).toBe(false);
});

it("should validate a right data event", () => {
  const event = {
    type: "data",
    timestamp: 1605013270000
  };
  expect(parser.dataParser.validate(event)).toBe(true);
});

it("should fail in validation of a bad formatted data event", () => {
  const event = {
    type: "data"
  };
  expect(parser.dataParser.validate(event)).toBe(false);
});

const inicialData = `{type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1605013270000, begin: 1605013270000, end: 1605013330000}
{type: 'data', timestamp: 1605013280000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.5}
{type: 'data', timestamp: 1605013290000, os: 'windows', browser: 'firefox', min_response_time: 0.0, max_response_time: 2.3}
{type: 'stop', timestamp: 1605013360000}`;

it("should parse a 5 lines stream into a list with same number of objects", () => {
  const event = inicialData;
  expect(parser.parseEventStreamToList(event).length).toBe(5);
});

it("should parse an empty stream into an empty list", () => {
  const event = "";
  expect(parser.parseEventStreamToList(event).length).toBe(0);
});
