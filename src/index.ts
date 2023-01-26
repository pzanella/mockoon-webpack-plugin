import * as mockoon from '@mockoon/cli';
import logger from './logger';
import { getPname, createJSONFile, getPort, getCommandLineArgs, hasFiles, getAbsolutePath, deleteFile } from './utils';
import globalConfig, { IMockoonWebpackPlugin } from './config';

/**
 * @namespace MockoonWebpackPlugin
 * @version 2.0.0
 * @author Pietro Zanella <pietrozanella22@gmail.com>
 *
 * @classdesc
 * MockoonWebpackPlugin is a Webpack plugin based on Mockoon (https://mockoon.com/).
 *
 * @constructor
 * @param {IMockoonWebpackPlugin[]} options
 * @param {(string|MocksType)} options.data - it define the mock source
 * @param {string} [options.pname] - the process name
 * @param {(string)} [options.port] - it define the port
 */
export class MockoonWebpackPlugin {
  private options: IMockoonWebpackPlugin[];
  private optionsList;

  constructor(options: IMockoonWebpackPlugin[]) {
    this.options = !Array.isArray(options) ? [options] : options;
    this.optionsList = new Map<string, object>();
  }

  private async optionsHandler(option: IMockoonWebpackPlugin) {
    const { data, port } = option;
    let _toDelete = false;

    option.pname = getPname(option);

    if (typeof data === 'string' && hasFiles(data)) {
      option.data = getAbsolutePath(data);
    } else if (typeof data === 'object') {
      option.data = await createJSONFile(option, globalConfig.baseDirectory);
      _toDelete = true;
    }

    if (typeof data !== 'string' && !port) {
      option.port = await getPort(option);
    }

    return {
      data: String(option.data),
      pname: option.pname,
      port: option.port,
      repair: true,
      daemonOff: true,
      _toDelete,
    };
  }

  apply(compiler) {
    if (!process.env.WEBPACK_SERVE) return;

    compiler.hooks.initialize.tap(globalConfig.pluginName, async () => {
      try {
        for (const option of this.options) {
          const { data, pname, port, repair, daemonOff, _toDelete } = await this.optionsHandler(option);

          if (port) {
            this.optionsList.set(pname, { data, pname, repair, port, daemonOff });
          } else {
            this.optionsList.set(pname, { data, pname, repair, daemonOff });
          }

          logger.log(JSON.stringify(this.optionsList.get(pname)));
          await mockoon.run(['start', ...getCommandLineArgs(this.optionsList.get(pname))]);

          if (_toDelete) {
            deleteFile(data);
          }
        }
      } catch (error) {
        logger.error(error);
      }
    });

    compiler.hooks.shutdown.tap(globalConfig.pluginName, async () => {
      try {
        for (const [key] of this.optionsList) {
          await mockoon.run(['stop', key]);
          this.optionsList.delete(key);
        }
      } catch (error) {
        logger.error(error);
      }
    });
  }
}
