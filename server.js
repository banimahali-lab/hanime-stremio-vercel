const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./api/index");

serveHTTP(addonInterface, { port: 7000 });