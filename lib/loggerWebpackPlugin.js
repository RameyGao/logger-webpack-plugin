'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var os = require('os');
var process = require('process');
var shell = require('shelljs');

var LoggerWebpackPlugin = function () {
  function LoggerWebpackPlugin(options) {
    _classCallCheck(this, LoggerWebpackPlugin);

    this.options = {
      version: '1.0.0',
      hashLen: 6,
      CDN_PATH: '',
      branch: 'master'
    };
    this.options = Object.assign({}, this.options, options);
    if (fs.existsSync('.svn') && !shell.which('svn')) {
      shell.echo('Sorry, svn commond line must be provided');
      shell.exit(1);
    }
  }

  _createClass(LoggerWebpackPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('after-emit', function (compilation, callback) {
        var _options = _this.options,
            version = _options.version,
            hashLen = _options.hashLen,
            CDN_PATH = _options.CDN_PATH,
            branch = _options.branch;

        var d = new Date();
        if (!fs.existsSync('build_logs')) {
          fs.mkdirSync('build_logs');
        }
        var log_file = 'build_logs/' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '.log';
        var logs = '=================================================================================\n[Version] ' + version + '\n[Hash] ' + compilation.getStats().hash.substring(0, hashLen) + '\n[Build time] ' + d.toLocaleString() + '\n[System] ' + os.type() + '/' + os.platform() + '/' + os.arch() + '/' + os.release() + '/' + ((os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + 'G') + '\n[Nodejs version] ' + process.version + '\n[Build user] ' + (process.env.USER ? process.env.USER + ':' : '') + (process.env.LOGNAME ? process.env.LOGNAME + '@' : '') + os.hostname() + '\n[Project path] ' + process.env.PWD + '\n[CDN address] ' + (CDN_PATH || '') + '\n=================================================================================\n\n';
        fs.writeFileSync(log_file, logs, { flag: 'a+' });

        if (fs.existsSync('.git')) {
          shell.exec('git add -f ' + log_file).stdout;
          shell.exec('git commit -m "Generate change logs for build"').stdout;
          shell.exec('git push -u origin ' + branch).stdout;
        } else {
          shell.exec('svn add --parents ' + log_file).stdout;
          shell.exec('svn commit -m "Generate change logs for build"').stdout;
        }
        callback();
      });
    }
  }]);

  return LoggerWebpackPlugin;
}();

module.exports = LoggerWebpackPlugin;