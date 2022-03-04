const { validate } = require("schema-utils");
const mockoon = require("@mockoon/cli");

const schema = require("./schema");
const utils = require("./utils");
const { logger } = require("./logger");
const { DEFAULT } = require("./constants");

class MockoonWebpackPlugin {
  #options;

  /**
   * @namespace MockoonWebpackPlugin
   * @classdesc
   * This plugin run Mockoon CLI to get fake API on localhost.
   * @constructor
   * @param {String} [options.data] - Path or URL to your Mockoon file
   * @param {Object} [options.mocks] - Object to define mock API
   * @param {Array<{method: String, endpoint: String, responses: Array<{body: String, latency: Number, statusCode: number, headers: Array<{key: String, value: String}>, rules: Array<{target: String, modifier: String, value: String, operator: String}>}>}>} [options.mocks.routes] - Mock API routes
   * @param {Boolean} [options.mocks.cors] - Enable or disable CORS
   * @param {Array<{key: String, value: String}>} [options.mocks.headers] - Global Mockoon headers
   * @param {String | Number} [options.index] - Environment's index in the data file
   * @param {String} [options.name] - Environment's index in the data file
   * @param {String} options.pname - Mockoon's process name
   * @param {String | Number} options.port - Mockoon's port value
   * @param {String} [options.hostname] - Override default listening hostname (0.0.0.0)
   * @param {Boolean} [options.repair] - If the data file seems too old, or an invalid Mockoon file, migrate/repair without prompting
   *
   * @example
   * // Search the Mockoon file at project root in ".mockoon" folder
   * new MockoonWebpackPlugin({
   *    pname: "example-pname",
   *    port: 1025
   * });
   *
   * // Load the Mockoon file from a specific path (or url)
   * new MockoonWebpackPlugin({
   *    data: "./.mockoon/api.json",
   *    pname: "example-pname",
   *    port: 1025
   * });
   *
   * // Write inline specific mock
   * new MockoonWebpackPlugin({
   *    mocks: {
   *        routes: [{
   *            method: "GET",
   *            endpoint: "pippo",
   *            responses: [{
   *                body: "daje",
   *                statusCode: 200
   *            }]
   *        }],
   *        cors: true
   *    },
   *    pname: "example-pname",
   *    port: 1025
   * });
   */
  constructor(options) {
    validate(schema, options, { name: DEFAULT.pluginName });
    this.#options = !Array.isArray(options) ? [options] : options;
  }

  async optionsHandler(option = {}, devServer = {}, path) {
    if (
      Object.keys(option).length === 0 ||
      Object.keys(devServer).length === 0 ||
      !utils.isFolderExist(path)
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

    compiler.hooks.initialize.tap(DEFAULT.pluginName, async () => {
      try {
        for (const option of this.#options) {
          const opt = await this.optionsHandler(
            option,
            compiler.options?.devServer,
            DEFAULT.dirname
          );

          if (!opt.data) {
            throw new Error(
              `Please, add one or more file inside ${DEFAULT.dirname} folder like as [pname].json, pass a path or an url to data attribute or use mocks object within plugin's configuration.`
            );
          }

          logger.log(JSON.stringify(opt));
          await mockoon.run(["start", ...utils.getCommandLineArgs(opt)]);
        }
      } catch (error) {
        logger.error(error);
      }
    });

    compiler.hooks.shutdown.tap(DEFAULT.pluginName, async () => {
      for (const option of this.#options) {
        await mockoon.run(["stop", option.pname]);
      }
    });
  }
}

module.exports = { MockoonWebpackPlugin };
