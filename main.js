const connect = require("./lib/connect");
const Protocol = require("./lib/protocol");

const main = async () => {
  const connection = await connect();
  const protocol = new Protocol(connection);

  return protocol;
};

module.exports = main;
