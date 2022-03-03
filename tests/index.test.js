const fs = require("fs");

const mockoon = require("@mockoon/cli");
jest.mock("@mockoon/cli");
mockoon.run = jest.fn();

const { MockoonWebpackPlugin } = require("../dist/index");

describe("index file", () => {
  let mockoonWebpackPlugin, options;

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
    let option, devServer, path;

    beforeEach(() => {
      path = `${process.cwd()}/mockoon-unit-test`;

      option = {
        pname: "mockoon-unit-test",
        port: 1025,
      };

      devServer = {
        port: 3002,
      };

      fs.mkdirSync(path);
      fs.writeFileSync(`${path}/${option.pname}.json`, "{}");

      expect(fs.existsSync(path)).toBeTruthy();
      expect(fs.existsSync(`${path}/${option.pname}.json`)).toBeTruthy();
    });

    test("should be return undefined", async () => {
      let opt = await mockoonWebpackPlugin.optionsHandler();
      expect(opt).toBeUndefined();

      opt = await mockoonWebpackPlugin.optionsHandler(
        option,
        devServer,
        "fakeFolder"
      );
      expect(opt).toBeUndefined();
    });

    test("should be return the option object (without data attribute)", async () => {
      const opt = await mockoonWebpackPlugin.optionsHandler(
        option,
        devServer,
        path
      );
      expect(opt).toBeDefined();
      expect(typeof opt).toBe("object");

      expect(opt.pname).toBeDefined();
      expect(typeof opt.pname).toBe("string");
      expect(opt.pname).toBe("mockoon-unit-test");

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

    test("should be return the option object (with data attribute)", async () => {
      option = {
        data: "./mockoon-unit-test/mockoon-unit-test.json",
        ...option,
      };

      const opt = await mockoonWebpackPlugin.optionsHandler(
        option,
        devServer,
        path
      );

      expect(opt).toBeDefined();
      expect(typeof opt).toBe("object");

      expect(opt.data).toBeDefined();
      expect(typeof opt.data).toBe("string");
      expect(opt.data).toBe("./mockoon-unit-test/mockoon-unit-test.json");

      expect(opt.pname).toBeDefined();
      expect(typeof opt.pname).toBe("string");
      expect(opt.pname).toBe("mockoon-unit-test");

      expect(opt.port).toBeDefined();
      expect(typeof opt.port).toBe("number");
      expect(opt.port).toBe(1025);

      expect(opt.repair).toBeDefined();
      expect(typeof opt.repair).toBe("boolean");
      expect(opt.repair).toBeTruthy();

      expect(opt.daemonOff).toBeDefined();
      expect(typeof opt.daemonOff).toBe("boolean");
      expect(opt.daemonOff).toBeTruthy();

      delete option.data;
    });

    test("should be return the option object (mocks)", async () => {
      option = {
        mocks: {
          routes: [
            {
              method: "GET",
              endpoint: "api/user",
              responses: [
                {
                  body: "{ id: 1, firstname: 'John', surname: 'Doe' }",
                  statusCode: 200,
                },
              ],
            },
          ],
          cors: true,
        },
        ...option,
      };

      const opt = await mockoonWebpackPlugin.optionsHandler(
        option,
        devServer,
        path
      );

      expect(opt).toBeDefined();
      expect(typeof opt).toBe("object");

      expect(opt.pname).toBeDefined();
      expect(typeof opt.pname).toBe("string");
      expect(opt.pname).toBe("mockoon-unit-test");

      expect(opt.port).toBeDefined();
      expect(typeof opt.port).toBe("number");
      expect(opt.port).toBe(1025);

      expect(opt.repair).toBeDefined();
      expect(typeof opt.repair).toBe("boolean");
      expect(opt.repair).toBeTruthy();

      expect(opt.data).toBeDefined();
      expect(typeof opt.data).toBe("string");
      expect(opt.data).toBe(`${path}/${option.pname}.json`);

      expect(opt.repair).toBeDefined();
      expect(typeof opt.repair).toBe("boolean");
      expect(opt.repair).toBeTruthy();

      expect(opt.daemonOff).toBeDefined();
      expect(typeof opt.daemonOff).toBe("boolean");
      expect(opt.daemonOff).toBeTruthy();

      delete option.mocks;
    });

    afterEach(() => {
      fs.rmSync(path, { recursive: true, force: true });

      expect(fs.existsSync(path)).toBeFalsy();
      expect(fs.existsSync(`${path}/${option.pname}.json`)).toBeFalsy();
    });
  });

  describe("apply() function, options as list and process.env.WEBPACK_SERVE equals true", () => {
    const originalProcessEnv = process.env;
    let consoleObject, compiler;

    beforeAll(() => {
      mockoonWebpackPlugin = null;
      expect(mockoonWebpackPlugin).toBeNull();

      process.env = { ...originalProcessEnv };

      consoleObject = console;

      // eslint-disable-next-line
      console = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      };

      options = {
        data: `${process.cwd()}/mockoon-unit-test/mockoon-unit-test.json`,
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

      process.env = { ...originalProcessEnv, WEBPACK_SERVE: true };
    });

    test("should be print the option object", () => {
      jest.spyOn(mockoonWebpackPlugin, "optionsHandler").mockResolvedValue({
        ...options,
        daemonOff: true,
      });

      try {
        mockoonWebpackPlugin.apply(compiler);

        expect(console.log).toHaveBeenCalled();
        expect(mockoon.run).toHaveBeenCalled();
      } catch (error) {
        expect(console.error).not.toHaveBeenCalled();
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
        expect(console.log).not.toHaveBeenCalled();
        expect(mockoon.run).not.toHaveBeenCalled();
      } catch (error) {
        // TODO:
      }
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      // eslint-disable-next-line
      console = consoleObject;

      process.env = originalProcessEnv;
    });
  });

  describe("apply() function, process.env.WEBPACK_SERVE equals false", () => {
    const originalProcessEnv = process.env;

    beforeAll(() => {
      mockoonWebpackPlugin = null;
      expect(mockoonWebpackPlugin).toBeNull();

      options = {
        pname: "mockoon-unit-test",
        port: 1025,
      };

      mockoonWebpackPlugin = new MockoonWebpackPlugin([options]);

      process.env = { ...originalProcessEnv, WEBPACK_SERVE: undefined };
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
