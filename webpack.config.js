const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        // piece: './src/piece.js',
        // board: './src/board.js',
        // print: '/src/print.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './src/index.html'
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    }
    // module: {
    //     rules: [
    //         {
    //             test: /\.css$/i,
    //             use: ['style-loader', 'css-loader']
    //         },
    //         {
    //             test: /\.(png|svg|jpg|jpeg|gif)$/i,
    //             type: 'asset/resource',
    //         },
    //         {
    //           test: /\.(woff|woff2|eot|ttf|otf)$/i,
    //           type: 'asset/resource',
    //         },
    //     ]
    // }
};