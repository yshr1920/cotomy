const path = require('path');

const createConfig = ({ filename, minimize, clean }) => ({
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.ts',
  target: ['web', 'es2020'],
  output: {
    filename,
    path: path.resolve(__dirname, 'dist/browser'),
    library: {
      name: 'Cotomy',
      type: 'umd'
    },
    globalObject: 'this',
    clean
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json'
        },
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize
  }
});

module.exports = [
  createConfig({ filename: 'cotomy.js', minimize: false, clean: true }),
  createConfig({ filename: 'cotomy.min.js', minimize: true, clean: false })
];
