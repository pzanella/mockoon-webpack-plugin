import { validate } from "schema-utils";
import * as mockoon from "@mockoon/cli";
import { schema } from "./schema";
import logger from "./logger";
import utils from "./utils";
import globalConfig from "./config";

export class MockoonWebpackPlugin {
    private options: any;

    constructor(options) {
        validate(schema, options, { name: globalConfig.pluginName });
        this.options = !Array.isArray(options) ? [options] : options;
    }

    async optionsHandler(option: any = {}, devServer: any = {}, path: string) {
        if (
            Object.keys(option).length === 0 ||
            Object.keys(devServer).length === 0
        ) {
            return;
        }

        const pname = utils.getPname(option);

        return {
            data:
                "mocks" in option
                    ? utils.createJSONFile(option, path)
                    : !option?.data
                        ? `${path}/${utils
                            .hasFiles(path)
                            .find((el) => el === `${pname}.json`)}`
                        : option.data,
            pname,
            port: await utils.getPort(option, devServer),
            repair: true,
            daemonOff: true,
        };
    }

    apply(compiler) {
        if (!process.env.WEBPACK_SERVE) {
            return;
        }

        compiler.hooks.initialize.tap(globalConfig.pluginName, async () => {
            try {
                for (const option of this.options) {
                    const opt = await this.optionsHandler(
                        option,
                        compiler.options?.devServer,
                        globalConfig.baseDirectory
                    );

                    if (!opt.data) {
                        throw new Error(
                            `Please, add one or more file inside ${globalConfig.baseDirectory} folder like as [pname].json, pass a path or an url to data attribute or use mocks object within plugin's configuration.`
                        );
                    }

                    logger.log(JSON.stringify(opt));
                    await mockoon.run(["start", ...utils.getCommandLineArgs(opt)]);
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