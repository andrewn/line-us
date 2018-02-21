const parse = require("./parse");
const { body, pairs, status } = parse;

describe("parse", () => {
  const hello = `hello VERSION:"1.0.1 Feb 11 2018 15:47:35" NAME:line-us SERIAL:990055`;
  const ok = "ok X:1000 Y:1000 Z:1000";
  const error = "error";

  test("knows about statuses", () => {
    expect(status(hello)).toEqual("hello");
    expect(status(ok)).toEqual("ok");
    expect(status(error)).toEqual("error");
  });

  test("knows about message body", () => {
    expect(body(hello)).toEqual(
      `VERSION:"1.0.1 Feb 11 2018 15:47:35" NAME:line-us SERIAL:990055`
    );
    expect(body(ok)).toEqual("X:1000 Y:1000 Z:1000");
    expect(body(error)).toEqual("");
  });

  test("parses body into key/value pairs", () => {
    expect(pairs(body(hello))).toEqual({
      VERSION: "1.0.1 Feb 11 2018 15:47:35",
      NAME: "line-us",
      SERIAL: "990055"
    });
    expect(pairs(body(ok))).toEqual({
      X: "1000",
      Y: "1000",
      Z: "1000"
    });
    expect(pairs(body(error))).toEqual({});
  });

  test("parses hello message", () => {
    expect(parse(hello)).toEqual({
      STATUS: "hello",
      VERSION: "1.0.1 Feb 11 2018 15:47:35",
      NAME: "line-us",
      SERIAL: "990055"
    });
  });
});
