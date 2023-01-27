const HtmlWebpackPlugin = require("html-webpack-plugin");
const { MockoonWebpackPlugin } = require("mockoon-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./path/to/my/entry/file.js",
    output: {
        filename: "my-first-webpack.bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new MockoonWebpackPlugin([{
            // You specify the local path to your Mockoon's file
            data: "./relative/path/to/mockoon/file"
        }, {
            // You specify the url to your Mockoon's file
            data: "https://url/to/mockoon/file"
        }, {
            // You specify the local path to your Mockoon's file and override the port
            data: "/absolute/path/to/mockoon/local/file",
            port: 5055
        }, {
            // You define an object that to describe the API and the HTTP port
            data: {
                routes: [
                    {
                        method: 'GET',
                        endpoint: '/getUsers',
                        responses: [
                            {
                                body: JSON.stringify([
                                    {
                                        id: 1,
                                        name: 'John',
                                        surname: 'Doe',
                                    },
                                ]),
                                statusCode: 200,
                            }
                        ],
                        cors: true,
                    },
                    {
                        method: "GET",
                        endpoint: "/getCars",
                        responses: [{
                            body: JSON.stringify([{
                                id: 1,
                                make: "Toyota",
                                model: "Corolla",
                                fuel_type: "electricity"
                            }, {
                                id: 2,
                                make: "Audi",
                                model: "A4",
                                fuel_type: "gas"
                            }]),
                            statusCode: 200
                        }],
                        cors: true
                    }
                ]
            },
            port: 1026
        }])
    ],
};
