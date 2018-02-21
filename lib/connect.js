const net = require("net");
const debug = require("debug");
const { EventEmitter } = require("events");

const { ConnectionError } = require("./errors");

const log = {
  send: debug("line-us:socket:send"),
  receive: debug("line-us:socket:receive")
};

module.exports = ({ host = "line-us.local", port = 1337 } = {}) => {
  const api = new EventEmitter();
  const socket = net.createConnection({ host, port });

  socket.on("data", data => {
    log.receive(data.toString());
    api.emit("message", data.toString());
  });

  api.send = (...params) => {
    log.send(...params);
    socket.write(...params);
  };

  Object.defineProperty(api, "destroyed", {
    get() {
      return socket.destroyed;
    }
  });

  api.destroy = () => socket.destroy();

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      resolve(api);
    });

    socket.on("error", e => {
      const isConnectionError = ["ENOENT", "ECONNREFUSED"].includes(e.code);
      const error = isConnectionError ? new ConnectionError() : e;
      reject(error);
    });
  });
};
