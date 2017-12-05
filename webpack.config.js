'use strict';

var path = require('path')
var webpack = require('webpack')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
let phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
let pixi = path.join(phaserModule, 'build/custom/pixi.js');
let p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/index.ts')
        ]
    },
    devtool: 'cheap-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsConfigPathsPlugin()
        ],

        alias: {
            'phaser-ce': phaser,
            'pixi': pixi,
            'p2': p2
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: `index.html`,
            template: path.join(__dirname, 'src/', `index.html`)
        }),
        new CleanWebpackPlugin(path.join(__dirname, 'dist/')),
        new CopyWebpackPlugin([
            {
                from: './assets',
                to: 'assets'
            }
        ])
    ],

    module: {

        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /pixi\.js/,
                use: ['expose-loader?PIXI']
            },
            {
                test: /phaser-split\.js$/,
                use: ['expose-loader?Phaser']
            },
            {
                test: /p2\.js/,
                use: ['expose-loader?p2']
            }
        ]
    },
    node: {
        fs: "empty"
    }
};
