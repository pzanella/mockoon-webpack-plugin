import fs from "fs";

// tslint:disable-next-line
const mockoon = require("@mockoon/cli");
jest.mock("@mockoon/cli");
mockoon.run = jest.fn();

import { MockoonWebpackPlugin } from "../";
import { IMockoonWebpackPlugin } from "../config";
import logger from "../logger";

describe("index file", () => {
    let mockoonWebpackPlugin;
    let options;

    beforeAll(() => {
        options = {
            data: `${process.cwd()}/mockoon-unit-test/mockoon-unit-test.json`,
            pname: "mockoon-unit-test",
            port: 1025,
        };

        mockoonWebpackPlugin = new MockoonWebpackPlugin(options);
    });

    test("should be an instance of MockoonWebpackPlugin", () => {
        expect(mockoonWebpackPlugin).toBeDefined();
        expect(mockoonWebpackPlugin instanceof MockoonWebpackPlugin).toBeTruthy();
    });

    describe("optionsHandler()", () => {
        let devServer;
        let path;

        beforeEach(() => {
            path = `${process.cwd()}/mockoon`;

            devServer = {
                port: 3002,
            };
        });

        test("should be return the opt object as { data, pname, port, repair, daemonOff }", async () => {
            const option: IMockoonWebpackPlugin = {
                data: {
                    routes: [{
                        method: "GET",
                        endpoint: "/test",
                        responses: [{
                            statusCode: 200
                        }]
                    }]
                },
                pname: "pname-test",
                port: 1025
            };

            const opt = await mockoonWebpackPlugin.optionsHandler(
                option,
                devServer,
                path
            );

            expect(fs.existsSync(`${path}/pname-test.json`)).toBeTruthy();

            expect(opt).toBeDefined();
            expect(typeof opt).toBe("object");

            expect(opt.pname).toBeDefined();
            expect(typeof opt.pname).toBe("string");
            expect(opt.pname).toBe("pname-test");

            expect(opt.port).toBeDefined();
            expect(typeof opt.port).toBe("number");
            expect(opt.port).toBe(1025);

            expect(opt.repair).toBeDefined();
            expect(typeof opt.repair).toBe("boolean");
            expect(opt.repair).toBeTruthy();

            expect(opt.daemonOff).toBeDefined();
            expect(typeof opt.daemonOff).toBe("boolean");
            expect(opt.daemonOff).toBeTruthy();
        });

        test("should be return the opt object as { data, pname, repair, daemonOff }", async () => {
            const option: IMockoonWebpackPlugin = {
                data: "./mockoon/mockoon-unit-test.json",
                pname: "pname-test"
            };

            fs.mkdirSync(path);
            expect(fs.existsSync(path)).toBeTruthy();
            fs.writeFileSync(`${path}/mockoon-unit-test.json`, "{}");
            expect(fs.existsSync(`${path}/mockoon-unit-test.json`)).toBeTruthy();

            const opt = await mockoonWebpackPlugin.optionsHandler(
                option,
                devServer,
                path
            );

            expect(opt).toBeDefined();
            expect(typeof opt).toBe("object");

            expect(opt.data).toBeDefined();
            expect(typeof opt.data).toBe("string");
            expect(opt.data).toBe(`${path}/mockoon-unit-test.json`);

              expect(opt.pname).toBeDefined();
              expect(typeof opt.pname).toBe("string");
              expect(opt.pname).toBe("pname-test");

              expect(opt.repair).toBeDefined();
              expect(typeof opt.repair).toBe("boolean");
              expect(opt.repair).toBeTruthy();

              expect(opt.daemonOff).toBeDefined();
              expect(typeof opt.daemonOff).toBe("boolean");
              expect(opt.daemonOff).toBeTruthy();
        });

        afterEach(() => {
            fs.rmSync(path, { recursive: true, force: true });

            expect(fs.existsSync(path)).toBeFalsy();
        });
    });

    describe("apply() function, options as list and process.env.WEBPACK_SERVE equals true", () => {
        const originalProcessEnv = process.env;
        let compiler;

        beforeAll(() => {
            mockoonWebpackPlugin = null;
            expect(mockoonWebpackPlugin).toBeNull();

            process.env = { ...originalProcessEnv, WEBPACK_SERVE: "true" };

            logger.log = jest.fn();
            logger.warn = jest.fn();
            logger.error = jest.fn();

            options = {
                pname: "mockoon-unit-test",
                port: 1025,
            };

            mockoonWebpackPlugin = new MockoonWebpackPlugin([options]);

            compiler = {
                options: {
                    devServer: {
                        port: 3002,
                    },
                },
                hooks: {
                    initialize: {
                        tap: (name, fn) => {
                            fn.call();
                        },
                    },
                    shutdown: {
                        tap: (name, fn) => {
                            fn.call();
                        },
                    },
                },
            };
        });

        test("should be print the option object", () => {
            options.data = `${process.cwd()}/mockoon-unit-test/mockoon-unit-test.json`;

            jest.spyOn(mockoonWebpackPlugin, "optionsHandler").mockResolvedValue({
                ...options,
                daemonOff: true,
            });

            try {
                mockoonWebpackPlugin.apply(compiler);

                expect(logger.log).toHaveBeenCalled();
                expect(mockoon.run).toHaveBeenCalled();
            } catch (error) {
                expect(logger.error).not.toHaveBeenCalled();
            }
        });

        test("should be throw an error", () => {
            delete options.data;

            jest.spyOn(mockoonWebpackPlugin, "optionsHandler").mockResolvedValue({
                ...options,
                daemonOff: true,
            });

            try {
                mockoonWebpackPlugin.apply(compiler);
                expect(logger.log).not.toHaveBeenCalled();
                expect(mockoon.run).toHaveBeenCalled();
            } catch (error) {
                expect(logger.error).toHaveBeenCalled();
            }
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        afterAll(() => {
            process.env = originalProcessEnv;
        });
    });

    describe("apply() function, process.env.WEBPACK_SERVE equals false", () => {
        const originalProcessEnv = process.env;

        beforeAll(() => {
            mockoonWebpackPlugin = null;
            expect(mockoonWebpackPlugin).toBeNull();

            process.env = { ...originalProcessEnv, WEBPACK_SERVE: undefined };

            options = {
                pname: "mockoon-unit-test",
                port: 1025,
            };

            mockoonWebpackPlugin = new MockoonWebpackPlugin([options]);
        });

        test("should be not call", () => {
            mockoonWebpackPlugin.apply({});
            expect(mockoon.run).not.toHaveBeenCalled();
        });

        afterAll(() => {
            process.env = originalProcessEnv;
        });
    });

    afterAll(() => {
        mockoonWebpackPlugin = null;
        expect(mockoonWebpackPlugin).toBeNull();
    });
});
