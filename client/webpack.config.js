const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),      // Output folder
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // Extracts CSS into a separate file
                    'css-loader',               // Responsible for interpreting CSS imports and adding them to JavaScript
                    'postcss-loader'            // Processes CSS with PostCSS plugins (such as Tailwind CSS and Autoprefixer)
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/, // Rule for image files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'assets/images', // Output folder for images
                        },
                    },
                ],
            },
        ]
    },
    devServer: {
        // static: path.join(__dirname, 'dist'),  This specifies the folder where devserver will search for static files (default is /public)
        compress: false, // Enables gzip compression
        port: 9000, // Server port
        historyApiFallback: true, // Required for Single Page Applications (SPA)
        open: true, // Automatically opens the browser when the server starts
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,

                // onProxyReq: (proxyReq, req, res) => {
                //     const fullUrl = `http://${req.headers.host}${req.url}`;
                //     console.log(`[ProxyReq] ${req.method} ${fullUrl}`);
                // },

                // Log when a response is received from the target
                // onProxyRes: (proxyRes, req, res) => {
                //     // console.log(`[ProxyRes] ${req.method} ${req.url} → ${proxyRes.statusCode}`);
                // },

                // Optional: handle proxy errors
                // onError(err, req, res) {
                //     console.error(`[ProxyError] ${req.method} ${req.url}:`, err.message);
                // }
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'bundle.css', // Name of the generated CSS file
        }),
      ],
    resolve: {
        extensions: ['.js', '.jsx'],
    }
}