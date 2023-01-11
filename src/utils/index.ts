import fs from "fs";
import { findFreePorts, isFreePort } from "find-free-ports";
import logger from "../logger";
import globalConfig, { IMockoonWebpackPlugin } from "../config";
import path from "path";

const createJSONFile = (option: IMockoonWebpackPlugin, pathFile: string) => {
    createFolder(pathFile);

    const { data, pname } = option;
    const filepath = `${pathFile}/${pname}.json`;

    fs.writeFileSync(filepath, JSON.stringify(data));
    return filepath;
};

const isFolderExist = (pathFile: string) => fs.existsSync(pathFile);

const createFolder = (pathFile: string) => !isFolderExist(pathFile) && fs.mkdirSync(pathFile);

const hasFiles = (pathFile: string): boolean => {
    try {
        return !!(fs.readFileSync(pathFile));
    } catch (_) {
        return false;
    }
};

const isValidUrl = (url: string): boolean => {
    try {
        return !!(new URL(url));
    } catch (err) {
        return false;
    }
};

const remapOptions = (options = {}) => {
    return Object.entries(options)
        .map(([key, value]) => {
            if (key in globalConfig.remapping) {
                return { [globalConfig.remapping[key]]: value };
            }
            return { [key]: value };
        })
        .reduce((obj, item) => ({ ...obj, ...item }), {});
};

const getCommandLineArgs = (options = {}) => {
    const obj = remapOptions(options);
    return Object.entries(obj).reduce((result: string[], [key, value]) => {
        result.push(`--${key}${typeof value !== "boolean" ? `=${value}` : ""}`);
        return result;
    }, []);
};

const getPname = (option: any = {}) => option.pname?.toLowerCase().replaceAll(/[^a-zA-Z0-9]/g, "-"); // TODO: change pname calculate

const getAbsolutePath = (filePath: string): string => path.resolve(filePath);

const getPort = async (option: any = {}, devServer: any = {}) => {
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
        return new Error(`The port ${option?.port} equals to Webpack.devServer.port, please change it!`);
    }
};

export {
    createJSONFile,
    hasFiles,
    isFolderExist,
    getCommandLineArgs,
    getPname,
    getPort,
    isValidUrl,
    getAbsolutePath
};
