import globalConfig from "../config";
import chalk from "chalk";

type LevelsType = "log" | "warn" | "error";

type ConfigType = {
    color: string;
    background?: string;
};

interface ILogger {
    log: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
}

const config: Record<LevelsType, ConfigType> = {
    log: {
        color: "white"
    },
    warn: {
        color: "yellow",
        background: "bgYellow"
    },
    error: {
        color: "red",
        background: "bgRed"
    }
};

class Logger implements ILogger {
    private heading(level: LevelsType = "log") {
        return chalk[config[level].color].bold(globalConfig.pluginName, globalConfig.version);
    }

    public log(message: any): void {
        console.log(this.heading(), chalk[config.log.color](message));
    }

    public warn(message: string): void {
        config.warn.background && console.warn(this.heading("warn"), chalk[config.warn.background]("WARNING"), chalk[config.warn.color](message));
    }

    public error(message: string): void {
        config.error.background && console.error(this.heading("error"), chalk[config.error.background]("ERROR"), chalk[config.error.color](message));
    }
}

export default new Logger();