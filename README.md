# mockoon-webpack-plugin

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![nodejs-version](https://img.shields.io/badge/node-%3E=14.0.0-4dc71f?logo=nodedotjs)](https://nodejs.org/download/release/v14.0.0/)

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
To create 1 mock server:
```js
// webpack.config.js
const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");

module.exports = {
    ...
    plugins: [
        ...
        new MockoonWebpackPlugin({
            data: "https://url/to/mockoon/file"
        });
    ]
};
```
or, to create 2 mock servers using 2 Mockoon's files:
```js
// webpack.config.js
const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");

module.exports = {
    ...
    plugins: [
        ...
        new MockoonWebpackPlugin([{
            data: "./relative/path/to/mockoon/file",
            port: 1025
        }, {
            data: "/absolute/path/to/mockoon/local/file"
        }]);
    ]
};
```
or, to create 2 mock servers using a Mockoon's file and the custom object configuration:
```js
// webpack.config.js
const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");

module.exports = {
    ...
    plugins: [
        ...
        new MockoonWebpackPlugin([{
            data: "./relative/path/to/mockoon/local/file",
            port: 1025
        }, {
            data: {
                routes: [{
                    method: "GET";
                    endpoint: "/getUsers";
                    responses: [{
                        body: JSON.stringify([{
                            id: 1,
                            name: "John",
                            surname: "Doe",
                        }, {
                            id: 2,
                            name: "Ian",
                            surname: "Moore"
                        }])
                        statusCode: 200
                    }]
                }]
            },
            port: 5055
        }]);
    ]
};
```

## Options

- **data** (<span style="color:red">**required**</span>), you can specify the local file path or an url of a Mockoon file, or an object like this:
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
- **pname** (*optional*), process name (if not specified the plugin will create a unique name)
- **port** (*optional*), evironment's port (if not specified the plugin will search a free port)

## Example Webpack Config
See [examples](./examples/) folder.