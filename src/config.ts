const path = require("path");

type GlobalConfigType = {
    pluginName: string,
    version: string,
    baseDirectory: string,
    remapping: {
        log: string,
        daemonOff: string
    }
};

export const globalConfig: GlobalConfigType = {
    pluginName: "MockoonWebpackPlugin",
    version: require("../package.json").version,
    baseDirectory: path.resolve(process.cwd(), ".mockoon"),
    remapping: {
        log: "log-transaction",
        daemonOff: "daemon-off"
    }
};

export default globalConfig;