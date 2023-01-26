# mockoon-webpack-plugin

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)

A Webpack plugin based on Mockoon CLI (https://mockoon.com/) that simplifies the creation mock(s) server to give APIs on localhost and stop it when close webpack-dev-server.

## Installation
```
npm install --save-dev mockoon-webpack-plugin
```
or
```
yarn add --dev mockoon-webpack-plugin
```

## Usage
```js
const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");

module.exports = {
    ...
    plugins: [
        ...
        new MockoonWebpackPlugin({
            data: "<FILE | URL | OBJECT>",
            pname: "<PROCESS NAME>",
            port: "<PORT>" 
        });
    ]
};
```

## Options

- **data** (required), you can specify the absolute or relative path of a Mockoon file, or an url to Mockoon file or an object like this:
    ```js
    data: {
        routes: [{
            method: string,
            endpoint: string,
            responses: [{
                body: string,

                latency: (optional) string,

                statusCode: number,
                
                headers: (optional) [{
                    key: string,
                    value: string
                }],

                rules: (optional) [{
                    target: string,
                    modifier: string,
                    value: string,
                    operator: string
                }]
            }]
        }],
        cors: boolean,

        headers: (optional) [{
            key: string,
            value: string
        }],
    }
    ```
- **pname** (optional), process name (if not specified the plugin will create a unique name)
- **port** (optional), evironment's port (if not specified the plugin will search a free port)

## Example Webpack Config
See [examples](./examples/) folder.