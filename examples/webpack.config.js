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
            // Specify the local path to your Mockoon file
            data: "<LOCAL-PATH-TO-MY-MOCKOON-FILE>"
        }, {
            // Specify the url to your Mockoon file
            data: "https://<URL-TO-MY-MOCKOON-FILE>"
        }, {
            // Specify the local path to your Mockoon file and override the port with the specific value
            data: "<LOCAL-PATH-TO-MY-MOCKOON-FILE>",
            port: 5055
        }, {
            // Define the object to describe the API and spacify the port
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
                                        name: 'Sto cazzo',
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
            port: 5055
        }])
    ],
};