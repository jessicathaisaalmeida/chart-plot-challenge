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

it("should return null when data is null", () => {
  let string = null;
  expect(parser.getValueFromString(string)).toBe(null);
});

it("should return null when data string is null", () => {
  let string = "null";
  expect(parser.getValueFromString(string)).toBe(null);
});
