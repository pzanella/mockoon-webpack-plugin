import fs from 'fs';
import { findFreePorts, isFreePort } from 'find-free-ports';
import logger from '../logger';
import globalConfig, { IMockoonWebpackPlugin } from '../config';
import path from 'path';
import uniqueFilename from 'unique-filename';

const createJSONFile = (option: IMockoonWebpackPlugin, pathFile: string): string => {
  createFolder(pathFile);

  const { data, pname } = option;
  const filepath = `${pathFile}/${pname}.json`;

  fs.writeFileSync(filepath, JSON.stringify(data));
  return filepath;
};

const isFolderExist = (pathFile: string) => fs.existsSync(pathFile);

const createFolder = (pathFile: string) => !isFolderExist(pathFile) && fs.mkdirSync(pathFile);

const deleteFile = (pathFile: string) => fs.unlinkSync(pathFile);

const hasFiles = (pathFile: string): boolean => {
  try {
    return !!fs.readFileSync(pathFile);
  } catch (_) {
    return false;
  }
};

const remapOptions = (options = {}) => {
  return Object.entries(options)
    .map(([key, value]) => {
      if (key in globalConfig.remapping) {
        return { [globalConfig.remapping[key]]: value };
      }
      return !!value && { [key]: value };
    })
    .filter((opt) => opt)
    .reduce((obj, item) => ({ ...obj, ...item }), {});
};

const getCommandLineArgs = (options = {}) => {
  const obj = remapOptions(options);
  return Object.entries(obj).reduce((result: string[], [key, value]) => {
    result.push(`--${key}${typeof value !== 'boolean' ? `=${value}` : ''}`);
    return result;
  }, []);
};

const getPname = (option: any = {}) => {
  const { pname } = option;
  if (!pname) {
    return uniqueFilename('');
  }
  return pname.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, '-');
};

const getAbsolutePath = (filePath: string): string => path.resolve(filePath);

const getPort = async (option: IMockoonWebpackPlugin) => {
  let { port } = option;
  if (port && (await isFreePort(port))) {
    return port;
  } else {
    [port] = await findFreePorts();
    logger.warn(`The port ${port} is free, set this value in your mockoon-webpack-plugin!`);
    return port;
  }
};

export { createJSONFile, hasFiles, isFolderExist, getCommandLineArgs, getPname, getPort, getAbsolutePath, deleteFile };
