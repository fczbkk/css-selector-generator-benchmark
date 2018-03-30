const path = require('path');

module.exports = {
  mode: 'production',
  entry: './node_modules/@medv/finder/dist/index.js',
  output: {
    path: path.resolve(__dirname, '../temp/finder/'),
    filename: 'index.js',
    library: 'finder',
    libraryTarget: 'var'
  }
};