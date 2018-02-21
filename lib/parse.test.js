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

  // test("splits body into pairs", () => {
  //   expect(
  //     pairs(`VERSION:"1.0.1 Feb 11 2018 15:47:35" NAME:line-us SERIAL:990055`)
  //   ).toEqual([
  //     `VERSION:"1.0.1 Feb 11 2018 15:47:35"`,
  //     "NAME:line-us",
  //     "SERIAL:990055"
  //   ]);
  //   expect(pairs("X:1000 Y:1000 Z:1000")).toEqual([
  //     "X:1000",
  //     "Y:1000",
  //     "Z:1000"
  //   ]);
  //   expect(pairs(" ")).toEqual("");
  //   expect(pairs("")).toEqual("");
  // });

  // test("parses key from pair", () => {
  //   expect(key(`VERSION:"1.0.1 Feb 11 2018 15:47:35"`)).toEqual("VERSION");
  //   expect(key(`NAME:line-us`)).toEqual("NAME");
  //   expect(key(`SERIAL:990055`)).toEqual("SERIAL");
  //   expect(key(`X:1000`)).toEqual("X");
  //   expect(key(`1000`)).toEqual("");
  // });

  // test("parses value from pair", () => {
  //   expect(value(`VERSION:"1.0.1 Feb 11 2018 15:47:35"`)).toEqual(
  //     "1.0.1 Feb 11 2018 15:47:35"
  //   );
  //   expect(value(`NAME:line-us`)).toEqual("line-us");
  //   expect(value(`SERIAL:990055`)).toEqual("990055");
  //   expect(value(`X:1000`)).toEqual("1000");
  //   expect(value(`1000`)).toEqual("");
  // });

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
