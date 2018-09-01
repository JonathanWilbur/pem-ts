const path = require('path');
module.exports = {
    entry: [
        "./source/pem.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../../dist/web"),
        filename: "pem.js",
        library: "pem",
        libraryTarget: "var"
    },
    resolve: {
        extensions: [ ".ts" ]
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true
    },
    target: "web"
};