const { validate } = require("schema-utils");
const mockoon = require("@mockoon/cli");
const fs = require("fs");

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

  apply(compiler) {
    compiler.hooks.initialize.tap(DEFAULT.pluginName, () => {
      this.#options.forEach(async (option, index) => {
        try {
          this.#options[index].pname = utils.getPname(option);
          this.#options[index].port = await utils.getPort(
            option,
            compiler.options?.devServer
          );

          if ("mocks" in option || !option?.data) {
            if (!utils.isFolderExist(DEFAULT.dirname)) {
              fs.mkdirSync(DEFAULT.dirname);
            }
          }

          if ("mocks" in option) {
            this.#options[index].repair = true;
            const filepath = utils.createJSONFile(option, DEFAULT.dirname);
            this.#options[index].data = filepath;
            delete option.mocks;
          } else {
            if (!option?.data) {
              const files = utils.hasFiles(DEFAULT.dirname);
              if (files.length === this.#options.length) {
                this.#options[
                  index
                ].data = `${DEFAULT.dirname}/${files[index]}`;
              } else {
                throw `There are ${files.length} file(s) in ${
                  DEFAULT.dirname
                } folder for ${
                  this.#options.length
                } plugin's object(s). Which files do you want to load? Please, set data attribute within plugin's object.`;
              }
            }
          }

          this.#options[index].daemonOff = true;
          logger.log(JSON.stringify(option));
          await mockoon.run(["start", ...utils.getCommandLineArgs(option)]);
        } catch (error) {
          logger.error(error);
        }
      });
    });

    compiler.hooks.shutdown.tap(DEFAULT.pluginName, () => {
      try {
        this.#options.forEach(async (option) => {
          await mockoon.run(["stop", option.pname]);
        });
      } catch (error) {
        logger.error(error);
      }
    });
  }
}

module.exports = { MockoonWebpackPlugin };
