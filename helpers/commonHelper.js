const os = require("os");

/**
 * FUNC - Get user IP address
 */
const getIp = async (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // In case of localhost, return machine IP
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[interfaceName]) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }

  return ip;
};

module.exports = {
  getIp,
};
