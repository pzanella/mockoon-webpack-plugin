export type LevelsType = 'log' | 'warn' | 'error';

type ConfigType = {
  color: string;
  background?: string;
};

export interface ILogger {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export const config: Record<LevelsType, ConfigType> = {
  log: {
    color: 'white',
  },
  warn: {
    color: 'yellow',
    background: 'bgYellow',
  },
  error: {
    color: 'red',
    background: 'bgRed',
  },
};
