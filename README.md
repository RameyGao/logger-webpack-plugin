# Logger Webpack Plugin

> Greate change logs after building into the production environment

## install

```sh
npm install logger-webpack-plugin --save-dev
```

## import
```
const loggerWebpackPlugin = require('logger-webpack-plugin');
```

## config
```javascript
module.exports = {
  .....
  output: {
    filename: "[name].bundle.js?[hash:6]", // 6
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets'
  },
 plugins:[
   new loggerWebpackPlugin({
     version: '0.0.1', // optional, default：1.0.0
     hashLen: 6, // optional，default: 6, if need, you will keep length with the length of output file
     CDN_PATH: '//example.com', // optional，default: ''
     branch: 'test' // optional，default: master, if svn, you will do nothing
   })
 ]
}
```

# generate file
> In the root directory, the build_logs folder will be generated
```
=================================================================================
[Version] 1.0.0
[Hash] 55207c
[Build time] 2018-9-13 15:36:55
[System] Windows_NT/win32/x64/10.0.16299/15.9G
[Nodejs version] v8.11.2
[Build user] shawn
[Project path] D:/project/test
[CDN address]
=================================================================================
```
