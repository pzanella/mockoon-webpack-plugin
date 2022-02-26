const fs = require("fs");
const utils = require("../utils");
jest.mock("../logger.js");

describe("utils file", () => {
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

  describe("getCommandLineArgs()", () => {
    test("should be returns an empty array", () => {
      const args = utils.getCommandLineArgs();
      expect(args).toBeDefined();
      expect(args).toEqual([]);
    });

    test("should be returns the arguments array", () => {
      const options = {
        data: process.cwd(),
        pname: "mockoon-pname",
        port: 3000,
        daemonOff: true,
      };

      const args = utils.getCommandLineArgs(options);
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
    });
  });

  describe("createJSONFile()", () => {
    test("should be returns an error", () => {
      try {
        const options = {};
        utils.createJSONFile(options);
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
});
