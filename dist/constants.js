const path = require("path");

module.exports = {
    REMAP_FIELD: {
        log: "log-transaction",
        daemonOff: "daemon-off"
    },
    DEFAULT: {
        pluginName: "MockoonWebpackPlugin",
        version: require("../package.json").version,
        dirname: path.resolve(process.cwd(), ".mockoon")
    }
};