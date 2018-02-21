const parse = require("./parse");

const LINE_ENDING = "\r\n\0";

const isNumber = n => typeof n === "number";

module.exports = class Protocol {
  constructor(connection) {
    this._connection = connection;
    this._parser = parse;
    this.ready = new Promise((resolve, reject) => {
      this._connection.once("message", message => {
        const parsed = this._parser(message);
        parsed.STATUS === "hello" ? resolve() : reject();
      });
    });
  }

  async disconnect() {
    this._connection.destroy();
  }

  async send(command) {
    await this.ready;

    if (this._connection.destroyed) {
      throw new Error(
        "Cannot send message when underlying connection is closed"
      );
    }

    const encoded = `${command}${LINE_ENDING}`;
    return new Promise(resolve => {
      const handleResponse = message => {
        const response = this._parser(message);
        resolve(response);
      };
      this._connection.once("message", handleResponse);

      // Send command and resolve returned promise with
      // the response
      this._connection.send(encoded);
    });
  }

  async home() {
    return this.send("G28");
  }

  async draw({ x, y, z }) {
    if (!isNumber(x) || !isNumber(y) || !isNumber(z)) {
      throw new Error(`x (${x}), y (${y}) and z (${z}) must be numbers.`);
    }

    return this.send(`G00 X${x} Y${y} Z${z}`);
  }

  async getPosition() {
    return this.send("M114");
  }

  async getCapabilities() {
    return this.send("M115");
  }
};
