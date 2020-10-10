const parser = require("./../eventStreamParser.js");

it("should parse a single quotted string to a string", () => {
  let string = "'start'";
  expect(parser.getValueFromString(string)).toBe("start");
});

it("should parse a single quotted number to a string", () => {
  let string = "'123'";
  expect(parser.getValueFromString(string)).toBe("123");
});

it("should parse a number to a number", () => {
  let string = "123";
  expect(parser.getValueFromString(string)).toBe(123);
});

it("should parse a float number to a number", () => {
  let string = "12.30";
  expect(parser.getValueFromString(string)).toBe(12.3);
});

it("should parse a single quotted float number to a string", () => {
  let string = "'12.30'";
  expect(parser.getValueFromString(string)).toBe("12.30");
});

it("should parse a single quotted array to a string", () => {
  let string = "'['a','b']'";
  expect(parser.getValueFromString(string)).toBe("['a','b']");
});

it("should parse an array to a array", () => {
  let string = "['a','b']";
  expect(parser.getValueFromString(string)).toStrictEqual(["a", "b"]);
});

//Test ignored to facilitate
/*it("should parse an array of single quotted arrays to a array of strings", () => {
  let string = "['['a']','['b','c']']";
  expect(parser.getValueFromString(string)).toBe(["['a']", "['b','c']"]);
});*/

it("should return null when data is null", () => {
  let string = null;
  expect(parser.getValueFromString(string)).toBe(null);
});

it("should return null when data string is null", () => {
  let string = "null";
  expect(parser.getValueFromString(string)).toBe(null);
});

it("should return a string prop", () => {
  let string = "type : 'start'";
  expect(parser.getPropsFromSimpleString(string)).toStrictEqual({
    type: "start"
  });
});

it("should return a number prop", () => {
  let string = "value : 1234";
  expect(parser.getPropsFromSimpleString(string)).toStrictEqual({
    value: 1234
  });
});

it("should get an object with simple props", () => {
  let string = "type: 'stop', timestamp: 1605013270000";
  expect(parser.getPropsFromSimpleString(string)).toStrictEqual({
    type: "stop",
    timestamp: 1605013270000
  });
});

it("should find the string Patch for a string key", () => {
  let string =
    "type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']";
  expect(parser.findPropStringInStringEvent("type", "", string)).toBe(
    "type: 'start'"
  );
});

it("should find the string Patch for a number key", () => {
  let string =
    "type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']";
  expect(parser.findPropStringInStringEvent("timestamp", "", string)).toBe(
    "timestamp: 1605013270000"
  );
});

it("should find the string Patch for a array key", () => {
  let string =
    "type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']";
  expect(parser.findPropStringInStringEvent("select", "Array", string)).toBe(
    "select: ['min_response_time', 'max_response_time'"
  );
});

it("shouldn't find the string Patch for an absent key", () => {
  let string =
    "type: 'start', timestamp: 1605013270000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']";
  expect(parser.findPropStringInStringEvent("test", "Array", string)).toBe(
    null // TODO: throw an exception
  );
});
