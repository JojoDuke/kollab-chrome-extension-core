const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
//import 'node-libs-browser';


module.exports = {
    entry: {
        popup: path.resolve('src/popup/index.tsx'),
        options: path.resolve('src/options/index.tsx'),
        background: path.resolve('src/background/background.js'),
        image: path.resolve('src/image/index.tsx'),
        contentScript: path.resolve('src/contentScript/contentScript.ts'),
        //newTab: path.resolve('src/tabs/index.tsx'),
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                test: /\.tsx?$/,
                exclude: /node_modules/,
            },
            {
                test: /\.resources$/,
                use: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65,
                        },
                        // Optimize PNG images with pngquant
                        pngquant: {
                            enabled: false,
                        },
                        // Optimize GIF images with gifsicle
                        gifsicle: {
                            interlaced: false,
                        },
                        // Optimize SVG images with svgo
                        svgo: {
                            removeViewBox: false,
                        },
                        // Optimize JPG images with optipng
                        optipng: {
                            optimizationLevel: 4,
                        },
                        },
                    },
                    ],
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader', // postcss loader needed for tailwindcss
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ]
    },
    "plugins": [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('src/static'),
                to: path.resolve('dist')
            }]
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
            'image',
            'newTab'
        ])
    ],
    resolve: {
        extensions: ['.tsx', '.js', '.ts'],
        fallback: {
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url/"),
            "path": require.resolve("path-browserify"),
            "dns": require.resolve('dns.js'),
            "tls": require.resolve('tls'),
            "fs": false,
            "net": false,
            "stream": false,
            "timers": false,
            "crypto": false,
            "util": false,
            "zlib": false,
            "http": false,

          }
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
}

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'Kollab',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}