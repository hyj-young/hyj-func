const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
   entry: {
     app: './src/index.js'
   },
   plugins: [
     new CleanWebpackPlugin(['dist'])
   ],
   module: {
  	 rules: [
  		{ 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      }
  	 ]
   },
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'hyj-func.js',
      library: 'hyjFunc',
      libraryTarget: 'umd'
   }
};