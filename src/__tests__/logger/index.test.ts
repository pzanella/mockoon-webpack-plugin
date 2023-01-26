import logger from '../../logger';

describe('logger file', () => {
  let consoleObject;

  beforeAll(() => {
    consoleObject = console;

    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  test('log()', () => {
    const msg = 'Log message!';
    logger.log(msg);

    expect(console.log).toHaveBeenCalled();
  });

  test('warn()', () => {
    const msg = 'Warn message!';
    logger.warn(msg);

    expect(console.warn).toHaveBeenCalled();
  });

  test('error()', () => {
    const msg = 'Error message!';
    logger.error(msg);

    expect(console.error).toHaveBeenCalled();
  });

  afterAll(() => {
    console = consoleObject;
  });
});
