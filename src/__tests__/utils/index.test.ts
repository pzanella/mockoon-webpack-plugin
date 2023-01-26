import fs from "fs";
import { IMockoonWebpackPlugin } from "../../config";
import {
    createJSONFile,
    hasFiles,
    isFolderExist,
    getCommandLineArgs,
    getPname,
    getPort,
    getAbsolutePath
} from "../../utils";

jest.mock("../../logger");

describe("utils file", () => {
    describe("createJSONFile()", () => {
        test("should be return the filepath", () => {
            const options: IMockoonWebpackPlugin = {
                data: {
                    routes: [
                        {
                            method: "GET",
                            endpoint: "mock/api",
                            responses: [
                                {
                                    statusCode: 200,
                                    body: "{ id: 1, payload: {} }",
                                },
                            ],
                        },
                    ],
                },
                pname: "mockoon-pname"
            };

            const path = `${process.cwd()}/mockoon_unit-test`;

            const filepath = createJSONFile(options, path);
            expect(filepath).toBeDefined();
            expect(typeof filepath).toBe("string");
            expect(filepath).toBe(`${path}/mockoon-pname.json`);

            fs.rmSync(path, { recursive: true, force: true });
        });
    });

    describe("hasFiles()", () => {
        let path;

        beforeEach(() => {
            path = `${process.cwd()}/unit-test`;
            fs.mkdirSync(path);
        });

        test("should be return empty array", () => {
            const hasFilesCheck = hasFiles(path);
            expect(hasFilesCheck).toBeDefined();
            expect(Array.isArray(hasFilesCheck)).toBeFalsy();
        });

        afterEach(() => {
            fs.rmSync(path, { recursive: true, force: true });
        });
    });

    describe("isFolderExist()", () => {
        let path;

        beforeEach(() => {
            path = `${process.cwd()}/unit-test`;
            fs.mkdirSync(path);
        });

        test("should be return true", () => {
            const files = isFolderExist(path);
            expect(files).toBeDefined();
            expect(typeof files).toBe("boolean");
            expect(files).toBeTruthy();
        });

        afterEach(() => {
            fs.rmSync(path, { recursive: true, force: true });
        });
    });

    describe("getCommandLineArgs()", () => {
        test("should be return an empty array", () => {
            const args = getCommandLineArgs();
            expect(args).toBeDefined();
            expect(args).toEqual([]);
        });

        test("should be return the arguments array", () => {
            const options = {
                data: process.cwd(),
                pname: "mockoon-pname",
                port: 3000,
                daemonOff: true
            };

            let args = getCommandLineArgs(options);
            expect(args).toBeDefined();
            expect(args.length).toBe(4);
            expect(args[0]).toBe(`--data=${process.cwd()}`);
            expect(typeof args[0]).toBe("string");
            expect(args[1]).toBe("--pname=mockoon-pname");
            expect(typeof args[1]).toBe("string");
            expect(args[2]).toBe("--port=3000");
            expect(typeof args[2]).toBe("string");
            expect(args[3]).toBe("--daemon-off");
            expect(typeof args[3]).toBe("string");

            options.daemonOff = false;
            args = getCommandLineArgs(options);
            expect(args).toBeDefined();
            expect(args.length).toBe(4);
            expect(args[0]).toBe(`--data=${process.cwd()}`);
            expect(typeof args[0]).toBe("string");
            expect(args[1]).toBe("--pname=mockoon-pname");
            expect(typeof args[1]).toBe("string");
            expect(args[2]).toBe("--port=3000");
            expect(typeof args[2]).toBe("string");
        });
    });

    describe("getPname()", () => {
        test("should be return a value generated from unique-filename", () => {
            const pname = getPname();
            expect(pname).toBeDefined();
            expect(typeof pname).toBe("string");
        });

        test("should be return 'mockoon-pname'", () => {
            const options = {
                pname: "mockoon-pname",
            };

            let pname = getPname(options);
            expect(pname).toBeDefined();
            expect(typeof pname).toBe("string");
            expect(pname).toBe("mockoon-pname");

            options.pname = "Mockoon pname";
            pname = getPname(options);
            expect(pname).toBeDefined();
            expect(typeof pname).toBe("string");
            expect(pname).toBe("mockoon-pname");
        });
    });

    describe("getPort()", () => {
        test("should be return random value", async () => {
            const options = {
                data: "./fake-path"
            };

            const devServer = {
                port: 5050,
            };

            const port = await getPort(options);

            expect(port).toBeDefined();
            expect(typeof port).toBe("number");
        });

        test("should be return options.port", async () => {
            const options = {
                data: "./fake-path",
                port: 3050,
            };

            const devServer = {
                port: 5050,
            };

            const port = await getPort(options);
            expect(port).toBeDefined();
            expect(typeof port).toBe("number");
            expect(port).toBe(3050);
        });

        test("should be return an error", () => {
            const options = {
                data: "./fake-path",
                port: 1025,
            };

            const devServer = {
                port: 1025,
            };

            getPort(options).catch((error) => {
                expect(error).toBeDefined();
                expect(typeof error).toBe("string");
                expect(error).toBe(
                    "The port 1025 equals to Webpack.devServer.port, please change it!"
                );
            });
        });
    });

    describe("getAbsolutePath()", () => {
        test("should be return undefined", () => {
            const filePath: string = "";
            const result = getAbsolutePath(filePath);

            expect(result).toBeDefined();
            expect(result).toEqual("/Users/pietrozanella/Documents/Personal projects/workspaces/mockoon-webpack-plugin");
            expect(typeof result).toEqual("string");
        });
    });
});
