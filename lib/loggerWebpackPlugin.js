const fs = require('fs');
const os = require('os');
const process = require('process');
const shell = require('shelljs');

class LoggerWebpackPlugin {
  constructor(options) {
    this.options = {
      version: '1.0.0',
      hashLen: 6,
      CDN_PATH: '',
      branch: 'master'
    }
    this.options = Object.assign({}, this.options, options);
    if (fs.existsSync('.svn') && !shell.which('svn')) {
      shell.echo(`Sorry, svn commond line must be provided`);
      shell.exit(1);
    }
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const { version, hashLen, CDN_PATH, branch } = this.options;
      const d = new Date();
      if (!fs.existsSync('build_logs')) {
        fs.mkdirSync('build_logs');
      }
      const log_file = `build_logs/${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.log`;
      const logs = `=================================================================================
[Version] ${version}
[Hash] ${compilation.getStats().hash.substring(0, hashLen)}
[Build time] ${d.toLocaleString()}
[System] ${os.type()}/${os.platform()}/${os.arch()}/${os.release()}/${(os.totalmem()/1024/1024/1024).toFixed(1) + 'G'}
[Nodejs version] ${process.version}
[Build user] ${(process.env.USER ? process.env.USER + ':' : '')}${process.env.LOGNAME ? process.env.LOGNAME + '@' : ''}${os.hostname()}
[Project path] ${process.env.PWD}
[CDN address] ${CDN_PATH || ''}
=================================================================================\n\n`;
      fs.writeFileSync(log_file, logs, { flag: 'a+' });

      if (fs.existsSync('.git')) {
        shell.exec(`git add -f ${log_file}`).stdout;
        shell.exec('git commit -m "Generate change logs for build"').stdout;
        shell.exec(`git push -u origin ${branch}`).stdout;
      } else {
        shell.exec(`svn add --parents ${log_file}`).stdout;
        shell.exec('svn commit -m "Generate change logs for build"').stdout;
      }
      callback();
    });
  }
}

module.exports = LoggerWebpackPlugin;
