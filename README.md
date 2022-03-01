# Mockoon CLI Webpack plugin

[![made-with-javascript](https://img.shields.io/badge/made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![nodejs-version](https://img.shields.io/badge/node-%3E=16.0.0-4dc71f?logo=nodedotjs)](https://nodejs.org/download/release/v16.0.0/)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

A Webpack plugin based on Mockoon CLI that simplifies creation mock(s) server to give APIs on localhost and stop it when close Webpack dev server.

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

    const webpackConfig = {
        plugins: [
            new MockoonWebpackPlugin({
                data: "./mockoon/api.json",
                pname: "mockoon-api",
                port: 1025 
            });
        ]
    };

    module.exports = webpackConfig;
```

## Options
```js
    new MockoonWebpackPlugin({
        // Path or URL to your Mockoon file
        data: (optional) string,
        
        // Object to define APIs
        mocks: (optional) {
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
        },

        // Environment's index in the data file
        index: (optional) string || number,

        // Environment name in the data file
        name: (optional) string,

        // Process name
        pname: string,

        // Evironment's port
        port: string || number,

        // Override default listening hostname (0.0.0.0)
        hostname: (optional) string,

        // If the data file seems too old, or an invalid Mockoon file, migrate/repair without prompting
        repair: (optional) boolean
    });
```
If data or mocks object not specify, the plugin will be search a valid Mockoon's file in ".mockoon" folder at project root; when use mocks object the plugin will be create a valid Mockoon file at project root (.mockoon is the default folder).

## Example Webpack Config
Single mock server:
```js
    const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");
    const HtmlWebpackPlugin = require("html-webpack-plugin");

    module.exports = {
        mode: "development",
        entry: "PATH-TO-MY-ENTRY-FILE-JS",
        output: {
            path: path.resolve(process.cwd(), "dist")
        },
        devServer: {
            static: "./dist",
            port: 3002,
            open: true
        },
        plugins: [
            new HtmlWebpackPlugin(),
            new MockoonWebpackPlugin({
                data: "PATH-TO-MY-MOCKOON-FILE",
                pname: "mockoon-example-1",
                port: "3000"
            })
        ]
    };
```
Multi mock servers (e.g. 3):
```js
    const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");
    const HtmlWebpackPlugin = require("html-webpack-plugin");

    module.exports = {
        mode: "development",
        entry: "PATH-TO-MY-ENTRY-FILE-JS",
        output: {
            path: path.resolve(process.cwd(), "dist")
        },
        devServer: {
            static: "./dist",
            port: 3002,
            open: true
        },
        plugins: [
            new HtmlWebpackPlugin(),
            new MockoonWebpackPlugin([{
                pname: "mockoon-example-1",
                port: "3000"
            }, {
                data: "PATH-TO-MY-MOCKOON-FILE",
                pname: "mockoon-example-2",
                port: "5000"
            }, {
                mocks: {
                    mocks: {
                        routes: [{
                                method: "GET",
                                endpoint: "api/user",
                                responses: [{
                                body: "{ id: 1234, firstname: 'John', surname: 'Doe' }",
                                statusCode: 200
                            }]
                        }],
                        cors: true
                },
                pname: "mockoon-example-3",
                port: "5050"
            }])
        ]
    };
```