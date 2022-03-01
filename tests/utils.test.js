const fs = require("fs");
const utils = require("../dist/utils");
jest.mock("../dist/logger.js");

describe("utils file", () => {
  describe("createJSONFile()", () => {
    test("should be returns an error because options is an empty object", () => {
      try {
        const options = {};
        const path = `${process.cwd()}/mockoon_unit-test`;
        utils.createJSONFile(options, path);
      } catch (error) {
        expect(error).toBeDefined();
        expect(typeof error).toBe("string");
        expect(error).toBe("The object is empty!");
      }
    });

    test("should be returns an error because options is undefined", () => {
      try {
        const options = undefined;
        const path = `${process.cwd()}/mockoon_unit-test`;
        utils.createJSONFile(options, path);
      } catch (error) {
        expect(error).toBeDefined();
        expect(typeof error).toBe("string");
        expect(error).toBe("The object is empty!");
      }
    });

    test("should be returns the filepath", () => {
      const options = {
        mocks: {
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
        pname: "mockoon-pname",
      };

      const path = `${process.cwd()}/mockoon_unit-test`;

      if (!utils.isFolderExist(path)) {
        fs.mkdirSync(path);
      }

      const filepath = utils.createJSONFile(options, path);
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

    test("should be returns empty array", () => {
      const files = utils.hasFiles(path);
      expect(files).toBeDefined();
      expect(Array.isArray(files)).toBeTruthy();
      expect(files.length).toBe(0);
      expect(files).toEqual([]);
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

    test("should be returns true", () => {
      const files = utils.isFolderExist(path);
      expect(files).toBeDefined();
      expect(typeof files).toBe("boolean");
      expect(files).toBeTruthy();
    });

    afterEach(() => {
      fs.rmSync(path, { recursive: true, force: true });
    });
  });

  describe("createFolder()", () => {
    const path = `${process.cwd()}/unit-test`;

    test("should be created a folder", () => {
      expect(fs.existsSync(path)).toBeFalsy();

      utils.createFolder(path);

      expect(fs.existsSync(path)).toBeTruthy();
    });

    test("the folder already exists", () => {
      fs.mkdirSync(path);
      expect(fs.existsSync(path)).toBeTruthy();

      utils.createFolder(path);
    });

    afterEach(() => {
      fs.rmSync(path, { recursive: true, force: true });

      expect(fs.existsSync(path)).toBeFalsy();
    });
  });

  describe("getCommandLineArgs()", () => {
    test("should be returns an empty array", () => {
      const args = utils.getCommandLineArgs();
      expect(args).toBeDefined();
      expect(args).toEqual([]);
    });

    test("should be returns the arguments array", () => {
      let options = {
        data: process.cwd(),
        pname: "mockoon-pname",
        port: 3000,
        daemonOff: true,
      };

      let args = utils.getCommandLineArgs(options);
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
      args = utils.getCommandLineArgs(options);
      expect(args).toBeDefined();
      expect(args.length).toBe(3);
      expect(args[0]).toBe(`--data=${process.cwd()}`);
      expect(typeof args[0]).toBe("string");
      expect(args[1]).toBe("--pname=mockoon-pname");
      expect(typeof args[1]).toBe("string");
      expect(args[2]).toBe("--port=3000");
      expect(typeof args[2]).toBe("string");

      const expected = ["--daemon-off"];
      expect(args).not.toEqual(expect.arrayContaining(expected));
    });
  });

  describe("getPname()", () => {
    test("should be returns undefined", () => {
      const pname = utils.getPname();
      expect(pname).toBeUndefined();
    });

    test("should be returns 'mockoon-pname'", () => {
      const options = {
        pname: "mockoon-pname",
      };

      let pname = utils.getPname(options);
      expect(pname).toBeDefined();
      expect(typeof pname).toBe("string");
      expect(pname).toBe("mockoon-pname");

      options.pname = "Mockoon pname";
      pname = utils.getPname(options);
      expect(pname).toBeDefined();
      expect(typeof pname).toBe("string");
      expect(pname).toBe("mockoon-pname");
    });
  });

  describe("getPort()", () => {
    test("should be returns random value", async () => {
      let port = await utils.getPort();
      expect(port).toBeDefined();
      expect(typeof port).toBe("number");

      const options = {};
      const devServer = {
        port: 5050,
      };
      port = await utils.getPort(options, devServer);
      expect(port).toBeDefined();
      expect(typeof port).toBe("number");
    });

    test("should be returns options.port", async () => {
      const options = {
        port: 1025,
      };

      const devServer = {
        port: 5050,
      };

      const port = await utils.getPort(options, devServer);
      expect(port).toBeDefined();
      expect(typeof port).toBe("number");
      expect(port).toBe(1025);
    });

    test("should be returns an error", () => {
      const options = {
        port: 1025,
      };

      const devServer = {
        port: 1025,
      };

      utils.getPort(options, devServer).catch((error) => {
        expect(error).toBeDefined();
        expect(typeof error).toBe("string");
        expect(error).toBe(
          "The port 1025 equals to Webpack.devServer.port, please change it!"
        );
      });
    });
  });
});
