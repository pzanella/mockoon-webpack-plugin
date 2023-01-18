import * as mockoon from "@mockoon/cli";
import logger from "./logger";
import {
    getPname,
    createJSONFile,
    getPort,
    getCommandLineArgs,
    hasFiles,
    isValidUrl,
    getAbsolutePath
} from "./utils";
import globalConfig, { IMockoonWebpackPlugin } from "./config";

export class MockoonWebpackPlugin {
    private options: IMockoonWebpackPlugin[];

    constructor(options: IMockoonWebpackPlugin[]) {
        this.options = !Array.isArray(options) ? [options] : options;
    }

    private async optionsHandler(option: IMockoonWebpackPlugin, devServer: any = {}) {
        const { data, port, pname } = option;

        return {
            data: (typeof data === "string" && (hasFiles(data) || isValidUrl(data))) ? getAbsolutePath(data) : await createJSONFile(option, globalConfig.baseDirectory),
            pname,
            ...((typeof data !== "string" || !!port) && { port: await getPort(option, devServer) }),
            repair: true,
            daemonOff: true,
        };
    }

    apply(compiler) {
        if (!process.env.WEBPACK_SERVE) return;

        compiler.hooks.initialize.tap(globalConfig.pluginName, async () => {
            try {
                for (const option of this.options) {
                    const opt = await this.optionsHandler(
                        option,
                        compiler.options?.devServer
                    );

                    if (!opt.data) {
                        throw new Error(
                            `Please, you must define the data attribute as Mockoon's file (local path or url) or you must define the data object within plugin's configuration (see README).`
                        );
                    }

                    logger.log(JSON.stringify(opt));
                    await mockoon.run(["start", ...getCommandLineArgs(opt)]);
                }
            } catch (error) {
                logger.error(error);
            }
        });

        compiler.hooks.shutdown.tap(globalConfig.pluginName, async () => {
            for (const option of this.options) {
                await mockoon.run(["stop", option.pname]);
            }
        });
    }
}