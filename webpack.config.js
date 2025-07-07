const path = require('path');
const { config } = require('process');

module.exports = {
  entry: './src/index.ts',
  target: ['web', 'es2020'], // または 'browserslist'
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'Cotomy',
      type: 'umd',
    },
    globalObject: 'this',
    clean: true
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
            configFile: 'tsconfig.json'
        },
        exclude: /node_modules/
      }
    ]
  }
};
