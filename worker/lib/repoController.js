/*
 * Clone or Pull from remote origin repo intelligently
 */
const REPO_PATH = './../../repo'; //keep this out of our own git root
const mkdirp = require('mkdirp');

const glob = require('glob-all');

mkdirp.sync(REPO_PATH); //idempotent
const git = require('simple-git')(REPO_PATH);

const ORIGIN = 'https://github.com/firehol/blocklist-ipsets.git';

module.exports = {
  /*
   * Clone from the remote into our repo directory
   */
  clone: function(cb){
    console.log('Cloning repo, this may take a moment...');
    git.outputHandler(function (command, stdout, stderr) {
      stdout.pipe(process.stdout);
      stderr.pipe(process.stderr);
    }).clone(ORIGIN, '.', {'--depth':'1', '--branch': 'master'}, cb);
  },
  /*
   * Pull latest from origin on branch master
   */
  pull: function(cb){
    console.log('Pulling latest repo changes, this may take a moment...');
    git.outputHandler(function (command, stdout, stderr) {
      stdout.pipe(process.stdout);
      stderr.pipe(process.stderr);
    }).pull('origin', 'master', cb);
  },
  /*
   * Gets repo status, used to check if our repo is cloned and valid
   */
  status: function(cb){
    git.status(cb);
  },
  /*
   * Checks repo status, if no status or err does a clone, otherwise pulls
   */
  update: function(cb){
    module.exports.status(function(err, status){
      if(err || !status){
        module.exports.clone(cb);
      }else{
        module.exports.pull(cb);
      }
    });
  }
};
