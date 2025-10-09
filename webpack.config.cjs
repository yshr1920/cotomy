const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.ts',
  target: ['web', 'es2020'],
  output: {
    filename: 'index.cjs',
    path: path.resolve(__dirname, 'dist/cjs'),
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
          configFile: 'tsconfig.webpack.json'
        },
        exclude: /node_modules/
      }
    ]
  },
};
