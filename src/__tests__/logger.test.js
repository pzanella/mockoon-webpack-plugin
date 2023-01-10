const { logger } = require("../dist/logger");

describe("logger file", () => {
    let consoleObject;

    beforeAll(() => {
        consoleObject = console;

        console = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        };
    });

    test("log()", () => {
        const msg = "Log message!";
        logger.log(msg);

        expect(console.log).toHaveBeenCalled();
    });

    test("warn()", () => {
        const msg = "Warn message!";
        logger.warn(msg);

        expect(console.warn).toHaveBeenCalled();
    });

    test("error()", () => {
        const msg = "Error message!";
        logger.error(msg);

        expect(console.error).toHaveBeenCalled();
    });

    afterAll(() => {
        console = consoleObject;
    });
});