const fs = require("fs");
const { findFreePorts, isFreePort } = require("find-free-ports");

const { logger } = require("./logger");
const { REMAP_FIELD, DEFAULT } = require("./constants");

/**
 * Create in path a JSON file from option.mocks object that contains Mockoon's configuration.
 * @param {{mocks: Object, pname: string}} [option]
 * @param {String} [path] - Default constants.DEFAULT.dirname
 * @returns {String} Absolute file path
 */
const createJSONFile = (option = {}, path = DEFAULT.dirname) => {
  if (Object.entries(option).length === 0) {
    throw `The object is empty!`;
  }

  const { mocks: content, pname } = option;
  const filepath = `${path}/${pname}.json`;

  fs.writeFileSync(filepath, JSON.stringify(content));
  return filepath;
};

/**
 * @param {String} [path]
 * @returns {Boolean} Folder exists or not
 */
const isFolderExist = (path = DEFAULT.dirname) => {
  return fs.existsSync(path);
};

/**
 * @param {String} [path]
 * @returns {Array<String>} List files in path
 */
const hasFiles = (path = DEFAULT.dirname) => {
  return fs.readdirSync(path);
};

const remapOptions = (options) => {
  return Object.entries(options)
    .map(([key, value]) => {
      if (key in REMAP_FIELD) {
        return { [REMAP_FIELD[key]]: value };
      }
      return { [key]: value };
    })
    .reduce((obj, item) => ({ ...obj, ...item }), {});
};

/**
 * Returns an array contains command line structure for Mockoon CLI.
 * @param {Object} [options]
 * @returns {Array<String>} Command line for Mockoon library
 */
const getCommandLineArgs = (options = {}) => {
  const obj = remapOptions(options);
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value) {
      result.push(`--${key}${typeof value !== "boolean" ? `=${value}` : ""}`);
    }
    return result;
  }, []);
};

/**
 * Manipulate process name where spaces and special characters are replace with "-".
 * @param {String} [option.pname] - Process name from plugin's configuration
 * @returns {String} Mockoon process name without space or special characters
 */
const getPname = (option = {}) => {
  return option.pname?.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "-");
};

/**
 * Check if option.port is free and not equals to Webpack devServer.port, if necessary the function find a free port and suggest it to user.
 * @param {String | Number} [option.port] - Server port from plugin's configuration
 * @param {String | Number} [devServer.port] - Webpack devServer port
 * @returns {String} Free port
 */
const getPort = async (option = {}, devServer = {}) => {
  if (Number(option?.port) !== Number(devServer?.port)) {
    let { port } = option;
    if (port && (await isFreePort(port))) {
      return port;
    } else {
      [port] = await findFreePorts();
      logger.warn(
        `The port ${port} is free, please change it in your code or modify port's value in plugin's configuration!`
      );
      return port;
    }
  } else {
    throw `The port ${option?.port} equals to Webpack.devServer.port, please change it!`;
  }
};

module.exports = {
  hasFiles,
  isFolderExist,
  getCommandLineArgs,
  getPname,
  getPort,
  createJSONFile,
};
