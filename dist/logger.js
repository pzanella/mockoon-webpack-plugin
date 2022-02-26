const chalk = require("chalk");
const { DEFAULT } = require("./constants");

const config = {
    log: {
        background: "",
        color: "white"
    },
    warn: {
        background: "bgYellow",
        color: "yellow"
    },
    error: {
        background: "bgRed",
        color: "red"
    }
};

const heading = (level = "log") => chalk[config[level].color].bold(DEFAULT.pluginName, DEFAULT.version);

module.exports = {
    logger: {
        log: (msg) => console.log(heading(), chalk[config.log.color](msg)),
        warn: (msg) => console.warn(heading("warn"), chalk[config.warn.background]("WARNING"), chalk[config.warn.color](msg)),
        error: (msg) => console.error(heading("error"), chalk[config.error.background]("ERROR"), chalk[config.error.color](msg))
    }
}
