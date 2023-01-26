import path from 'path';
import * as packageInfo from "../package.json";

type GlobalConfigType = {
  pluginName: string;
  version: string;
  baseDirectory: string;
  remapping: {
    log: string;
    daemonOff: string;
  };
};

const globalConfig: GlobalConfigType = {
  pluginName: 'MockoonWebpackPlugin',
  version: packageInfo.version,
  baseDirectory: path.resolve(process.cwd(), 'mockoon'),
  remapping: {
    log: 'log-transaction',
    daemonOff: 'daemon-off',
  },
};

export default globalConfig;

interface ResponseType {
  body?: string;
  latency?: string;
  statusCode: number;
  headers?: HeadersType[];
  rules?: {
    target?: string;
    modifier?: string;
    value?: string;
    operator?: string;
  }[];
}

type RoutesType = {
  method: string;
  endpoint: string;
  responses: ResponseType[];
};

type HeadersType = {
  key: string;
  value: string;
};

type MocksType = {
  headers?: HeadersType[];
  routes: RoutesType[];
  cors?: boolean;
};

export type IMockoonWebpackPlugin = {
  data: string | MocksType;
  pname?: string;
  port?: number;
};
