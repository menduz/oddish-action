#!/usr/bin/env node
module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(657);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('rm', _rm, {
  cmdOptions: {
    'f': 'force',
    'r': 'recursive',
    'R': 'recursive',
  },
});

// Recursively removes 'dir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
function rmdirSyncRecursive(dir, force) {
  var files;

  files = fs.readdirSync(dir);

  // Loop through and delete everything in the sub-tree after checking it
  for (var i = 0; i < files.length; i++) {
    var file = dir + '/' + files[i];
    var currFile = fs.lstatSync(file);

    if (currFile.isDirectory()) { // Recursive function back to the beginning
      rmdirSyncRecursive(file, force);
    } else { // Assume it's a file - perhaps a try/catch belongs here?
      if (force || isWriteable(file)) {
        try {
          common.unlinkSync(file);
        } catch (e) {
          /* istanbul ignore next */
          common.error('could not remove file (code ' + e.code + '): ' + file, {
            continue: true,
          });
        }
      }
    }
  }

  // Now that we know everything in the sub-tree has been deleted, we can delete the main directory.
  // Huzzah for the shopkeep.

  var result;
  try {
    // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
    var start = Date.now();

    // TODO: replace this with a finite loop
    for (;;) {
      try {
        result = fs.rmdirSync(dir);
        if (fs.existsSync(dir)) throw { code: 'EAGAIN' };
        break;
      } catch (er) {
        /* istanbul ignore next */
        // In addition to error codes, also check if the directory still exists and loop again if true
        if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM' || er.code === 'EAGAIN')) {
          if (Date.now() - start > 1000) throw er;
        } else if (er.code === 'ENOENT') {
          // Directory did not exist, deletion was successful
          break;
        } else {
          throw er;
        }
      }
    }
  } catch (e) {
    common.error('could not remove directory (code ' + e.code + '): ' + dir, { continue: true });
  }

  return result;
} // rmdirSyncRecursive

// Hack to determine if file has write permissions for current user
// Avoids having to check user, group, etc, but it's probably slow
function isWriteable(file) {
  var writePermission = true;
  try {
    var __fd = fs.openSync(file, 'a');
    fs.closeSync(__fd);
  } catch (e) {
    writePermission = false;
  }

  return writePermission;
}

//@
//@ ### rm([options,] file [, file ...])
//@ ### rm([options,] file_array)
//@ Available options:
//@
//@ + `-f`: force
//@ + `-r, -R`: recursive
//@
//@ Examples:
//@
//@ ```javascript
//@ rm('-rf', '/tmp/*');
//@ rm('some_file.txt', 'another_file.txt');
//@ rm(['some_file.txt', 'another_file.txt']); // same as above
//@ ```
//@
//@ Removes files.
function _rm(options, files) {
  if (!files) common.error('no paths given');

  // Convert to array
  files = [].slice.call(arguments, 1);

  files.forEach(function (file) {
    var stats;
    try {
      stats = fs.lstatSync(file); // test for existence
    } catch (e) {
      // Path does not exist, no force flag given
      if (!options.force) {
        common.error('no such file or directory: ' + file, { continue: true });
      }
      return; // skip file
    }

    // If here, path exists
    if (stats.isFile()) {
      if (options.force || isWriteable(file)) {
        // -f was passed, or file is writable, so it can be removed
        common.unlinkSync(file);
      } else {
        common.error('permission denied: ' + file, { continue: true });
      }
    } else if (stats.isDirectory()) {
      if (options.recursive) {
        // -r was passed, so directory can be removed
        rmdirSyncRecursive(file, options.force);
      } else {
        common.error('path is a directory', { continue: true });
      }
    } else if (stats.isSymbolicLink() || stats.isFIFO()) {
      common.unlinkSync(file);
    }
  }); // forEach(file)
  return '';
} // rm
module.exports = _rm;


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const {MAX_LENGTH} = __webpack_require__(381)
const { re, t } = __webpack_require__(616)
const SemVer = __webpack_require__(503)

const parse = (version, options) => {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  const r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

module.exports = parse


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(658);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If `wmic` is obsoloete (later versions of Windows 10), use PowerShell instead.
	// If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		let stdout;
		try {
			stdout = execa.sync('powershell', ['(Get-CimInstance -ClassName Win32_OperatingSystem).caption']).stdout || '';
		} catch (_) {
			stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		}

		const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const eq = __webpack_require__(490)
const neq = __webpack_require__(720)
const gt = __webpack_require__(872)
const gte = __webpack_require__(823)
const lt = __webpack_require__(265)
const lte = __webpack_require__(74)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),
/* 19 */
/***/ (function() {

// see dirs.js


/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var _tempDir = __webpack_require__(986);
var _pwd = __webpack_require__(330);
var path = __webpack_require__(622);
var fs = __webpack_require__(747);
var child = __webpack_require__(129);

var DEFAULT_MAXBUFFER_SIZE = 20 * 1024 * 1024;

common.register('exec', _exec, {
  unix: false,
  canReceivePipe: true,
  wrapOutput: false,
});

// Hack to run child_process.exec() synchronously (sync avoids callback hell)
// Uses a custom wait loop that checks for a flag file, created when the child process is done.
// (Can't do a wait loop that checks for internal Node variables/messages as
// Node is single-threaded; callbacks and other internal state changes are done in the
// event loop).
function execSync(cmd, opts, pipe) {
  if (!common.config.execPath) {
    common.error('Unable to find a path to the node binary. Please manually set config.execPath');
  }

  var tempDir = _tempDir();
  var stdoutFile = path.resolve(tempDir + '/' + common.randomFileName());
  var stderrFile = path.resolve(tempDir + '/' + common.randomFileName());
  var codeFile = path.resolve(tempDir + '/' + common.randomFileName());
  var scriptFile = path.resolve(tempDir + '/' + common.randomFileName());
  var sleepFile = path.resolve(tempDir + '/' + common.randomFileName());

  opts = common.extend({
    silent: common.config.silent,
    cwd: _pwd().toString(),
    env: process.env,
    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
  }, opts);

  var previousStdoutContent = '';
  var previousStderrContent = '';
  // Echoes stdout and stderr changes from running process, if not silent
  function updateStream(streamFile) {
    if (opts.silent || !fs.existsSync(streamFile)) {
      return;
    }

    var previousStreamContent;
    var procStream;
    if (streamFile === stdoutFile) {
      previousStreamContent = previousStdoutContent;
      procStream = process.stdout;
    } else { // assume stderr
      previousStreamContent = previousStderrContent;
      procStream = process.stderr;
    }

    var streamContent = fs.readFileSync(streamFile, 'utf8');
    // No changes since last time?
    if (streamContent.length <= previousStreamContent.length) {
      return;
    }

    procStream.write(streamContent.substr(previousStreamContent.length));
    previousStreamContent = streamContent;
  }

  if (fs.existsSync(scriptFile)) common.unlinkSync(scriptFile);
  if (fs.existsSync(stdoutFile)) common.unlinkSync(stdoutFile);
  if (fs.existsSync(stderrFile)) common.unlinkSync(stderrFile);
  if (fs.existsSync(codeFile)) common.unlinkSync(codeFile);

  var execCommand = JSON.stringify(common.config.execPath) + ' ' + JSON.stringify(scriptFile);
  var script;

  opts.cwd = path.resolve(opts.cwd);
  var optString = JSON.stringify(opts);

  if (typeof child.execSync === 'function') {
    script = [
      "var child = require('child_process')",
      "  , fs = require('fs');",
      'var childProcess = child.exec(' + JSON.stringify(cmd) + ', ' + optString + ', function(err) {',
      '  var fname = ' + JSON.stringify(codeFile) + ';',
      '  if (!err) {',
      '    fs.writeFileSync(fname, "0");',
      '  } else if (err.code === undefined) {',
      '    fs.writeFileSync(fname, "1");',
      '  } else {',
      '    fs.writeFileSync(fname, err.code.toString());',
      '  }',
      '});',
      'var stdoutStream = fs.createWriteStream(' + JSON.stringify(stdoutFile) + ');',
      'var stderrStream = fs.createWriteStream(' + JSON.stringify(stderrFile) + ');',
      'childProcess.stdout.pipe(stdoutStream, {end: false});',
      'childProcess.stderr.pipe(stderrStream, {end: false});',
      'childProcess.stdout.pipe(process.stdout);',
      'childProcess.stderr.pipe(process.stderr);',
    ].join('\n') +
      (pipe ? '\nchildProcess.stdin.end(' + JSON.stringify(pipe) + ');\n' : '\n') +
      [
        'var stdoutEnded = false, stderrEnded = false;',
        'function tryClosingStdout(){ if(stdoutEnded){ stdoutStream.end(); } }',
        'function tryClosingStderr(){ if(stderrEnded){ stderrStream.end(); } }',
        "childProcess.stdout.on('end', function(){ stdoutEnded = true; tryClosingStdout(); });",
        "childProcess.stderr.on('end', function(){ stderrEnded = true; tryClosingStderr(); });",
      ].join('\n');

    fs.writeFileSync(scriptFile, script);

    if (opts.silent) {
      opts.stdio = 'ignore';
    } else {
      opts.stdio = [0, 1, 2];
    }

    // Welcome to the future
    try {
      child.execSync(execCommand, opts);
    } catch (e) {
      // Clean up immediately if we have an exception
      try { common.unlinkSync(scriptFile); } catch (e2) {}
      try { common.unlinkSync(stdoutFile); } catch (e2) {}
      try { common.unlinkSync(stderrFile); } catch (e2) {}
      try { common.unlinkSync(codeFile); } catch (e2) {}
      throw e;
    }
  } else {
    cmd += ' > ' + stdoutFile + ' 2> ' + stderrFile; // works on both win/unix

    script = [
      "var child = require('child_process')",
      "  , fs = require('fs');",
      'var childProcess = child.exec(' + JSON.stringify(cmd) + ', ' + optString + ', function(err) {',
      '  var fname = ' + JSON.stringify(codeFile) + ';',
      '  if (!err) {',
      '    fs.writeFileSync(fname, "0");',
      '  } else if (err.code === undefined) {',
      '    fs.writeFileSync(fname, "1");',
      '  } else {',
      '    fs.writeFileSync(fname, err.code.toString());',
      '  }',
      '});',
    ].join('\n') +
      (pipe ? '\nchildProcess.stdin.end(' + JSON.stringify(pipe) + ');\n' : '\n');

    fs.writeFileSync(scriptFile, script);

    child.exec(execCommand, opts);

    // The wait loop
    // sleepFile is used as a dummy I/O op to mitigate unnecessary CPU usage
    // (tried many I/O sync ops, writeFileSync() seems to be only one that is effective in reducing
    // CPU usage, though apparently not so much on Windows)
    while (!fs.existsSync(codeFile)) { updateStream(stdoutFile); fs.writeFileSync(sleepFile, 'a'); }
    while (!fs.existsSync(stdoutFile)) { updateStream(stdoutFile); fs.writeFileSync(sleepFile, 'a'); }
    while (!fs.existsSync(stderrFile)) { updateStream(stderrFile); fs.writeFileSync(sleepFile, 'a'); }
    try { common.unlinkSync(sleepFile); } catch (e) {}
  }

  // At this point codeFile exists, but it's not necessarily flushed yet.
  // Keep reading it until it is.
  var code = parseInt('', 10);
  while (isNaN(code)) {
    code = parseInt(fs.readFileSync(codeFile, 'utf8'), 10);
  }

  var stdout = fs.readFileSync(stdoutFile, 'utf8');
  var stderr = fs.readFileSync(stderrFile, 'utf8');

  // No biggie if we can't erase the files now -- they're in a temp dir anyway
  try { common.unlinkSync(scriptFile); } catch (e) {}
  try { common.unlinkSync(stdoutFile); } catch (e) {}
  try { common.unlinkSync(stderrFile); } catch (e) {}
  try { common.unlinkSync(codeFile); } catch (e) {}

  if (code !== 0) {
    common.error('', code, { continue: true });
  }
  var obj = common.ShellString(stdout, stderr, code);
  return obj;
} // execSync()

// Wrapper around exec() to enable echoing output to console in real time
function execAsync(cmd, opts, pipe, callback) {
  var stdout = '';
  var stderr = '';

  opts = common.extend({
    silent: common.config.silent,
    cwd: _pwd().toString(),
    env: process.env,
    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
  }, opts);

  var c = child.exec(cmd, opts, function (err) {
    if (callback) {
      if (!err) {
        callback(0, stdout, stderr);
      } else if (err.code === undefined) {
        // See issue #536
        callback(1, stdout, stderr);
      } else {
        callback(err.code, stdout, stderr);
      }
    }
  });

  if (pipe) c.stdin.end(pipe);

  c.stdout.on('data', function (data) {
    stdout += data;
    if (!opts.silent) process.stdout.write(data);
  });

  c.stderr.on('data', function (data) {
    stderr += data;
    if (!opts.silent) process.stderr.write(data);
  });

  return c;
}

//@
//@ ### exec(command [, options] [, callback])
//@ Available options (all `false` by default):
//@
//@ + `async`: Asynchronous execution. If a callback is provided, it will be set to
//@   `true`, regardless of the passed value.
//@ + `silent`: Do not echo program output to console.
//@ + and any option available to Node.js's
//@   [child_process.exec()](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
//@
//@ Examples:
//@
//@ ```javascript
//@ var version = exec('node --version', {silent:true}).stdout;
//@
//@ var child = exec('some_long_running_process', {async:true});
//@ child.stdout.on('data', function(data) {
//@   /* ... do something with data ... */
//@ });
//@
//@ exec('some_long_running_process', function(code, stdout, stderr) {
//@   console.log('Exit code:', code);
//@   console.log('Program output:', stdout);
//@   console.log('Program stderr:', stderr);
//@ });
//@ ```
//@
//@ Executes the given `command` _synchronously_, unless otherwise specified.  When in synchronous
//@ mode, this returns a ShellString (compatible with ShellJS v0.6.x, which returns an object
//@ of the form `{ code:..., stdout:... , stderr:... }`). Otherwise, this returns the child process
//@ object, and the `callback` gets the arguments `(code, stdout, stderr)`.
//@
//@ Not seeing the behavior you want? `exec()` runs everything through `sh`
//@ by default (or `cmd.exe` on Windows), which differs from `bash`. If you
//@ need bash-specific behavior, try out the `{shell: 'path/to/bash'}` option.
//@
//@ **Note:** For long-lived processes, it's best to run `exec()` asynchronously as
//@ the current synchronous implementation uses a lot of CPU. This should be getting
//@ fixed soon.
function _exec(command, options, callback) {
  options = options || {};
  if (!command) common.error('must specify command');

  var pipe = common.readFromPipe();

  // Callback is defined instead of options.
  if (typeof options === 'function') {
    callback = options;
    options = { async: true };
  }

  // Callback is defined with options.
  if (typeof options === 'object' && typeof callback === 'function') {
    options.async = true;
  }

  options = common.extend({
    silent: common.config.silent,
    async: false,
  }, options);

  try {
    if (options.async) {
      return execAsync(command, options, pipe, callback);
    } else {
      return execSync(command, options, pipe);
    }
  } catch (e) {
    common.error('internal error');
  }
}
module.exports = _exec;


/***/ }),
/* 27 */,
/* 28 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(528)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('touch', _touch, {
  cmdOptions: {
    'a': 'atime_only',
    'c': 'no_create',
    'd': 'date',
    'm': 'mtime_only',
    'r': 'reference',
  },
});

//@
//@ ### touch([options,] file [, file ...])
//@ ### touch([options,] file_array)
//@ Available options:
//@
//@ + `-a`: Change only the access time
//@ + `-c`: Do not create any files
//@ + `-m`: Change only the modification time
//@ + `-d DATE`: Parse DATE and use it instead of current time
//@ + `-r FILE`: Use FILE's times instead of current time
//@
//@ Examples:
//@
//@ ```javascript
//@ touch('source.js');
//@ touch('-c', '/path/to/some/dir/source.js');
//@ touch({ '-r': FILE }, '/path/to/some/dir/source.js');
//@ ```
//@
//@ Update the access and modification times of each FILE to the current time.
//@ A FILE argument that does not exist is created empty, unless -c is supplied.
//@ This is a partial implementation of *[touch(1)](http://linux.die.net/man/1/touch)*.
function _touch(opts, files) {
  if (!files) {
    common.error('no files given');
  } else if (typeof files === 'string') {
    files = [].slice.call(arguments, 1);
  } else {
    common.error('file arg should be a string file path or an Array of string file paths');
  }

  files.forEach(function (f) {
    touchFile(opts, f);
  });
  return '';
}

function touchFile(opts, file) {
  var stat = tryStatFile(file);

  if (stat && stat.isDirectory()) {
    // don't error just exit
    return;
  }

  // if the file doesn't already exist and the user has specified --no-create then
  // this script is finished
  if (!stat && opts.no_create) {
    return;
  }

  // open the file and then close it. this will create it if it doesn't exist but will
  // not truncate the file
  fs.closeSync(fs.openSync(file, 'a'));

  //
  // Set timestamps
  //

  // setup some defaults
  var now = new Date();
  var mtime = opts.date || now;
  var atime = opts.date || now;

  // use reference file
  if (opts.reference) {
    var refStat = tryStatFile(opts.reference);
    if (!refStat) {
      common.error('failed to get attributess of ' + opts.reference);
    }
    mtime = refStat.mtime;
    atime = refStat.atime;
  } else if (opts.date) {
    mtime = opts.date;
    atime = opts.date;
  }

  if (opts.atime_only && opts.mtime_only) {
    // keep the new values of mtime and atime like GNU
  } else if (opts.atime_only) {
    mtime = stat.mtime;
  } else if (opts.mtime_only) {
    atime = stat.atime;
  }

  fs.utimesSync(file, atime, mtime);
}

module.exports = _touch;

function tryStatFile(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (e) {
    return null;
  }
}


/***/ }),
/* 34 */,
/* 35 */,
/* 36 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),
/* 37 */,
/* 38 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(626));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(528)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),
/* 44 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);

//@
//@ ### error()
//@ Tests if error occurred in the last command. Returns a truthy value if an
//@ error returned and a falsy value otherwise.
//@
//@ **Note**: do not rely on the
//@ return value to be an error message. If you need the last error message, use
//@ the `.stderr` attribute from the last command's return value instead.
function error() {
  return common.state.error;
}
module.exports = error;


/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(320);
var os = __webpack_require__(87);

common.register('cp', _cp, {
  cmdOptions: {
    'f': '!no_force',
    'n': 'no_force',
    'u': 'update',
    'R': 'recursive',
    'r': 'recursive',
    'L': 'followsymlink',
    'P': 'noFollowsymlink',
  },
  wrapOutput: false,
});

// Buffered file copy, synchronous
// (Using readFileSync() + writeFileSync() could easily cause a memory overflow
//  with large files)
function copyFileSync(srcFile, destFile, options) {
  if (!fs.existsSync(srcFile)) {
    common.error('copyFileSync: no such file or directory: ' + srcFile);
  }

  // Check the mtimes of the files if the '-u' flag is provided
  try {
    if (options.update && fs.statSync(srcFile).mtime < fs.statSync(destFile).mtime) {
      return;
    }
  } catch (e) {
    // If we're here, destFile probably doesn't exist, so just do a normal copy
  }

  if (fs.lstatSync(srcFile).isSymbolicLink() && !options.followsymlink) {
    try {
      fs.lstatSync(destFile);
      common.unlinkSync(destFile); // re-link it
    } catch (e) {
      // it doesn't exist, so no work needs to be done
    }

    var symlinkFull = fs.readlinkSync(srcFile);
    fs.symlinkSync(symlinkFull, destFile, os.platform() === 'win32' ? 'junction' : null);
  } else {
    var BUF_LENGTH = 64 * 1024;
    var buf = new Buffer(BUF_LENGTH);
    var bytesRead = BUF_LENGTH;
    var pos = 0;
    var fdr = null;
    var fdw = null;

    try {
      fdr = fs.openSync(srcFile, 'r');
    } catch (e) {
      /* istanbul ignore next */
      common.error('copyFileSync: could not read src file (' + srcFile + ')');
    }

    try {
      fdw = fs.openSync(destFile, 'w');
    } catch (e) {
      /* istanbul ignore next */
      common.error('copyFileSync: could not write to dest file (code=' + e.code + '):' + destFile);
    }

    while (bytesRead === BUF_LENGTH) {
      bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
      fs.writeSync(fdw, buf, 0, bytesRead);
      pos += bytesRead;
    }

    fs.closeSync(fdr);
    fs.closeSync(fdw);

    fs.chmodSync(destFile, fs.statSync(srcFile).mode);
  }
}

// Recursively copies 'sourceDir' into 'destDir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
function cpdirSyncRecursive(sourceDir, destDir, currentDepth, opts) {
  if (!opts) opts = {};

  // Ensure there is not a run away recursive copy
  if (currentDepth >= common.config.maxdepth) return;
  currentDepth++;

  // Create the directory where all our junk is moving to; read the mode of the
  // source directory and mirror it
  try {
    var checkDir = fs.statSync(sourceDir);
    fs.mkdirSync(destDir, checkDir.mode);
  } catch (e) {
    // if the directory already exists, that's okay
    if (e.code !== 'EEXIST') throw e;
  }

  var files = fs.readdirSync(sourceDir);

  for (var i = 0; i < files.length; i++) {
    var srcFile = sourceDir + '/' + files[i];
    var destFile = destDir + '/' + files[i];
    var srcFileStat = fs.lstatSync(srcFile);

    var symlinkFull;
    if (opts.followsymlink) {
      if (cpcheckcycle(sourceDir, srcFile)) {
        // Cycle link found.
        console.error('Cycle link found.');
        symlinkFull = fs.readlinkSync(srcFile);
        fs.symlinkSync(symlinkFull, destFile, os.platform() === 'win32' ? 'junction' : null);
        continue;
      }
    }
    if (srcFileStat.isDirectory()) {
      /* recursion this thing right on back. */
      cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
    } else if (srcFileStat.isSymbolicLink() && !opts.followsymlink) {
      symlinkFull = fs.readlinkSync(srcFile);
      try {
        fs.lstatSync(destFile);
        common.unlinkSync(destFile); // re-link it
      } catch (e) {
        // it doesn't exist, so no work needs to be done
      }
      fs.symlinkSync(symlinkFull, destFile, os.platform() === 'win32' ? 'junction' : null);
    } else if (srcFileStat.isSymbolicLink() && opts.followsymlink) {
      srcFileStat = fs.statSync(srcFile);
      if (srcFileStat.isDirectory()) {
        cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
      } else {
        copyFileSync(srcFile, destFile, opts);
      }
    } else {
      /* At this point, we've hit a file actually worth copying... so copy it on over. */
      if (fs.existsSync(destFile) && opts.no_force) {
        common.log('skipping existing file: ' + files[i]);
      } else {
        copyFileSync(srcFile, destFile, opts);
      }
    }
  } // for files
} // cpdirSyncRecursive

function cpcheckcycle(sourceDir, srcFile) {
  var srcFileStat = fs.lstatSync(srcFile);
  if (srcFileStat.isSymbolicLink()) {
    // Do cycle check. For example:
    //   $ mkdir -p 1/2/3/4
    //   $ cd  1/2/3/4
    //   $ ln -s ../../3 link
    //   $ cd ../../../..
    //   $ cp -RL 1 copy
    var cyclecheck = fs.statSync(srcFile);
    if (cyclecheck.isDirectory()) {
      var sourcerealpath = fs.realpathSync(sourceDir);
      var symlinkrealpath = fs.realpathSync(srcFile);
      var re = new RegExp(symlinkrealpath);
      if (re.test(sourcerealpath)) {
        return true;
      }
    }
  }
  return false;
}

//@
//@ ### cp([options,] source [, source ...], dest)
//@ ### cp([options,] source_array, dest)
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@ + `-u`: only copy if source is newer than dest
//@ + `-r`, `-R`: recursive
//@ + `-L`: follow symlinks
//@ + `-P`: don't follow symlinks
//@
//@ Examples:
//@
//@ ```javascript
//@ cp('file1', 'dir1');
//@ cp('-R', 'path/to/dir/', '~/newCopy/');
//@ cp('-Rf', '/tmp/*', '/usr/local/*', '/home/tmp');
//@ cp('-Rf', ['/tmp/*', '/usr/local/*'], '/home/tmp'); // same as above
//@ ```
//@
//@ Copies files.
function _cp(options, sources, dest) {
  // If we're missing -R, it actually implies -L (unless -P is explicit)
  if (options.followsymlink) {
    options.noFollowsymlink = false;
  }
  if (!options.recursive && !options.noFollowsymlink) {
    options.followsymlink = true;
  }

  // Get sources, dest
  if (arguments.length < 3) {
    common.error('missing <source> and/or <dest>');
  } else {
    sources = [].slice.call(arguments, 1, arguments.length - 1);
    dest = arguments[arguments.length - 1];
  }

  var destExists = fs.existsSync(dest);
  var destStat = destExists && fs.statSync(dest);

  // Dest is not existing dir, but multiple sources given
  if ((!destExists || !destStat.isDirectory()) && sources.length > 1) {
    common.error('dest is not a directory (too many sources)');
  }

  // Dest is an existing file, but -n is given
  if (destExists && destStat.isFile() && options.no_force) {
    return new common.ShellString('', '', 0);
  }

  sources.forEach(function (src) {
    if (!fs.existsSync(src)) {
      common.error('no such file or directory: ' + src, { continue: true });
      return; // skip file
    }
    var srcStat = fs.statSync(src);
    if (!options.noFollowsymlink && srcStat.isDirectory()) {
      if (!options.recursive) {
        // Non-Recursive
        common.error("omitting directory '" + src + "'", { continue: true });
      } else {
        // Recursive
        // 'cp /a/source dest' should create 'source' in 'dest'
        var newDest = (destStat && destStat.isDirectory()) ?
            path.join(dest, path.basename(src)) :
            dest;

        try {
          fs.statSync(path.dirname(dest));
          cpdirSyncRecursive(src, newDest, 0, { no_force: options.no_force, followsymlink: options.followsymlink });
        } catch (e) {
          /* istanbul ignore next */
          common.error("cannot create directory '" + dest + "': No such file or directory");
        }
      }
    } else {
      // If here, src is a file

      // When copying to '/path/dir':
      //    thisDest = '/path/dir/file1'
      var thisDest = dest;
      if (destStat && destStat.isDirectory()) {
        thisDest = path.normalize(dest + '/' + path.basename(src));
      }

      if (fs.existsSync(thisDest) && options.no_force) {
        return; // skip file
      }

      if (path.relative(src, thisDest) === '') {
        // a file cannot be copied to itself, but we want to continue copying other files
        common.error("'" + thisDest + "' and '" + src + "' are the same file", { continue: true });
        return;
      }

      copyFileSync(src, thisDest, options);
    }
  }); // forEach(src)

  return new common.ShellString('', common.state.error, common.state.errorCode);
}
module.exports = _cp;


/***/ }),
/* 51 */,
/* 52 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(528)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),
/* 53 */,
/* 54 */,
/* 55 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate;

const { Deprecation } = __webpack_require__(166);
const once = __webpack_require__(180);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}


/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Range = __webpack_require__(262)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}
module.exports = intersects


/***/ }),
/* 63 */,
/* 64 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const parse = __webpack_require__(8)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),
/* 65 */,
/* 66 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */
/***/ (function(module) {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),
/* 86 */,
/* 87 */
/***/ (function(module) {

module.exports = require("os");

/***/ }),
/* 88 */,
/* 89 */
/***/ (function() {

// see dirs.js


/***/ }),
/* 90 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(583);

module.exports = factory();


/***/ }),
/* 91 */,
/* 92 */
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),
/* 93 */
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),
/* 94 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),
/* 95 */,
/* 96 */,
/* 97 */
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),
/* 98 */,
/* 99 */,
/* 100 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(820));
var universalUserAgent = __webpack_require__(366);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.0";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(202)
const getPageLinks = __webpack_require__(816)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),
/* 114 */,
/* 115 */,
/* 116 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var constants = __webpack_require__(619)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, cb) {
      return orig.call(fs, target, function (er, stats) {
        if (!stats) return cb.apply(this, arguments)
        if (stats.uid < 0) stats.uid += 0x100000000
        if (stats.gid < 0) stats.gid += 0x100000000
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target) {
      var stats = orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */
/***/ (function(module) {

module.exports = eval("require")("encoding");


/***/ }),
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(924)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate;

const { RequestError } = __webpack_require__(197);
const get = __webpack_require__(356);
const set = __webpack_require__(862);

function validate(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}


/***/ }),
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),
/* 148 */
/***/ (function(module) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */
/***/ (function(module) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),
/* 167 */,
/* 168 */,
/* 169 */
/***/ (function(module) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(66)
} else {
  core = __webpack_require__(530)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),
/* 176 */,
/* 177 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const parse = __webpack_require__(8)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),
/* 178 */,
/* 179 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('grep', _grep, {
  globStart: 2, // don't glob-expand the regex
  canReceivePipe: true,
  cmdOptions: {
    'v': 'inverse',
    'l': 'nameOnly',
  },
});

//@
//@ ### grep([options,] regex_filter, file [, file ...])
//@ ### grep([options,] regex_filter, file_array)
//@ Available options:
//@
//@ + `-v`: Inverse the sense of the regex and print the lines not matching the criteria.
//@ + `-l`: Print only filenames of matching files
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('-v', 'GLOBAL_VARIABLE', '*.js');
//@ grep('GLOBAL_VARIABLE', '*.js');
//@ ```
//@
//@ Reads input string from given files and returns a string containing all lines of the
//@ file that match the given `regex_filter`.
function _grep(options, regex, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given', 2);

  files = [].slice.call(arguments, 2);

  if (pipe) {
    files.unshift('-');
  }

  var grep = [];
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, 2, { continue: true });
      return;
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    var lines = contents.split(/\r*\n/);
    if (options.nameOnly) {
      if (contents.match(regex)) {
        grep.push(file);
      }
    } else {
      lines.forEach(function (line) {
        var matched = line.match(regex);
        if ((options.inverse && !matched) || (!options.inverse && matched)) {
          grep.push(line);
        }
      });
    }
  });

  return grep.join('\n') + '\n';
}
module.exports = _grep;


/***/ }),
/* 180 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(97)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(166);
var once = _interopDefault(__webpack_require__(180));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),
/* 203 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Range = __webpack_require__(262)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),
/* 204 */,
/* 205 */,
/* 206 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(202)
const getPageLinks = __webpack_require__(816)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),
/* 207 */,
/* 208 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { Deprecation } = __webpack_require__(166);
const once = __webpack_require__(180);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

const authenticate = __webpack_require__(55);
const beforeRequest = __webpack_require__(751);
const requestError = __webpack_require__(473);

function authenticationPlugin(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate.bind(null, state);
  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),
/* 209 */,
/* 210 */,
/* 211 */
/***/ (function(module) {

module.exports = require("https");

/***/ }),
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(747)
var rp = __webpack_require__(134)
var minimatch = __webpack_require__(645)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(569).Glob
var util = __webpack_require__(669)
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(159)
var common = __webpack_require__(925)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),
/* 220 */,
/* 221 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('sed', _sed, {
  globStart: 3, // don't glob-expand regexes
  canReceivePipe: true,
  cmdOptions: {
    'i': 'inplace',
  },
});

//@
//@ ### sed([options,] search_regex, replacement, file [, file ...])
//@ ### sed([options,] search_regex, replacement, file_array)
//@ Available options:
//@
//@ + `-i`: Replace contents of 'file' in-place. _Note that no backups will be created!_
//@
//@ Examples:
//@
//@ ```javascript
//@ sed('-i', 'PROGRAM_VERSION', 'v0.1.3', 'source.js');
//@ sed(/.*DELETE_THIS_LINE.*\n/, '', 'source.js');
//@ ```
//@
//@ Reads an input string from `files` and performs a JavaScript `replace()` on the input
//@ using the given search regex and replacement string or function. Returns the new string after replacement.
//@
//@ Note:
//@
//@ Like unix `sed`, ShellJS `sed` supports capture groups. Capture groups are specified
//@ using the `$n` syntax:
//@
//@ ```javascript
//@ sed(/(\w+)\s(\w+)/, '$2, $1', 'file.txt');
//@ ```
function _sed(options, regex, replacement, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (typeof replacement !== 'string' && typeof replacement !== 'function') {
    if (typeof replacement === 'number') {
      replacement = replacement.toString(); // fallback
    } else {
      common.error('invalid replacement string');
    }
  }

  // Convert all search strings to RegExp
  if (typeof regex === 'string') {
    regex = RegExp(regex);
  }

  if (!files && !pipe) {
    common.error('no files given');
  }

  files = [].slice.call(arguments, 3);

  if (pipe) {
    files.unshift('-');
  }

  var sed = [];
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, 2, { continue: true });
      return;
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    var lines = contents.split(/\r*\n/);
    var result = lines.map(function (line) {
      return line.replace(regex, replacement);
    }).join('\n');

    sed.push(result);

    if (options.inplace) {
      fs.writeFileSync(file, result, 'utf8');
    }
  });

  return sed.join('\n');
}
module.exports = _sed;


/***/ }),
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(202)
const getPageLinks = __webpack_require__(816)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),
/* 233 */,
/* 234 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(180)
var eos = __webpack_require__(665)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(266)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),
/* 241 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(100);
var universalUserAgent = __webpack_require__(38);
var isPlainObject = _interopDefault(__webpack_require__(820));
var nodeFetch = _interopDefault(__webpack_require__(714));
var requestError = __webpack_require__(384);

const VERSION = "5.4.0";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First, split based on boolean or ||
    this.raw = range
    this.set = range
      .split(/\s*\|\|\s*/)
      // map the range to a 2d array of comparators
      .map(range => this.parseRange(range.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${range}`)
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => {
        return comps.join(' ').trim()
      })
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    const loose = this.options.loose
    range = range.trim()
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range, re[t.COMPARATORTRIM])

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)

    // normalize spaces
    range = range.split(/\s+/).join(' ')

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    const compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    return range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      .map(comp => replaceGTE0(comp, this.options))
      // in loose mode, throw out any that are not valid comparators
      .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
      .map(comp => new Comparator(comp, this.options))
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}
module.exports = Range

const Comparator = __webpack_require__(771)
const debug = __webpack_require__(85)
const SemVer = __webpack_require__(503)
const {
  re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace
} = __webpack_require__(616)

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
const replaceTildes = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceTilde(comp, options)
  }).join(' ')

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
const replaceCarets = (comp, options) =>
  comp.trim().split(/\s+/).map((comp) => {
    return replaceCaret(comp, options)
  }).join(' ')

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map((comp) => {
    return replaceXRange(comp, options)
  }).join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<')
        pr = '-0'

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp.trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return (`${from} ${to}`).trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),
/* 263 */,
/* 264 */,
/* 265 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),
/* 266 */
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var deprecation = __webpack_require__(166);

var endpointsByScope = {
  actions: {
    cancelWorkflowRun: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
    },
    createOrUpdateSecretForRepo: {
      method: "PUT",
      params: {
        encrypted_value: {
          type: "string"
        },
        key_id: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    createRegistrationToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/registration-token"
    },
    createRemoveToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/remove-token"
    },
    deleteArtifact: {
      method: "DELETE",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    deleteSecretFromRepo: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    downloadArtifact: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
    },
    getArtifact: {
      method: "GET",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/public-key"
    },
    getSecret: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    getSelfHostedRunner: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    },
    getWorkflow: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
    },
    getWorkflowJob: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id"
    },
    getWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id"
    },
    listDownloadsForSelfHostedRunnerApplication: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/downloads"
    },
    listJobsForWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
    },
    listRepoWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runs"
    },
    listRepoWorkflows: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows"
    },
    listSecretsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets"
    },
    listSelfHostedRunnersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners"
    },
    listWorkflowJobLogs: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
    },
    listWorkflowRunArtifacts: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
    },
    listWorkflowRunLogs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
    },
    listWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
    },
    reRunWorkflow: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
    },
    removeSelfHostedRunner: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    }
  },
  activity: {
    checkStarringRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    deleteRepoSubscription: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    deleteThreadSubscription: {
      method: "DELETE",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    getRepoSubscription: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    getThread: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    getThreadSubscription: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    listEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/orgs/:org"
    },
    listEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events"
    },
    listFeeds: {
      method: "GET",
      params: {},
      url: "/feeds"
    },
    listNotifications: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    listNotificationsForRepo: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    listPublicEvents: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/events"
    },
    listPublicEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/events"
    },
    listPublicEventsForRepoNetwork: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/networks/:owner/:repo/events"
    },
    listPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/public"
    },
    listReceivedEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events"
    },
    listReceivedPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events/public"
    },
    listRepoEvents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/events"
    },
    listReposStarredByAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/user/starred"
    },
    listReposStarredByUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/starred"
    },
    listReposWatchedByUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/subscriptions"
    },
    listStargazersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stargazers"
    },
    listWatchedReposForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/subscriptions"
    },
    listWatchersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscribers"
    },
    markAsRead: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    markNotificationsAsReadForRepo: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    markThreadAsRead: {
      method: "PATCH",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    setRepoSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        subscribed: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    setThreadSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    starRepo: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    unstarRepo: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    }
  },
  apps: {
    addRepoToInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "PUT",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    checkAccountIsAssociatedWithAny: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/accounts/:account_id"
    },
    checkAccountIsAssociatedWithAnyStubbed: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/accounts/:account_id"
    },
    checkAuthorization: {
      deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    checkToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "POST",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    createContentAttachment: {
      headers: {
        accept: "application/vnd.github.corsair-preview+json"
      },
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        content_reference_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/content_references/:content_reference_id/attachments"
    },
    createFromManifest: {
      headers: {
        accept: "application/vnd.github.fury-preview+json"
      },
      method: "POST",
      params: {
        code: {
          required: true,
          type: "string"
        }
      },
      url: "/app-manifests/:code/conversions"
    },
    createInstallationToken: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "POST",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        permissions: {
          type: "object"
        },
        repository_ids: {
          type: "integer[]"
        }
      },
      url: "/app/installations/:installation_id/access_tokens"
    },
    deleteAuthorization: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grant"
    },
    deleteInstallation: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    deleteToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    findOrgInstallation: {
      deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    findRepoInstallation: {
      deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    findUserInstallation: {
      deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    getAuthenticated: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {},
      url: "/app"
    },
    getBySlug: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        app_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/apps/:app_slug"
    },
    getInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    getOrgInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    getRepoInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    getUserInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    listAccountsUserOrOrgOnPlan: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/plans/:plan_id/accounts"
    },
    listAccountsUserOrOrgOnPlanStubbed: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
    },
    listInstallationReposForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/app/installations"
    },
    listInstallationsForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations"
    },
    listMarketplacePurchasesForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases"
    },
    listMarketplacePurchasesForAuthenticatedUserStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases/stubbed"
    },
    listPlans: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/plans"
    },
    listPlansStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/plans"
    },
    listRepos: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/installation/repositories"
    },
    removeRepoFromInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    resetAuthorization: {
      deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    resetToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "PATCH",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    revokeInstallationToken: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json"
      },
      method: "DELETE",
      params: {},
      url: "/installation/token"
    }
  },
  checks: {
    create: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        head_sha: {
          required: true,
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs"
    },
    createSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        head_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites"
    },
    get: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    },
    getSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id"
    },
    listAnnotations: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
    },
    listForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-runs"
    },
    listForSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        check_suite_id: {
          required: true,
          type: "integer"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
    },
    listSuitesForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        app_id: {
          type: "integer"
        },
        check_name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-suites"
    },
    rerequestSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
    },
    setSuitesPreferences: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        auto_trigger_checks: {
          type: "object[]"
        },
        "auto_trigger_checks[].app_id": {
          required: true,
          type: "integer"
        },
        "auto_trigger_checks[].setting": {
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/preferences"
    },
    update: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        check_run_id: {
          required: true,
          type: "integer"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    }
  },
  codesOfConduct: {
    getConductCode: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        key: {
          required: true,
          type: "string"
        }
      },
      url: "/codes_of_conduct/:key"
    },
    getForRepo: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/code_of_conduct"
    },
    listConductCodes: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {},
      url: "/codes_of_conduct"
    }
  },
  emojis: {
    get: {
      method: "GET",
      params: {},
      url: "/emojis"
    }
  },
  gists: {
    checkIsStarred: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        files: {
          required: true,
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        public: {
          type: "boolean"
        }
      },
      url: "/gists"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    delete: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    fork: {
      method: "POST",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    get: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    getRevision: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/:sha"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists"
    },
    listComments: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/commits"
    },
    listForks: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/public"
    },
    listPublicForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gists"
    },
    listStarred: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/starred"
    },
    star: {
      method: "PUT",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    unstar: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    update: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        files: {
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        "files.filename": {
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    }
  },
  git: {
    createBlob: {
      method: "POST",
      params: {
        content: {
          required: true,
          type: "string"
        },
        encoding: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs"
    },
    createCommit: {
      method: "POST",
      params: {
        author: {
          type: "object"
        },
        "author.date": {
          type: "string"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.date": {
          type: "string"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        parents: {
          required: true,
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        },
        signature: {
          type: "string"
        },
        tree: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits"
    },
    createRef: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs"
    },
    createTag: {
      method: "POST",
      params: {
        message: {
          required: true,
          type: "string"
        },
        object: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        },
        tagger: {
          type: "object"
        },
        "tagger.date": {
          type: "string"
        },
        "tagger.email": {
          type: "string"
        },
        "tagger.name": {
          type: "string"
        },
        type: {
          enum: ["commit", "tree", "blob"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags"
    },
    createTree: {
      method: "POST",
      params: {
        base_tree: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree: {
          required: true,
          type: "object[]"
        },
        "tree[].content": {
          type: "string"
        },
        "tree[].mode": {
          enum: ["100644", "100755", "040000", "160000", "120000"],
          type: "string"
        },
        "tree[].path": {
          type: "string"
        },
        "tree[].sha": {
          allowNull: true,
          type: "string"
        },
        "tree[].type": {
          enum: ["blob", "tree", "commit"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees"
    },
    deleteRef: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    },
    getBlob: {
      method: "GET",
      params: {
        file_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs/:file_sha"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits/:commit_sha"
    },
    getRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/ref/:ref"
    },
    getTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags/:tag_sha"
    },
    getTree: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        recursive: {
          enum: ["1"],
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees/:tree_sha"
    },
    listMatchingRefs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/matching-refs/:ref"
    },
    listRefs: {
      method: "GET",
      params: {
        namespace: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:namespace"
    },
    updateRef: {
      method: "PATCH",
      params: {
        force: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    }
  },
  gitignore: {
    getTemplate: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/gitignore/templates/:name"
    },
    listTemplates: {
      method: "GET",
      params: {},
      url: "/gitignore/templates"
    }
  },
  interactions: {
    addOrUpdateRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    addOrUpdateRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    getRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    getRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    removeRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    removeRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    }
  },
  issues: {
    addAssignees: {
      method: "POST",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    addLabels: {
      method: "POST",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          required: true,
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    checkAssignee: {
      method: "GET",
      params: {
        assignee: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees/:assignee"
    },
    create: {
      method: "POST",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    createLabel: {
      method: "POST",
      params: {
        color: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    createMilestone: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    deleteLabel: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    deleteMilestone: {
      method: "DELETE",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    get: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    getEvent: {
      method: "GET",
      params: {
        event_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events/:event_id"
    },
    getLabel: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    getMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    list: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/issues"
    },
    listAssignees: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees"
    },
    listComments: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments"
    },
    listEvents: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/events"
    },
    listEventsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events"
    },
    listEventsForTimeline: {
      headers: {
        accept: "application/vnd.github.mockingbird-preview+json"
      },
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/timeline"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/user/issues"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/issues"
    },
    listForRepo: {
      method: "GET",
      params: {
        assignee: {
          type: "string"
        },
        creator: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        mentioned: {
          type: "string"
        },
        milestone: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    listLabelsForMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
    },
    listLabelsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    listLabelsOnIssue: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    listMilestonesForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["due_on", "completeness"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    lock: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        lock_reason: {
          enum: ["off-topic", "too heated", "resolved", "spam"],
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    removeAssignees: {
      method: "DELETE",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    removeLabel: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
    },
    removeLabels: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    replaceLabels: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    unlock: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    update: {
      method: "PATCH",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          allowNull: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    updateLabel: {
      method: "PATCH",
      params: {
        color: {
          type: "string"
        },
        current_name: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:current_name"
    },
    updateMilestone: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    }
  },
  licenses: {
    get: {
      method: "GET",
      params: {
        license: {
          required: true,
          type: "string"
        }
      },
      url: "/licenses/:license"
    },
    getForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/license"
    },
    list: {
      deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
      method: "GET",
      params: {},
      url: "/licenses"
    },
    listCommonlyUsed: {
      method: "GET",
      params: {},
      url: "/licenses"
    }
  },
  markdown: {
    render: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        mode: {
          enum: ["markdown", "gfm"],
          type: "string"
        },
        text: {
          required: true,
          type: "string"
        }
      },
      url: "/markdown"
    },
    renderRaw: {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      },
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string"
        }
      },
      url: "/markdown/raw"
    }
  },
  meta: {
    get: {
      method: "GET",
      params: {},
      url: "/meta"
    }
  },
  migrations: {
    cancelImport: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    deleteArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    deleteArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    downloadArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    getArchiveForOrg: {
      deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getCommitAuthors: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors"
    },
    getImportProgress: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    getLargeFiles: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/large_files"
    },
    getStatusForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id"
    },
    getStatusForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id"
    },
    listForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/migrations"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations"
    },
    listReposForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repositories"
    },
    listReposForUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/:migration_id/repositories"
    },
    mapCommitAuthor: {
      method: "PATCH",
      params: {
        author_id: {
          required: true,
          type: "integer"
        },
        email: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors/:author_id"
    },
    setLfsPreference: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        use_lfs: {
          enum: ["opt_in", "opt_out"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/lfs"
    },
    startForAuthenticatedUser: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/migrations"
    },
    startForOrg: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        org: {
          required: true,
          type: "string"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/orgs/:org/migrations"
    },
    startImport: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tfvc_project: {
          type: "string"
        },
        vcs: {
          enum: ["subversion", "git", "mercurial", "tfvc"],
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_url: {
          required: true,
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    unlockRepoForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/migrations/:migration_id/repos/:repo_name/lock"
    },
    unlockRepoForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
    },
    updateImport: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    }
  },
  oauthAuthorizations: {
    checkAuthorization: {
      deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    createAuthorization: {
      deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
      method: "POST",
      params: {
        client_id: {
          type: "string"
        },
        client_secret: {
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          required: true,
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations"
    },
    deleteAuthorization: {
      deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
      method: "DELETE",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    deleteGrant: {
      deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
      method: "DELETE",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getAuthorization: {
      deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
      method: "GET",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    getGrant: {
      deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
      method: "GET",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getOrCreateAuthorizationForApp: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id"
    },
    getOrCreateAuthorizationForAppAndFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    getOrCreateAuthorizationForAppFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    listAuthorizations: {
      deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/authorizations"
    },
    listGrants: {
      deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/applications/grants"
    },
    resetAuthorization: {
      deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    updateAuthorization: {
      deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
      method: "PATCH",
      params: {
        add_scopes: {
          type: "string[]"
        },
        authorization_id: {
          required: true,
          type: "integer"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        remove_scopes: {
          type: "string[]"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/:authorization_id"
    }
  },
  orgs: {
    addOrUpdateMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    blockUser: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkBlockedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    checkPublicMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    concealMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    convertMemberToOutsideCollaborator: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks"
    },
    createInvitation: {
      method: "POST",
      params: {
        email: {
          type: "string"
        },
        invitee_id: {
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "direct_member", "billing_manager"],
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/orgs/:org/invitations"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    get: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    getMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    getMembershipForAuthenticatedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/organizations"
    },
    listBlockedUsers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/orgs"
    },
    listForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/orgs"
    },
    listHooks: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/hooks"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/installations"
    },
    listInvitationTeams: {
      method: "GET",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations/:invitation_id/teams"
    },
    listMembers: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["all", "admin", "member"],
          type: "string"
        }
      },
      url: "/orgs/:org/members"
    },
    listMemberships: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["active", "pending"],
          type: "string"
        }
      },
      url: "/user/memberships/orgs"
    },
    listOutsideCollaborators: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/outside_collaborators"
    },
    listPendingInvitations: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations"
    },
    listPublicMembers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/public_members"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id/pings"
    },
    publicizeMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    removeMember: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    removeMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    removeOutsideCollaborator: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    unblockUser: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    update: {
      method: "PATCH",
      params: {
        billing_email: {
          type: "string"
        },
        company: {
          type: "string"
        },
        default_repository_permission: {
          enum: ["read", "write", "admin", "none"],
          type: "string"
        },
        description: {
          type: "string"
        },
        email: {
          type: "string"
        },
        has_organization_projects: {
          type: "boolean"
        },
        has_repository_projects: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        members_allowed_repository_creation_type: {
          enum: ["all", "private", "none"],
          type: "string"
        },
        members_can_create_internal_repositories: {
          type: "boolean"
        },
        members_can_create_private_repositories: {
          type: "boolean"
        },
        members_can_create_public_repositories: {
          type: "boolean"
        },
        members_can_create_repositories: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    updateMembership: {
      method: "PATCH",
      params: {
        org: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["active"],
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    }
  },
  projects: {
    addCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    createCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        content_id: {
          type: "integer"
        },
        content_type: {
          type: "string"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    createColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        name: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    createForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/projects"
    },
    createForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    createForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    deleteCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    deleteColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    get: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    getCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    getColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    listCards: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        archived_state: {
          enum: ["all", "archived", "not_archived"],
          type: "string"
        },
        column_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    listCollaborators: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/collaborators"
    },
    listColumns: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    listForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    listForUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/projects"
    },
    moveCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        card_id: {
          required: true,
          type: "integer"
        },
        column_id: {
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(top|bottom|after:\\d+)$"
        }
      },
      url: "/projects/columns/cards/:card_id/moves"
    },
    moveColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(first|last|after:\\d+)$"
        }
      },
      url: "/projects/columns/:column_id/moves"
    },
    removeCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    reviewUserPermissionLevel: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username/permission"
    },
    update: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        name: {
          type: "string"
        },
        organization_permission: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        }
      },
      url: "/projects/:project_id"
    },
    updateCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        archived: {
          type: "boolean"
        },
        card_id: {
          required: true,
          type: "integer"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    updateColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/columns/:column_id"
    }
  },
  pulls: {
    checkIfMerged: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    create: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createCommentReply: {
      deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createFromIssue: {
      deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        issue: {
          required: true,
          type: "integer"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        comments: {
          type: "object[]"
        },
        "comments[].body": {
          required: true,
          type: "string"
        },
        "comments[].path": {
          required: true,
          type: "string"
        },
        "comments[].position": {
          required: true,
          type: "integer"
        },
        commit_id: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    createReviewCommentReply: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
    },
    createReviewRequest: {
      method: "POST",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    deletePendingReview: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    deleteReviewRequest: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    dismissReview: {
      method: "PUT",
      params: {
        message: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
    },
    get: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    getCommentsForReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
    },
    getReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    list: {
      method: "GET",
      params: {
        base: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        head: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "popularity", "long-running"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    listComments: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/commits"
    },
    listFiles: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/files"
    },
    listReviewRequests: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    listReviews: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    merge: {
      method: "PUT",
      params: {
        commit_message: {
          type: "string"
        },
        commit_title: {
          type: "string"
        },
        merge_method: {
          enum: ["merge", "squash", "rebase"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    submitReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
    },
    update: {
      method: "PATCH",
      params: {
        base: {
          type: "string"
        },
        body: {
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    updateBranch: {
      headers: {
        accept: "application/vnd.github.lydian-preview+json"
      },
      method: "PUT",
      params: {
        expected_head_sha: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    updateReview: {
      method: "PUT",
      params: {
        body: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    }
  },
  rateLimit: {
    get: {
      method: "GET",
      params: {},
      url: "/rate_limit"
    }
  },
  reactions: {
    createForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    createForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    createForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    createForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    createForTeamDiscussion: {
      deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionComment: {
      deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "DELETE",
      params: {
        reaction_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/reactions/:reaction_id"
    },
    listForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    listForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    listForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    listForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    listForTeamDiscussion: {
      deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionComment: {
      deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    }
  },
  repos: {
    acceptInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    addCollaborator: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    addDeployKey: {
      method: "POST",
      params: {
        key: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        read_only: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    addProtectedBranchAdminEnforcement: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    addProtectedBranchAppRestrictions: {
      method: "POST",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    addProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    addProtectedBranchRequiredStatusChecksContexts: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    addProtectedBranchTeamRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    addProtectedBranchUserRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    checkCollaborator: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    checkVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    compareCommits: {
      method: "GET",
      params: {
        base: {
          required: true,
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/compare/:base...:head"
    },
    createCommitComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_sha: {
          required: true,
          type: "string"
        },
        line: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          type: "string"
        },
        position: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    createDeployment: {
      method: "POST",
      params: {
        auto_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        payload: {
          type: "string"
        },
        production_environment: {
          type: "boolean"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_contexts: {
          type: "string[]"
        },
        task: {
          type: "string"
        },
        transient_environment: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    createDeploymentStatus: {
      method: "POST",
      params: {
        auto_inactive: {
          type: "boolean"
        },
        deployment_id: {
          required: true,
          type: "integer"
        },
        description: {
          type: "string"
        },
        environment: {
          enum: ["production", "staging", "qa"],
          type: "string"
        },
        environment_url: {
          type: "string"
        },
        log_url: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    createDispatchEvent: {
      method: "POST",
      params: {
        client_payload: {
          type: "object"
        },
        event_type: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/dispatches"
    },
    createFile: {
      deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createForAuthenticatedUser: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    createFork: {
      method: "POST",
      params: {
        organization: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    createInOrg: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    createOrUpdateFile: {
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createRelease: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          required: true,
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    createStatus: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        description: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/statuses/:sha"
    },
    createUsingTemplate: {
      headers: {
        accept: "application/vnd.github.baptiste-preview+json"
      },
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        template_owner: {
          required: true,
          type: "string"
        },
        template_repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:template_owner/:template_repo/generate"
    },
    declineInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    delete: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    deleteCommitComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    deleteDownload: {
      method: "DELETE",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    deleteFile: {
      method: "DELETE",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    deleteInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    deleteRelease: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    deleteReleaseAsset: {
      method: "DELETE",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    disableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    disablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    disableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    enableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    enablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          type: "object"
        },
        "source.branch": {
          enum: ["master", "gh-pages"],
          type: "string"
        },
        "source.path": {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    enableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    get: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    getAppsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    getArchiveLink: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/:archive_format/:ref"
    },
    getBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch"
    },
    getBranchProtection: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    getClones: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/clones"
    },
    getCodeFrequencyStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/code_frequency"
    },
    getCollaboratorPermissionLevel: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username/permission"
    },
    getCombinedStatusForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/status"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getCommitActivityStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/commit_activity"
    },
    getCommitComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    getCommitRefSha: {
      deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
      headers: {
        accept: "application/vnd.github.v3.sha"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getContents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    getContributorsStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/contributors"
    },
    getDeployKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    getDeployment: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id"
    },
    getDeploymentStatus: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
    },
    getDownload: {
      method: "GET",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    getLatestPagesBuild: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/latest"
    },
    getLatestRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/latest"
    },
    getPages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    getPagesBuild: {
      method: "GET",
      params: {
        build_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/:build_id"
    },
    getParticipationStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/participation"
    },
    getProtectedBranchAdminEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    getProtectedBranchPullRequestReviewEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    getProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    getProtectedBranchRequiredStatusChecks: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    getProtectedBranchRestrictions: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    getPunchCardStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/punch_card"
    },
    getReadme: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/readme"
    },
    getRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    getReleaseAsset: {
      method: "GET",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    getReleaseByTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/tags/:tag"
    },
    getTeamsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    getTopPaths: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/paths"
    },
    getTopReferrers: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/referrers"
    },
    getUsersWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    getViews: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/views"
    },
    list: {
      method: "GET",
      params: {
        affiliation: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "public", "private", "member"],
          type: "string"
        },
        visibility: {
          enum: ["all", "public", "private"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    listAppsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    listAssetsForRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id/assets"
    },
    listBranches: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        protected: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches"
    },
    listBranchesForHeadCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
    },
    listCollaborators: {
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators"
    },
    listCommentsForCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    listCommitComments: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        author: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        path: {
          type: "string"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        since: {
          type: "string"
        },
        until: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits"
    },
    listContributors: {
      method: "GET",
      params: {
        anon: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contributors"
    },
    listDeployKeys: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    listDeploymentStatuses: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    listDeployments: {
      method: "GET",
      params: {
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        task: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    listDownloads: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    listForUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/repos"
    },
    listForks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["newest", "oldest", "stargazers"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    listHooks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    listInvitations: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations"
    },
    listInvitationsForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/repository_invitations"
    },
    listLanguages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/languages"
    },
    listPagesBuilds: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    listProtectedBranchRequiredStatusChecksContexts: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    listProtectedBranchTeamRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listProtectedBranchUserRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/repositories"
    },
    listPullRequestsAssociatedWithCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
    },
    listReleases: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    listStatusesForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/statuses"
    },
    listTags: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/tags"
    },
    listTeams: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/teams"
    },
    listTeamsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    listUsersWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    merge: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        commit_message: {
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/merges"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/pings"
    },
    removeBranchProtection: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    removeCollaborator: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    removeDeployKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    removeProtectedBranchAdminEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    removeProtectedBranchAppRestrictions: {
      method: "DELETE",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    removeProtectedBranchPullRequestReviewEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    removeProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    removeProtectedBranchRequiredStatusChecks: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    removeProtectedBranchRequiredStatusChecksContexts: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    removeProtectedBranchRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    removeProtectedBranchTeamRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    removeProtectedBranchUserRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceProtectedBranchAppRestrictions: {
      method: "PUT",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    replaceProtectedBranchRequiredStatusChecksContexts: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    replaceProtectedBranchTeamRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    replaceProtectedBranchUserRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "PUT",
      params: {
        names: {
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    requestPageBuild: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    retrieveCommunityProfileMetrics: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/profile"
    },
    testPushHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/tests"
    },
    transfer: {
      method: "POST",
      params: {
        new_owner: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/repos/:owner/:repo/transfer"
    },
    update: {
      method: "PATCH",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        archived: {
          type: "boolean"
        },
        default_branch: {
          type: "string"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    updateBranchProtection: {
      method: "PUT",
      params: {
        allow_deletions: {
          type: "boolean"
        },
        allow_force_pushes: {
          allowNull: true,
          type: "boolean"
        },
        branch: {
          required: true,
          type: "string"
        },
        enforce_admins: {
          allowNull: true,
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_linear_history: {
          type: "boolean"
        },
        required_pull_request_reviews: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_pull_request_reviews.dismiss_stale_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.dismissal_restrictions": {
          type: "object"
        },
        "required_pull_request_reviews.dismissal_restrictions.teams": {
          type: "string[]"
        },
        "required_pull_request_reviews.dismissal_restrictions.users": {
          type: "string[]"
        },
        "required_pull_request_reviews.require_code_owner_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.required_approving_review_count": {
          type: "integer"
        },
        required_status_checks: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_status_checks.contexts": {
          required: true,
          type: "string[]"
        },
        "required_status_checks.strict": {
          required: true,
          type: "boolean"
        },
        restrictions: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "restrictions.apps": {
          type: "string[]"
        },
        "restrictions.teams": {
          required: true,
          type: "string[]"
        },
        "restrictions.users": {
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    updateCommitComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    updateFile: {
      deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        add_events: {
          type: "string[]"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        remove_events: {
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    updateInformationAboutPagesSite: {
      method: "PUT",
      params: {
        cname: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          enum: ['"gh-pages"', '"master"', '"master /docs"'],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    updateInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        permissions: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    updateProtectedBranchPullRequestReviewEnforcement: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        dismiss_stale_reviews: {
          type: "boolean"
        },
        dismissal_restrictions: {
          type: "object"
        },
        "dismissal_restrictions.teams": {
          type: "string[]"
        },
        "dismissal_restrictions.users": {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        require_code_owner_reviews: {
          type: "boolean"
        },
        required_approving_review_count: {
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    updateProtectedBranchRequiredStatusChecks: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        strict: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    updateRelease: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    updateReleaseAsset: {
      method: "PATCH",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        label: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    uploadReleaseAsset: {
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string | object"
        },
        file: {
          alias: "data",
          deprecated: true,
          type: "string | object"
        },
        headers: {
          required: true,
          type: "object"
        },
        "headers.content-length": {
          required: true,
          type: "integer"
        },
        "headers.content-type": {
          required: true,
          type: "string"
        },
        label: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        url: {
          required: true,
          type: "string"
        }
      },
      url: ":url"
    }
  },
  search: {
    code: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["indexed"],
          type: "string"
        }
      },
      url: "/search/code"
    },
    commits: {
      headers: {
        accept: "application/vnd.github.cloak-preview+json"
      },
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["author-date", "committer-date"],
          type: "string"
        }
      },
      url: "/search/commits"
    },
    issues: {
      deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    issuesAndPullRequests: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    labels: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        q: {
          required: true,
          type: "string"
        },
        repository_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/search/labels"
    },
    repos: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          type: "string"
        }
      },
      url: "/search/repositories"
    },
    topics: {
      method: "GET",
      params: {
        q: {
          required: true,
          type: "string"
        }
      },
      url: "/search/topics"
    },
    users: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["followers", "repositories", "joined"],
          type: "string"
        }
      },
      url: "/search/users"
    }
  },
  teams: {
    addMember: {
      deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addMemberLegacy: {
      deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addOrUpdateMembership: {
      deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateMembershipInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    addOrUpdateMembershipLegacy: {
      deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateProject: {
      deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    addOrUpdateProjectLegacy: {
      deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateRepo: {
      deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    addOrUpdateRepoInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    addOrUpdateRepoLegacy: {
      deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepo: {
      deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepoInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    checkManagesRepoLegacy: {
      deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        maintainers: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        repo_names: {
          type: "string[]"
        }
      },
      url: "/orgs/:org/teams"
    },
    createDiscussion: {
      deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    createDiscussionComment: {
      deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionCommentInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    createDiscussionCommentLegacy: {
      deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    createDiscussionLegacy: {
      deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    delete: {
      deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    deleteDiscussion: {
      deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteDiscussionComment: {
      deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentInOrg: {
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentLegacy: {
      deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionInOrg: {
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    deleteDiscussionLegacy: {
      deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    deleteLegacy: {
      deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    get: {
      deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getByName: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    getDiscussion: {
      deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getDiscussionComment: {
      deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentInOrg: {
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentLegacy: {
      deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionInOrg: {
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    getDiscussionLegacy: {
      deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getLegacy: {
      deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getMember: {
      deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMemberLegacy: {
      deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMembership: {
      deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    getMembershipInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    getMembershipLegacy: {
      deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    list: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/teams"
    },
    listChild: {
      deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listChildInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/teams"
    },
    listChildLegacy: {
      deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listDiscussionComments: {
      deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsLegacy: {
      deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussions: {
      deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listDiscussionsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    listDiscussionsLegacy: {
      deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/teams"
    },
    listMembers: {
      deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listMembersInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/members"
    },
    listMembersLegacy: {
      deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listPendingInvitations: {
      deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listPendingInvitationsInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/invitations"
    },
    listPendingInvitationsLegacy: {
      deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listProjects: {
      deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listProjectsInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects"
    },
    listProjectsLegacy: {
      deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listRepos: {
      deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    listReposInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos"
    },
    listReposLegacy: {
      deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    removeMember: {
      deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMemberLegacy: {
      deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMembership: {
      deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeMembershipInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    removeMembershipLegacy: {
      deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeProject: {
      deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeProjectInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    removeProjectLegacy: {
      deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeRepo: {
      deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    removeRepoInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    removeRepoLegacy: {
      deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    reviewProject: {
      deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    reviewProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    reviewProjectLegacy: {
      deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    update: {
      deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    updateDiscussion: {
      deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateDiscussionComment: {
      deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentInOrg: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentLegacy: {
      deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionInOrg: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    updateDiscussionLegacy: {
      deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateInOrg: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    updateLegacy: {
      deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    }
  },
  users: {
    addEmails: {
      method: "POST",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    block: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkBlocked: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkFollowing: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    checkFollowingForUser: {
      method: "GET",
      params: {
        target_user: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following/:target_user"
    },
    createGpgKey: {
      method: "POST",
      params: {
        armored_public_key: {
          type: "string"
        }
      },
      url: "/user/gpg_keys"
    },
    createPublicKey: {
      method: "POST",
      params: {
        key: {
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/user/keys"
    },
    deleteEmails: {
      method: "DELETE",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    deleteGpgKey: {
      method: "DELETE",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    deletePublicKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    follow: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    getAuthenticated: {
      method: "GET",
      params: {},
      url: "/user"
    },
    getByUsername: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username"
    },
    getContextForUser: {
      method: "GET",
      params: {
        subject_id: {
          type: "string"
        },
        subject_type: {
          enum: ["organization", "repository", "issue", "pull_request"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/hovercard"
    },
    getGpgKey: {
      method: "GET",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/users"
    },
    listBlocked: {
      method: "GET",
      params: {},
      url: "/user/blocks"
    },
    listEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/emails"
    },
    listFollowersForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/followers"
    },
    listFollowersForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/followers"
    },
    listFollowingForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/following"
    },
    listFollowingForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following"
    },
    listGpgKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/gpg_keys"
    },
    listGpgKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gpg_keys"
    },
    listPublicEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/public_emails"
    },
    listPublicKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/keys"
    },
    listPublicKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/keys"
    },
    togglePrimaryEmailVisibility: {
      method: "PATCH",
      params: {
        email: {
          required: true,
          type: "string"
        },
        visibility: {
          required: true,
          type: "string"
        }
      },
      url: "/user/email/visibility"
    },
    unblock: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    unfollow: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    updateAuthenticated: {
      method: "PATCH",
      params: {
        bio: {
          type: "string"
        },
        blog: {
          type: "string"
        },
        company: {
          type: "string"
        },
        email: {
          type: "string"
        },
        hireable: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        name: {
          type: "string"
        }
      },
      url: "/user"
    }
  }
};

const VERSION = "2.4.0";

function registerEndpoints(octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {};
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName];
      const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
        if (typeof apiOptions[key] !== "undefined") {
          map[key] = apiOptions[key];
        }

        return map;
      }, {});
      endpointDefaults.request = {
        validate: apiOptions.params
      };
      let request = octokit.request.defaults(endpointDefaults); // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope

      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);

      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions);
        request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
        request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
        request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
          octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
          octokit[namespaceName][apiName] = request;
          return request.apply(null, arguments);
        }, request);
        return;
      }

      octokit[namespaceName][apiName] = request;
    });
  });
}

function patchForDeprecation(octokit, apiOptions, method, methodName) {
  const patchedMethod = options => {
    options = Object.assign({}, options);
    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias;
        octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key];
        }

        delete options[key];
      }
    });
    return method(options);
  };

  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key];
  });
  return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  // @ts-ignore
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
  registerEndpoints(octokit, endpointsByScope); // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134

  [["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
    Object.defineProperty(octokit, deprecatedScope, {
      get() {
        octokit.log.warn( // @ts-ignore
        new deprecation.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`)); // @ts-ignore

        return octokit[scope];
      }

    });
  });
  return {};
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin;

const { paginateRest } = __webpack_require__(675);

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest(octokit));
}


/***/ }),
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */
/***/ (function(module) {

module.exports = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}


/***/ }),
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Range = __webpack_require__(262)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('cat', _cat, {
  canReceivePipe: true,
});

//@
//@ ### cat(file [, file ...])
//@ ### cat(file_array)
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = cat('file*.txt');
//@ var str = cat('file1', 'file2');
//@ var str = cat(['file1', 'file2']); // same as above
//@ ```
//@
//@ Returns a string containing the given file, or a concatenated string
//@ containing the files if more than one file is given (a new line character is
//@ introduced between each file).
function _cat(options, files) {
  var cat = common.readFromPipe();

  if (!files && !cat) common.error('no paths given');

  files = [].slice.call(arguments, 1);

  files.forEach(function (file) {
    if (!fs.existsSync(file)) {
      common.error('no such file or directory: ' + file);
    }

    cat += fs.readFileSync(file, 'utf8');
  });

  return cat;
}
module.exports = _cat;


/***/ }),
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(763);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
// Ignore warning about 'new String()'
/* eslint no-new-wrappers: 0 */


var os = __webpack_require__(87);
var fs = __webpack_require__(747);
var glob = __webpack_require__(569);
var shell = __webpack_require__(899);

var shellMethods = Object.create(shell);

// objectAssign(target_obj, source_obj1 [, source_obj2 ...])
// "Ponyfill" for Object.assign
//    objectAssign({A:1}, {b:2}, {c:3}) returns {A:1, b:2, c:3}
var objectAssign = typeof Object.assign === 'function' ?
  Object.assign :
  function objectAssign(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
      Object.keys(source).forEach(function (key) {
        target[key] = source[key];
      });
    });

    return target;
  };
exports.extend = objectAssign;

// Check if we're running under electron
var isElectron = Boolean(process.versions.electron);

// Module globals (assume no execPath by default)
var DEFAULT_CONFIG = {
  fatal: false,
  globOptions: {},
  maxdepth: 255,
  noglob: false,
  silent: false,
  verbose: false,
  execPath: null,
};

var config = {
  reset: function () {
    objectAssign(this, DEFAULT_CONFIG);
    if (!isElectron) {
      this.execPath = process.execPath;
    }
  },
  resetForTesting: function () {
    this.reset();
    this.silent = true;
  },
};

config.reset();
exports.config = config;

var state = {
  error: null,
  errorCode: 0,
  currentCmd: 'shell.js',
  tempDir: null,
};
exports.state = state;

delete process.env.OLDPWD; // initially, there's no previous directory

var platform = os.type().match(/^Win/) ? 'win' : 'unix';
exports.platform = platform;

// This is populated by calls to commonl.wrap()
var pipeMethods = [];

// Reliably test if something is any sort of javascript object
function isObject(a) {
  return typeof a === 'object' && a !== null;
}
exports.isObject = isObject;

function log() {
  /* istanbul ignore next */
  if (!config.silent) {
    console.error.apply(console, arguments);
  }
}
exports.log = log;

// Converts strings to be equivalent across all platforms. Primarily responsible
// for making sure we use '/' instead of '\' as path separators, but this may be
// expanded in the future if necessary
function convertErrorOutput(msg) {
  if (typeof msg !== 'string') {
    throw new TypeError('input must be a string');
  }
  return msg.replace(/\\/g, '/');
}
exports.convertErrorOutput = convertErrorOutput;

// Shows error message. Throws if config.fatal is true
function error(msg, _code, options) {
  // Validate input
  if (typeof msg !== 'string') throw new Error('msg must be a string');

  var DEFAULT_OPTIONS = {
    continue: false,
    code: 1,
    prefix: state.currentCmd + ': ',
    silent: false,
  };

  if (typeof _code === 'number' && isObject(options)) {
    options.code = _code;
  } else if (isObject(_code)) { // no 'code'
    options = _code;
  } else if (typeof _code === 'number') { // no 'options'
    options = { code: _code };
  } else if (typeof _code !== 'number') { // only 'msg'
    options = {};
  }
  options = objectAssign({}, DEFAULT_OPTIONS, options);

  if (!state.errorCode) state.errorCode = options.code;

  var logEntry = convertErrorOutput(options.prefix + msg);
  state.error = state.error ? state.error + '\n' : '';
  state.error += logEntry;

  // Throw an error, or log the entry
  if (config.fatal) throw new Error(logEntry);
  if (msg.length > 0 && !options.silent) log(logEntry);

  if (!options.continue) {
    throw {
      msg: 'earlyExit',
      retValue: (new ShellString('', state.error, state.errorCode)),
    };
  }
}
exports.error = error;

//@
//@ ### ShellString(str)
//@
//@ Examples:
//@
//@ ```javascript
//@ var foo = ShellString('hello world');
//@ ```
//@
//@ Turns a regular string into a string-like object similar to what each
//@ command returns. This has special methods, like `.to()` and `.toEnd()`
function ShellString(stdout, stderr, code) {
  var that;
  if (stdout instanceof Array) {
    that = stdout;
    that.stdout = stdout.join('\n');
    if (stdout.length > 0) that.stdout += '\n';
  } else {
    that = new String(stdout);
    that.stdout = stdout;
  }
  that.stderr = stderr;
  that.code = code;
  // A list of all commands that can appear on the right-hand side of a pipe
  // (populated by calls to common.wrap())
  pipeMethods.forEach(function (cmd) {
    that[cmd] = shellMethods[cmd].bind(that);
  });
  return that;
}

exports.ShellString = ShellString;

// Return the home directory in a platform-agnostic way, with consideration for
// older versions of node
function getUserHome() {
  var result;
  if (os.homedir) {
    result = os.homedir(); // node 3+
  } else {
    result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  }
  return result;
}
exports.getUserHome = getUserHome;

// Returns {'alice': true, 'bob': false} when passed a string and dictionary as follows:
//   parseOptions('-a', {'a':'alice', 'b':'bob'});
// Returns {'reference': 'string-value', 'bob': false} when passed two dictionaries of the form:
//   parseOptions({'-r': 'string-value'}, {'r':'reference', 'b':'bob'});
function parseOptions(opt, map, errorOptions) {
  // Validate input
  if (typeof opt !== 'string' && !isObject(opt)) {
    throw new Error('options must be strings or key-value pairs');
  } else if (!isObject(map)) {
    throw new Error('parseOptions() internal error: map must be an object');
  } else if (errorOptions && !isObject(errorOptions)) {
    throw new Error('parseOptions() internal error: errorOptions must be object');
  }

  // All options are false by default
  var options = {};
  Object.keys(map).forEach(function (letter) {
    var optName = map[letter];
    if (optName[0] !== '!') {
      options[optName] = false;
    }
  });

  if (opt === '') return options; // defaults

  if (typeof opt === 'string') {
    if (opt[0] !== '-') {
      error("Options string must start with a '-'", errorOptions || {});
    }

    // e.g. chars = ['R', 'f']
    var chars = opt.slice(1).split('');

    chars.forEach(function (c) {
      if (c in map) {
        var optionName = map[c];
        if (optionName[0] === '!') {
          options[optionName.slice(1)] = false;
        } else {
          options[optionName] = true;
        }
      } else {
        error('option not recognized: ' + c, errorOptions || {});
      }
    });
  } else { // opt is an Object
    Object.keys(opt).forEach(function (key) {
      // key is a string of the form '-r', '-d', etc.
      var c = key[1];
      if (c in map) {
        var optionName = map[c];
        options[optionName] = opt[key]; // assign the given value
      } else {
        error('option not recognized: ' + c, errorOptions || {});
      }
    });
  }
  return options;
}
exports.parseOptions = parseOptions;

// Expands wildcards with matching (ie. existing) file names.
// For example:
//   expand(['file*.js']) = ['file1.js', 'file2.js', ...]
//   (if the files 'file1.js', 'file2.js', etc, exist in the current dir)
function expand(list) {
  if (!Array.isArray(list)) {
    throw new TypeError('must be an array');
  }
  var expanded = [];
  list.forEach(function (listEl) {
    // Don't expand non-strings
    if (typeof listEl !== 'string') {
      expanded.push(listEl);
    } else {
      var ret = glob.sync(listEl, config.globOptions);
      // if glob fails, interpret the string literally
      expanded = expanded.concat(ret.length > 0 ? ret : [listEl]);
    }
  });
  return expanded;
}
exports.expand = expand;

// Normalizes _unlinkSync() across platforms to match Unix behavior, i.e.
// file can be unlinked even if it's read-only, see https://github.com/joyent/node/issues/3006
function unlinkSync(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // Try to override file permission
    /* istanbul ignore next */
    if (e.code === 'EPERM') {
      fs.chmodSync(file, '0666');
      fs.unlinkSync(file);
    } else {
      throw e;
    }
  }
}
exports.unlinkSync = unlinkSync;

// e.g. 'shelljs_a5f185d0443ca...'
function randomFileName() {
  function randomHash(count) {
    if (count === 1) {
      return parseInt(16 * Math.random(), 10).toString(16);
    }
    var hash = '';
    for (var i = 0; i < count; i++) {
      hash += randomHash(1);
    }
    return hash;
  }

  return 'shelljs_' + randomHash(20);
}
exports.randomFileName = randomFileName;

// Common wrapper for all Unix-like commands that performs glob expansion,
// command-logging, and other nice things
function wrap(cmd, fn, options) {
  options = options || {};
  if (options.canReceivePipe) {
    pipeMethods.push(cmd);
  }
  return function () {
    var retValue = null;

    state.currentCmd = cmd;
    state.error = null;
    state.errorCode = 0;

    try {
      var args = [].slice.call(arguments, 0);

      // Log the command to stderr, if appropriate
      if (config.verbose) {
        console.error.apply(console, [cmd].concat(args));
      }

      // If this is coming from a pipe, let's set the pipedValue (otherwise, set
      // it to the empty string)
      state.pipedValue = (this && typeof this.stdout === 'string') ? this.stdout : '';

      if (options.unix === false) { // this branch is for exec()
        retValue = fn.apply(this, args);
      } else { // and this branch is for everything else
        if (isObject(args[0]) && args[0].constructor.name === 'Object') {
          // a no-op, allowing the syntax `touch({'-r': file}, ...)`
        } else if (args.length === 0 || typeof args[0] !== 'string' || args[0].length <= 1 || args[0][0] !== '-') {
          args.unshift(''); // only add dummy option if '-option' not already present
        }

        // flatten out arrays that are arguments, to make the syntax:
        //    `cp([file1, file2, file3], dest);`
        // equivalent to:
        //    `cp(file1, file2, file3, dest);`
        args = args.reduce(function (accum, cur) {
          if (Array.isArray(cur)) {
            return accum.concat(cur);
          }
          accum.push(cur);
          return accum;
        }, []);

        // Convert ShellStrings (basically just String objects) to regular strings
        args = args.map(function (arg) {
          if (isObject(arg) && arg.constructor.name === 'String') {
            return arg.toString();
          }
          return arg;
        });

        // Expand the '~' if appropriate
        var homeDir = getUserHome();
        args = args.map(function (arg) {
          if (typeof arg === 'string' && arg.slice(0, 2) === '~/' || arg === '~') {
            return arg.replace(/^~/, homeDir);
          }
          return arg;
        });

        // Perform glob-expansion on all arguments after globStart, but preserve
        // the arguments before it (like regexes for sed and grep)
        if (!config.noglob && options.allowGlobbing === true) {
          args = args.slice(0, options.globStart).concat(expand(args.slice(options.globStart)));
        }

        try {
          // parse options if options are provided
          if (isObject(options.cmdOptions)) {
            args[0] = parseOptions(args[0], options.cmdOptions);
          }

          retValue = fn.apply(this, args);
        } catch (e) {
          /* istanbul ignore else */
          if (e.msg === 'earlyExit') {
            retValue = e.retValue;
          } else {
            throw e; // this is probably a bug that should be thrown up the call stack
          }
        }
      }
    } catch (e) {
      /* istanbul ignore next */
      if (!state.error) {
        // If state.error hasn't been set it's an error thrown by Node, not us - probably a bug...
        console.error('ShellJS: internal error');
        console.error(e.stack || e);
        process.exit(1);
      }
      if (config.fatal) throw e;
    }

    if (options.wrapOutput &&
        (typeof retValue === 'string' || Array.isArray(retValue))) {
      retValue = new ShellString(retValue, state.error, state.errorCode);
    }

    state.currentCmd = 'shell.js';
    return retValue;
  };
} // wrap
exports.wrap = wrap;

// This returns all the input that is piped into the current command (or the
// empty string, if this isn't on the right-hand side of a pipe
function _readFromPipe() {
  return state.pipedValue;
}
exports.readFromPipe = _readFromPipe;

var DEFAULT_WRAP_OPTIONS = {
  allowGlobbing: true,
  canReceivePipe: false,
  cmdOptions: false,
  globStart: 1,
  pipeOnly: false,
  unix: true,
  wrapOutput: true,
  overWrite: false,
};

// Register a new ShellJS command
function _register(name, implementation, wrapOptions) {
  wrapOptions = wrapOptions || {};
  // If an option isn't specified, use the default
  wrapOptions = objectAssign({}, DEFAULT_WRAP_OPTIONS, wrapOptions);

  if (shell[name] && !wrapOptions.overWrite) {
    throw new Error('unable to overwrite `' + name + '` command');
  }

  if (wrapOptions.pipeOnly) {
    wrapOptions.canReceivePipe = true;
    shellMethods[name] = wrap(name, implementation, wrapOptions);
  } else {
    shell[name] = wrap(name, implementation, wrapOptions);
  }
}
exports.register = _register;


/***/ }),
/* 321 */,
/* 322 */,
/* 323 */
/***/ (function(module, __unusedexports, __webpack_require__) {

try {
  var util = __webpack_require__(669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(92);
}


/***/ }),
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('toEnd', _toEnd, {
  pipeOnly: true,
  wrapOutput: false,
});

//@
//@ ### ShellString.prototype.toEnd(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').toEnd('output.txt');
//@ ```
//@
//@ Analogous to the redirect-and-append operator `>>` in Unix, but works with
//@ ShellStrings (such as those returned by `cat`, `grep`, etc).
function _toEnd(options, file) {
  if (!file) common.error('wrong arguments');

  if (!fs.existsSync(path.dirname(file))) {
    common.error('no such file or directory: ' + path.dirname(file));
  }

  try {
    fs.appendFileSync(file, this.stdout || this.toString(), 'utf8');
    return this;
  } catch (e) {
    /* istanbul ignore next */
    common.error('could not append to file (code ' + e.code + '): ' + file, { continue: true });
  }
}
module.exports = _toEnd;


/***/ }),
/* 330 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var path = __webpack_require__(622);
var common = __webpack_require__(320);

common.register('pwd', _pwd, {
  allowGlobbing: false,
});

//@
//@ ### pwd()
//@ Returns the current directory.
function _pwd() {
  var pwd = path.resolve(process.cwd());
  return pwd;
}
module.exports = _pwd;


/***/ }),
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix;

const atob = __webpack_require__(691);

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}


/***/ }),
/* 347 */
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 357 */
/***/ (function(module) {

module.exports = require("assert");

/***/ }),
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const parse = __webpack_require__(8)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(626));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);

common.register('echo', _echo, {
  allowGlobbing: false,
});

//@
//@ ### echo([options,] string [, string ...])
//@ Available options:
//@
//@ + `-e`: interpret backslash escapes (default)
//@
//@ Examples:
//@
//@ ```javascript
//@ echo('hello world');
//@ var str = echo('hello world');
//@ ```
//@
//@ Prints string to stdout, and returns string with additional utility methods
//@ like `.to()`.
function _echo(opts, messages) {
  // allow strings starting with '-', see issue #20
  messages = [].slice.call(arguments, opts ? 0 : 1);

  if (messages[0] === '-e') {
    // ignore -e
    messages.shift();
  }

  console.log.apply(console, messages);
  return messages.join(' ');
}
module.exports = _echo;


/***/ }),
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const Range = __webpack_require__(262)
const gt = __webpack_require__(872)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),
/* 380 */,
/* 381 */
/***/ (function(module) {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

module.exports = {
  SEMVER_SPEC_VERSION,
  MAX_LENGTH,
  MAX_SAFE_INTEGER,
  MAX_SAFE_COMPONENT_LENGTH
}


/***/ }),
/* 382 */,
/* 383 */,
/* 384 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(166);
var once = _interopDefault(__webpack_require__(180));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(528)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),
/* 398 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),
/* 399 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(417);
const rest_1 = __webpack_require__(730);
const Context = __importStar(__webpack_require__(752));
const httpClient = __importStar(__webpack_require__(603));
// We need this in order to extend Octokit
rest_1.Octokit.prototype = new rest_1.Octokit();
exports.context = new Context.Context();
class GitHub extends rest_1.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            defaults.request = { agent };
        }
        return graphql_1.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            const serverUrl = 'https://api.github.com';
            if (httpClient.getProxyUrl(serverUrl)) {
                const hc = new httpClient.HttpClient();
                return hc.getAgent(serverUrl);
            }
        }
        return undefined;
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */
/***/ (function(module) {

module.exports = require("stream");

/***/ }),
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(241);
var universalUserAgent = __webpack_require__(421);

const VERSION = "4.3.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(626));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Range = __webpack_require__(262)
const { ANY } = __webpack_require__(771)
const satisfies = __webpack_require__(295)
const compare = __webpack_require__(798)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a subset of some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else return false
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
// - If LT
//   - If LT.semver is greater than that of any > comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
// - If any C is a = range, and GT or LT are set, return false
// - Else return true

const subset = (sub, dom, options) => {
  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub)
        continue OUTER
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull)
      return false
  }
  return true
}

const simpleSubset = (sub, dom, options) => {
  if (sub.length === 1 && sub[0].semver === ANY)
    return dom.length === 1 && dom[0].semver === ANY

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=')
      gt = higherGT(gt, c, options)
    else if (c.operator === '<' || c.operator === '<=')
      lt = lowerLT(lt, c, options)
    else
      eqSet.add(c.semver)
  }

  if (eqSet.size > 1)
    return null

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0)
      return null
    else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<='))
      return null
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options))
      return null

    if (lt && !satisfies(eq, String(lt), options))
      return null

    for (const c of dom) {
      if (!satisfies(eq, String(c), options))
        return false
    }
    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c)
          return false
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options))
        return false
    }
    if (lt) {
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c)
          return false
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options))
        return false
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0)
      return false
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0)
    return false

  if (lt && hasDomGT && !gt && gtltComp !== 0)
    return false

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a)
    return b
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),
/* 459 */,
/* 460 */,
/* 461 */
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const parse = __webpack_require__(8)
const eq = __webpack_require__(490)

const diff = (version1, version2) => {
  if (eq(version1, version2)) {
    return null
  } else {
    const v1 = parse(version1)
    const v2 = parse(version2)
    const hasPre = v1.prerelease.length || v2.prerelease.length
    const prefix = hasPre ? 'pre' : ''
    const defaultResult = hasPre ? 'prerelease' : ''
    for (const key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}
module.exports = diff


/***/ }),
/* 470 */,
/* 471 */
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),
/* 472 */,
/* 473 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(197);

function authenticationRequestError(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}


/***/ }),
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */
/***/ (function(module) {

"use strict";


module.exports = clone

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),
/* 481 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('to', _to, {
  pipeOnly: true,
  wrapOutput: false,
});

//@
//@ ### ShellString.prototype.to(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').to('output.txt');
//@ ```
//@
//@ Analogous to the redirection operator `>` in Unix, but works with
//@ ShellStrings (such as those returned by `cat`, `grep`, etc). _Like Unix
//@ redirections, `to()` will overwrite any existing file!_
function _to(options, file) {
  if (!file) common.error('wrong arguments');

  if (!fs.existsSync(path.dirname(file))) {
    common.error('no such file or directory: ' + path.dirname(file));
  }

  try {
    fs.writeFileSync(file, this.stdout || this.toString(), 'utf8');
    return this;
  } catch (e) {
    /* istanbul ignore next */
    common.error('could not write to file (code ' + e.code + '): ' + file, { continue: true });
  }
}
module.exports = _to;


/***/ }),
/* 482 */,
/* 483 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)

const inc = (version, release, options, identifier) => {
  if (typeof (options) === 'string') {
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(version, options).inc(release, identifier).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(461);

const withAuthorizationPrefix = __webpack_require__(346);

function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix(authorization);
    });
}


/***/ }),
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const debug = __webpack_require__(85)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(381)
const { re, t } = __webpack_require__(616)

const { compareIdentifiers } = __webpack_require__(813)
class SemVer {
  constructor (version, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }
    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier)
        this.inc('pre', identifier)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier)
        }
        this.inc('pre', identifier)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre':
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break

      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.format()
    this.raw = this.version
    return this
  }
}

module.exports = SemVer


/***/ }),
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(202)
const getPageLinks = __webpack_require__(816)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('sort', _sort, {
  canReceivePipe: true,
  cmdOptions: {
    'r': 'reverse',
    'n': 'numerical',
  },
});

// parse out the number prefix of a line
function parseNumber(str) {
  var match = str.match(/^\s*(\d*)\s*(.*)$/);
  return { num: Number(match[1]), value: match[2] };
}

// compare two strings case-insensitively, but examine case for strings that are
// case-insensitive equivalent
function unixCmp(a, b) {
  var aLower = a.toLowerCase();
  var bLower = b.toLowerCase();
  return (aLower === bLower ?
      -1 * a.localeCompare(b) : // unix sort treats case opposite how javascript does
      aLower.localeCompare(bLower));
}

// compare two strings in the fashion that unix sort's -n option works
function numericalCmp(a, b) {
  var objA = parseNumber(a);
  var objB = parseNumber(b);
  if (objA.hasOwnProperty('num') && objB.hasOwnProperty('num')) {
    return ((objA.num !== objB.num) ?
        (objA.num - objB.num) :
        unixCmp(objA.value, objB.value));
  } else {
    return unixCmp(objA.value, objB.value);
  }
}

//@
//@ ### sort([options,] file [, file ...])
//@ ### sort([options,] file_array)
//@ Available options:
//@
//@ + `-r`: Reverse the result of comparisons
//@ + `-n`: Compare according to numerical value
//@
//@ Examples:
//@
//@ ```javascript
//@ sort('foo.txt', 'bar.txt');
//@ sort('-r', 'foo.txt');
//@ ```
//@
//@ Return the contents of the files, sorted line-by-line. Sorting multiple
//@ files mixes their content, just like unix sort does.
function _sort(options, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no files given');

  files = [].slice.call(arguments, 1);

  if (pipe) {
    files.unshift('-');
  }

  var lines = [];
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      // exit upon any sort of error
      common.error('no such file or directory: ' + file);
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    lines = lines.concat(contents.trimRight().split(/\r*\n/));
  });

  var sorted;
  sorted = lines.sort(options.numerical ? numericalCmp : unixCmp);

  if (options.reverse) {
    sorted = sorted.reverse();
  }

  return sorted.join('\n') + '\n';
}

module.exports = _sort;


/***/ }),
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(202)
const getPageLinks = __webpack_require__(816)
const HttpError = __webpack_require__(93)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),
/* 529 */,
/* 530 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */,
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */,
/* 540 */,
/* 541 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),
/* 542 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __webpack_require__(616)
module.exports = {
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: __webpack_require__(381).SEMVER_SPEC_VERSION,
  SemVer: __webpack_require__(503),
  compareIdentifiers: __webpack_require__(813).compareIdentifiers,
  rcompareIdentifiers: __webpack_require__(813).rcompareIdentifiers,
  parse: __webpack_require__(8),
  valid: __webpack_require__(177),
  clean: __webpack_require__(362),
  inc: __webpack_require__(483),
  diff: __webpack_require__(469),
  major: __webpack_require__(1),
  minor: __webpack_require__(584),
  patch: __webpack_require__(36),
  prerelease: __webpack_require__(64),
  compare: __webpack_require__(798),
  rcompare: __webpack_require__(668),
  compareLoose: __webpack_require__(69),
  compareBuild: __webpack_require__(513),
  sort: __webpack_require__(560),
  rsort: __webpack_require__(610),
  gt: __webpack_require__(872),
  lt: __webpack_require__(265),
  eq: __webpack_require__(490),
  neq: __webpack_require__(720),
  gte: __webpack_require__(823),
  lte: __webpack_require__(74),
  cmp: __webpack_require__(18),
  coerce: __webpack_require__(553),
  Comparator: __webpack_require__(771),
  Range: __webpack_require__(262),
  satisfies: __webpack_require__(295),
  toComparators: __webpack_require__(203),
  maxSatisfying: __webpack_require__(654),
  minSatisfying: __webpack_require__(973),
  minVersion: __webpack_require__(379),
  validRange: __webpack_require__(875),
  outside: __webpack_require__(970),
  gtr: __webpack_require__(919),
  ltr: __webpack_require__(975),
  intersects: __webpack_require__(62),
  simplifyRange: __webpack_require__(559),
  subset: __webpack_require__(458),
}


/***/ }),
/* 543 */,
/* 544 */,
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate;

const validate = __webpack_require__(140);

function octokitValidate(octokit) {
  octokit.hook.before("request", validate.bind(null, octokit));
}


/***/ }),
/* 551 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('tail', _tail, {
  canReceivePipe: true,
  cmdOptions: {
    'n': 'numLines',
  },
});

//@
//@ ### tail([{'-n': \<num\>},] file [, file ...])
//@ ### tail([{'-n': \<num\>},] file_array)
//@ Available options:
//@
//@ + `-n <num>`: Show the last `<num>` lines of the files
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = tail({'-n': 1}, 'file*.txt');
//@ var str = tail('file1', 'file2');
//@ var str = tail(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the end of a file.
function _tail(options, files) {
  var tail = [];
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given');

  var idx = 1;
  if (options.numLines === true) {
    idx = 2;
    options.numLines = Number(arguments[1]);
  } else if (options.numLines === false) {
    options.numLines = 10;
  }
  options.numLines = -1 * Math.abs(options.numLines);
  files = [].slice.call(arguments, idx);

  if (pipe) {
    files.unshift('-');
  }

  var shouldAppendNewline = false;
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, { continue: true });
      return;
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');

    var lines = contents.split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
      shouldAppendNewline = true;
    } else {
      shouldAppendNewline = false;
    }

    tail = tail.concat(lines.slice(options.numLines));
  });

  if (shouldAppendNewline) {
    tail.push(''); // to add a trailing newline once we join
  }
  return tail.join('\n');
}
module.exports = _tail;


/***/ }),
/* 552 */,
/* 553 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const parse = __webpack_require__(8)
const {re, t} = __webpack_require__(616)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null)
    return null

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),
/* 554 */,
/* 555 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(631);
var tls = __webpack_require__(818);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),
/* 556 */,
/* 557 */,
/* 558 */,
/* 559 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __webpack_require__(295)
const compare = __webpack_require__(798)
module.exports = (versions, range, options) => {
  const set = []
  let min = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!min)
        min = version
    } else {
      if (prev) {
        set.push([min, prev])
      }
      prev = null
      min = null
    }
  }
  if (min)
    set.push([min, null])

  const ranges = []
  for (const [min, max] of set) {
    if (min === max)
      ranges.push(min)
    else if (!max && min === v[0])
      ranges.push('*')
    else if (!max)
      ranges.push(`>=${min}`)
    else if (min === v[0])
      ranges.push(`<=${max}`)
    else
      ranges.push(`${min} - ${max}`)
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),
/* 560 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compareBuild = __webpack_require__(513)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(234);
const bufferStream = __webpack_require__(193);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then(response => {
      octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
      return response;
    }).catch(error => {
      octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;

exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


/***/ }),
/* 569 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(747)
var rp = __webpack_require__(134)
var minimatch = __webpack_require__(645)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(323)
var EE = __webpack_require__(614).EventEmitter
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(159)
var globSync = __webpack_require__(219)
var common = __webpack_require__(925)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(692)
var util = __webpack_require__(669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(180)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),
/* 580 */,
/* 581 */,
/* 582 */
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),
/* 583 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory;

const Octokit = __webpack_require__(792);
const registerPlugin = __webpack_require__(661);

function factory(plugins) {
  const Api = Octokit.bind(null, plugins || []);
  Api.plugin = registerPlugin.bind(null, plugins || []);
  return Api;
}


/***/ }),
/* 584 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var path = __webpack_require__(622);
var fs = __webpack_require__(747);
var common = __webpack_require__(320);
var glob = __webpack_require__(569);

var globPatternRecursive = path.sep + '**';

common.register('ls', _ls, {
  cmdOptions: {
    'R': 'recursive',
    'A': 'all',
    'L': 'link',
    'a': 'all_deprecated',
    'd': 'directory',
    'l': 'long',
  },
});

//@
//@ ### ls([options,] [path, ...])
//@ ### ls([options,] path_array)
//@ Available options:
//@
//@ + `-R`: recursive
//@ + `-A`: all files (include files beginning with `.`, except for `.` and `..`)
//@ + `-L`: follow symlinks
//@ + `-d`: list directories themselves, not their contents
//@ + `-l`: list objects representing each file, each with fields containing `ls
//@         -l` output fields. See
//@         [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats)
//@         for more info
//@
//@ Examples:
//@
//@ ```javascript
//@ ls('projs/*.js');
//@ ls('-R', '/users/me', '/tmp');
//@ ls('-R', ['/users/me', '/tmp']); // same as above
//@ ls('-l', 'file.txt'); // { name: 'file.txt', mode: 33188, nlink: 1, ...}
//@ ```
//@
//@ Returns array of files in the given path, or in current directory if no path provided.
function _ls(options, paths) {
  if (options.all_deprecated) {
    // We won't support the -a option as it's hard to image why it's useful
    // (it includes '.' and '..' in addition to '.*' files)
    // For backwards compatibility we'll dump a deprecated message and proceed as before
    common.log('ls: Option -a is deprecated. Use -A instead');
    options.all = true;
  }

  if (!paths) {
    paths = ['.'];
  } else {
    paths = [].slice.call(arguments, 1);
  }

  var list = [];

  function pushFile(abs, relName, stat) {
    if (process.platform === 'win32') {
      relName = relName.replace(/\\/g, '/');
    }
    if (options.long) {
      stat = stat || (options.link ? fs.statSync(abs) : fs.lstatSync(abs));
      list.push(addLsAttributes(relName, stat));
    } else {
      // list.push(path.relative(rel || '.', file));
      list.push(relName);
    }
  }

  paths.forEach(function (p) {
    var stat;

    try {
      stat = options.link ? fs.statSync(p) : fs.lstatSync(p);
    } catch (e) {
      common.error('no such file or directory: ' + p, 2, { continue: true });
      return;
    }

    // If the stat succeeded
    if (stat.isDirectory() && !options.directory) {
      if (options.recursive) {
        // use glob, because it's simple
        glob.sync(p + globPatternRecursive, { dot: options.all, follow: options.link })
          .forEach(function (item) {
            // Glob pattern returns the directory itself and needs to be filtered out.
            if (path.relative(p, item)) {
              pushFile(item, path.relative(p, item));
            }
          });
      } else if (options.all) {
        // use fs.readdirSync, because it's fast
        fs.readdirSync(p).forEach(function (item) {
          pushFile(path.join(p, item), item);
        });
      } else {
        // use fs.readdirSync and then filter out secret files
        fs.readdirSync(p).forEach(function (item) {
          if (item[0] !== '.') {
            pushFile(path.join(p, item), item);
          }
        });
      }
    } else {
      pushFile(p, p, stat);
    }
  });

  // Add methods, to make this more compatible with ShellStrings
  return list;
}

function addLsAttributes(pathName, stats) {
  // Note: this object will contain more information than .toString() returns
  stats.name = pathName;
  stats.toString = function () {
    // Return a string resembling unix's `ls -l` format
    return [this.mode, this.nlink, this.uid, this.gid, this.size, this.mtime, this.name].join(' ');
  };
  return stats;
}

module.exports = _ls;


/***/ }),
/* 589 */,
/* 590 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(320);

common.register('ln', _ln, {
  cmdOptions: {
    's': 'symlink',
    'f': 'force',
  },
});

//@
//@ ### ln([options,] source, dest)
//@ Available options:
//@
//@ + `-s`: symlink
//@ + `-f`: force
//@
//@ Examples:
//@
//@ ```javascript
//@ ln('file', 'newlink');
//@ ln('-sf', 'file', 'existing');
//@ ```
//@
//@ Links source to dest. Use -f to force the link, should dest already exist.
function _ln(options, source, dest) {
  if (!source || !dest) {
    common.error('Missing <source> and/or <dest>');
  }

  source = String(source);
  var sourcePath = path.normalize(source).replace(RegExp(path.sep + '$'), '');
  var isAbsolute = (path.resolve(source) === sourcePath);
  dest = path.resolve(process.cwd(), String(dest));

  if (fs.existsSync(dest)) {
    if (!options.force) {
      common.error('Destination file exists', { continue: true });
    }

    fs.unlinkSync(dest);
  }

  if (options.symlink) {
    var isWindows = common.platform === 'win';
    var linkType = isWindows ? 'file' : null;
    var resolvedSourcePath = isAbsolute ? sourcePath : path.resolve(process.cwd(), path.dirname(dest), source);
    if (!fs.existsSync(resolvedSourcePath)) {
      common.error('Source file does not exist', { continue: true });
    } else if (isWindows && fs.statSync(resolvedSourcePath).isDirectory()) {
      linkType = 'junction';
    }

    try {
      fs.symlinkSync(linkType === 'junction' ? resolvedSourcePath : source, dest, linkType);
    } catch (err) {
      common.error(err.message);
    }
  } else {
    if (!fs.existsSync(source)) {
      common.error('Source file does not exist', { continue: true });
    }
    try {
      fs.linkSync(source, dest);
    } catch (err) {
      common.error(err.message);
    }
  }
  return '';
}
module.exports = _ln;


/***/ }),
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),
/* 603 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const pm = __webpack_require__(788);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [HttpCodes.MovedPermanently, HttpCodes.ResourceMoved, HttpCodes.SeeOther, HttpCodes.TemporaryRedirect, HttpCodes.PermanentRedirect];
const HttpResponseRetryCodes = [HttpCodes.BadGateway, HttpCodes.ServiceUnavailable, HttpCodes.GatewayTimeout];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error("Client has already been disposed.");
        }
        let parsedUrl = url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = (this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1) ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1
                && this._allowRedirects
                && redirectsRemaining > 0) {
                const redirectUrl = response.message.headers["location"];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
                    throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof (data) === 'string') {
            info.options.headers["Content-Length"] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', (sock) => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof (data) === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof (data) !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers["user-agent"] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach((handler) => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(810);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                },
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, { rejectUnauthorized: false });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = "Failed request: (" + statusCode + ")";
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),
/* 604 */,
/* 605 */
/***/ (function(module) {

module.exports = require("http");

/***/ }),
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compareBuild = __webpack_require__(513)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */
/***/ (function(module) {

module.exports = require("events");

/***/ }),
/* 615 */,
/* 616 */
/***/ (function(module, exports, __webpack_require__) {

const { MAX_SAFE_COMPONENT_LENGTH } = __webpack_require__(381)
const debug = __webpack_require__(85)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const createToken = (name, value, isGlobal) => {
  const index = R++
  debug(index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*')

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+')

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$')


/***/ }),
/* 617 */,
/* 618 */,
/* 619 */
/***/ (function(module) {

module.exports = require("constants");

/***/ }),
/* 620 */,
/* 621 */,
/* 622 */
/***/ (function(module) {

module.exports = require("path");

/***/ }),
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(541);
const winRelease = __webpack_require__(16);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */
/***/ (function(module) {

module.exports = require("net");

/***/ }),
/* 632 */,
/* 633 */,
/* 634 */,
/* 635 */,
/* 636 */
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),
/* 637 */,
/* 638 */
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(939)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const Range = __webpack_require__(262)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),
/* 655 */,
/* 656 */,
/* 657 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// tslint:disable:no-console
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __webpack_require__(822);
const github = __webpack_require__(399);
const child_process_1 = __webpack_require__(129);
const node_fetch_1 = __importDefault(__webpack_require__(714));
const semver = __webpack_require__(542);
const git = __webpack_require__(946);
const fs = __webpack_require__(747);
const os = __webpack_require__(87);
const child_process_2 = __webpack_require__(129);
const path_1 = __webpack_require__(622);
const commitHash = child_process_2.execSync("git rev-parse HEAD").toString().trim();
function setCommitHash() {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
        packageJson.commit = commitHash;
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
    });
}
const time = new Date()
    .toISOString()
    .replace(/(\..*$)/g, "")
    .replace(/([^\dT])/g, "")
    .replace("T", "");
console.log(`> oddish`);
function configAuthentication(registryUrl, alwaysAuth) {
    const npmrc = path_1.resolve(process.env["RUNNER_TEMP"] || process.cwd(), ".npmrc");
    if (!registryUrl.endsWith("/")) {
        registryUrl += "/";
    }
    writeRegistryToFile(registryUrl, npmrc, alwaysAuth);
}
function writeRegistryToFile(registryUrl, fileLocation, alwaysAuth) {
    let scope = core.getInput("scope");
    if (!scope && registryUrl.indexOf("npm.pkg.github.com") > -1) {
        scope = github.context.repo.owner;
    }
    if (scope && scope[0] != "@") {
        scope = "@" + scope;
    }
    if (scope) {
        scope = scope.toLowerCase();
    }
    core.debug(`Setting auth in ${fileLocation}`);
    let newContents = "";
    if (fs.existsSync(fileLocation)) {
        const curContents = fs.readFileSync(fileLocation, "utf8");
        curContents.split(os.EOL).forEach((line) => {
            // Add current contents unless they are setting the registry
            if (!line.toLowerCase().startsWith("registry")) {
                newContents += line + os.EOL;
            }
        });
    }
    // Remove http: or https: from front of registry.
    const authString = registryUrl.replace(/(^\w+:|^)/, "") + ":_authToken=${NODE_AUTH_TOKEN}";
    const registryString = scope
        ? `${scope}:registry=${registryUrl}`
        : `registry=${registryUrl}`;
    const alwaysAuthString = `always-auth=${alwaysAuth}`;
    newContents += `${authString}${os.EOL}${registryString}${os.EOL}${alwaysAuthString}`;
    fs.writeFileSync(fileLocation, newContents);
    core.exportVariable("NPM_CONFIG_USERCONFIG", fileLocation);
    // Export empty node_auth_token so npm doesn't complain about not being able to find it
    core.exportVariable("NODE_AUTH_TOKEN", "XXXXX-XXXXX-XXXXX-XXXXX");
}
/**
 * Use cases
 *
 *  If no version is published, pick the version from the package.json and publish that version
 *
 *  If a version is published and the minor and major matches the package.json, publish a patch
 *
 *  If the packaje.json version minor and major differs from the published version, pick the latest published patch for the version of the package.json and increment the patch number
 *
 */
function execute(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((onSuccess, onError) => {
            console.log(`> ${command}`);
            child_process_1.exec(command, (error, stdout, stderr) => {
                stdout.trim().length && console.log("  " + stdout.replace(/\n/g, "\n  "));
                stderr.trim().length &&
                    console.error("! " + stderr.replace(/\n/g, "\n  "));
                if (error) {
                    onError(stderr);
                }
                else {
                    onSuccess(stdout);
                }
            });
        });
    });
}
function getBranch() {
    return __awaiter(this, void 0, void 0, function* () {
        return git.branch(process.cwd());
    });
}
function setVersion(newVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        core.setOutput("version", newVersion);
        return execute(`npm version "${newVersion}" --force --no-git-tag-version --allow-same-version`);
    });
}
function publish(npmTag = []) {
    return __awaiter(this, void 0, void 0, function* () {
        core.setOutput("tags", npmTag.join(","));
        return execute(`npm publish` + npmTag.map(($) => ' "--tag=' + $ + '"').join(""));
    });
}
function getVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
        const pkgJsonVersion = json.version;
        const version = semver.parse(pkgJsonVersion.trim());
        if (!version) {
            throw new Error("Unable to parse semver from " + pkgJsonVersion);
        }
        return `${version.major}.${version.minor}.${version.patch}`;
    });
}
function snapshotize(value) {
    const commit = git.short(process.cwd());
    if (!commit) {
        throw new Error("Unable to get git commit");
    }
    return value + "-" + time + ".commit-" + commit;
}
function getSnapshotVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        let nextVersion = snapshotize(yield getVersion());
        const versions = yield getReleaseTags();
        console.log("  published versions: " + JSON.stringify(versions));
        if (versions.latest && semver.lt(nextVersion, versions.latest)) {
            console.log(`! @latest(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
            nextVersion = snapshotize(semver.inc(versions.latest, "patch"));
        }
        if (versions.next && semver.lt(nextVersion, versions.next)) {
            console.log(`! @next(${versions.latest}) > ${nextVersion}. Incrementing patch.`);
            nextVersion = snapshotize(semver.inc(versions.next, "patch"));
        }
        return nextVersion;
    });
}
function getReleaseTags() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const json = JSON.parse(fs.readFileSync("package.json", "utf8"));
            const versions = yield node_fetch_1.default(`https://registry.npmjs.org/-/package/${json.name}/dist-tags`);
            if (versions.ok) {
                return yield versions.json();
            }
            else {
                return {};
            }
        }
        catch (_a) {
            return {};
        }
    });
}
console.log(`  pwd: ${process.cwd()}`);
const run = () => __awaiter(this, void 0, void 0, function* () {
    const registryUrl = core.getInput("registry-url");
    const alwaysAuth = core.getInput("always-auth");
    if (registryUrl) {
        yield configAuthentication(registryUrl, alwaysAuth);
    }
    let branch = process.env.CIRCLE_BRANCH ||
        process.env.BRANCH_NAME ||
        process.env.TRAVIS_BRANCH ||
        (yield getBranch());
    let npmTag = null;
    let gitTag = null;
    if (github.context.ref.startsWith("refs/tags/")) {
        gitTag = github.context.ref.replace(/^refs\/tags\//, "");
    }
    let newVersion = null;
    let linkLatest = false;
    console.log(`  cwd: ${process.cwd()}`);
    console.log(`  branch: ${branch}`);
    console.log(`  gitTag: ${gitTag}`);
    console.log(`  commit: ${commitHash}`);
    // Travis keeps the branch name in the tags' builds
    if (gitTag) {
        const prerelease = semver.prerelease(gitTag);
        if (semver.valid(gitTag)) {
            if (semver.coerce(gitTag).version === gitTag) {
                // Contains no prerelease data and should go to latest
                npmTag = "latest";
                linkLatest = true;
                newVersion = gitTag;
            }
            else if (prerelease && prerelease.includes("rc")) {
                // Release candidate
                npmTag = "rc";
                newVersion = gitTag;
            }
            else if (prerelease && prerelease.includes("er")) {
                // Explorer release
                npmTag = "er";
                newVersion = gitTag;
            }
            else {
                npmTag = "tag-" + gitTag;
                newVersion = yield getSnapshotVersion();
            }
        }
        else {
            console.log(`invalid semver version: ${gitTag}`);
            npmTag = "tag-" + gitTag;
            newVersion = yield getSnapshotVersion();
        }
    }
    else {
        newVersion = yield getSnapshotVersion();
    }
    console.log(`  package.json#version: ${yield getVersion()}`);
    console.log(`  publishing:\n    version: ${newVersion}`);
    console.log(`    tag: ${npmTag || "ci"}\n`);
    if (!gitTag) {
        if (branch === "master") {
            npmTag = "next";
        }
        else {
            console.log(`! canceling automatic npm publish. It can only be made in master branches or tags`);
            process.exit(0);
        }
    }
    const tags = yield getReleaseTags();
    if (npmTag && npmTag in tags) {
        if (semver.gte(tags[npmTag], newVersion)) {
            console.log(`! This version will be not published as "${npmTag}" because a newer version is set. Publishing as "ci"\n`);
            npmTag = null;
        }
    }
    yield setCommitHash();
    yield setVersion(newVersion);
    if (npmTag) {
        yield publish([npmTag]);
    }
    else {
        yield publish(["ci"]);
    }
    if (linkLatest) {
        try {
            if (!tags.latest || semver.gte(newVersion, tags.latest)) {
                const pkgName = (yield execute(`npm info . name`)).trim();
                yield execute(`npm dist-tag add ${pkgName}@${newVersion} latest`);
                core.setOutput("latest", "true");
            }
            else {
                core.setOutput("latest", "false");
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        core.setOutput("latest", "false");
    }
    yield execute(`npm info . dist-tags --json`);
});
run().catch((e) => {
    core.setFailed(e.message);
    console.error("Error:");
    console.error(e);
    process.exit(1);
});


/***/ }),
/* 658 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(927);
const stripEof = __webpack_require__(602);
const npmRunPath = __webpack_require__(853);
const isStream = __webpack_require__(638);
const _getStream = __webpack_require__(564);
const pFinally = __webpack_require__(347);
const onExit = __webpack_require__(240);
const errname = __webpack_require__(94);
const stdio = __webpack_require__(11);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),
/* 659 */,
/* 660 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('mkdir', _mkdir, {
  cmdOptions: {
    'p': 'fullpath',
  },
});

// Recursively creates 'dir'
function mkdirSyncRecursive(dir) {
  var baseDir = path.dirname(dir);

  // Prevents some potential problems arising from malformed UNCs or
  // insufficient permissions.
  /* istanbul ignore next */
  if (baseDir === dir) {
    common.error('dirname() failed: [' + dir + ']');
  }

  // Base dir exists, no recursion necessary
  if (fs.existsSync(baseDir)) {
    fs.mkdirSync(dir, parseInt('0777', 8));
    return;
  }

  // Base dir does not exist, go recursive
  mkdirSyncRecursive(baseDir);

  // Base dir created, can create dir
  fs.mkdirSync(dir, parseInt('0777', 8));
}

//@
//@ ### mkdir([options,] dir [, dir ...])
//@ ### mkdir([options,] dir_array)
//@ Available options:
//@
//@ + `-p`: full path (will create intermediate dirs if necessary)
//@
//@ Examples:
//@
//@ ```javascript
//@ mkdir('-p', '/tmp/a/b/c/d', '/tmp/e/f/g');
//@ mkdir('-p', ['/tmp/a/b/c/d', '/tmp/e/f/g']); // same as above
//@ ```
//@
//@ Creates directories.
function _mkdir(options, dirs) {
  if (!dirs) common.error('no paths given');

  if (typeof dirs === 'string') {
    dirs = [].slice.call(arguments, 1);
  }
  // if it's array leave it as it is

  dirs.forEach(function (dir) {
    try {
      fs.lstatSync(dir);
      if (!options.fullpath) {
        common.error('path already exists: ' + dir, { continue: true });
      }
      return; // skip dir
    } catch (e) {
      // do nothing
    }

    // Base dir does not exist, and no -p option given
    var baseDir = path.dirname(dir);
    if (!fs.existsSync(baseDir) && !options.fullpath) {
      common.error('no such file or directory: ' + baseDir, { continue: true });
      return; // skip dir
    }

    try {
      if (options.fullpath) {
        mkdirSyncRecursive(path.resolve(dir));
      } else {
        fs.mkdirSync(dir, parseInt('0777', 8));
      }
    } catch (e) {
      if (e.code === 'EACCES') {
        common.error('cannot create directory ' + dir + ': Permission denied');
      } else {
        /* istanbul ignore next */
        throw e;
      }
    }
  });
  return '';
} // mkdir
module.exports = _mkdir;


/***/ }),
/* 661 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin;

const factory = __webpack_require__(583);

function registerPlugin(plugins, pluginFunction) {
  return factory(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}


/***/ }),
/* 662 */,
/* 663 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('which', _which, {
  allowGlobbing: false,
  cmdOptions: {
    'a': 'all',
  },
});

// XP's system default value for PATHEXT system variable, just in case it's not
// set on Windows.
var XP_DEFAULT_PATHEXT = '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

// Cross-platform method for splitting environment PATH variables
function splitPath(p) {
  return p ? p.split(path.delimiter) : [];
}

function checkPath(pathName) {
  return fs.existsSync(pathName) && !fs.statSync(pathName).isDirectory();
}

//@
//@ ### which(command)
//@
//@ Examples:
//@
//@ ```javascript
//@ var nodeExec = which('node');
//@ ```
//@
//@ Searches for `command` in the system's PATH. On Windows, this uses the
//@ `PATHEXT` variable to append the extension if it's not already executable.
//@ Returns string containing the absolute path to the command.
function _which(options, cmd) {
  if (!cmd) common.error('must specify command');

  var pathEnv = process.env.path || process.env.Path || process.env.PATH;
  var pathArray = splitPath(pathEnv);

  var queryMatches = [];

  // No relative/absolute paths provided?
  if (cmd.indexOf('/') === -1) {
    // Assume that there are no extensions to append to queries (this is the
    // case for unix)
    var pathExtArray = [''];
    if (common.platform === 'win') {
      // In case the PATHEXT variable is somehow not set (e.g.
      // child_process.spawn with an empty environment), use the XP default.
      var pathExtEnv = process.env.PATHEXT || XP_DEFAULT_PATHEXT;
      pathExtArray = splitPath(pathExtEnv.toUpperCase());
    }

    // Search for command in PATH
    for (var k = 0; k < pathArray.length; k++) {
      // already found it
      if (queryMatches.length > 0 && !options.all) break;

      var attempt = path.resolve(pathArray[k], cmd);

      if (common.platform === 'win') {
        attempt = attempt.toUpperCase();
      }

      var match = attempt.match(/\.[^<>:"/\|?*.]+$/);
      if (match && pathExtArray.indexOf(match[0]) >= 0) { // this is Windows-only
        // The user typed a query with the file extension, like
        // `which('node.exe')`
        if (checkPath(attempt)) {
          queryMatches.push(attempt);
          break;
        }
      } else { // All-platforms
        // Cycle through the PATHEXT array, and check each extension
        // Note: the array is always [''] on Unix
        for (var i = 0; i < pathExtArray.length; i++) {
          var ext = pathExtArray[i];
          var newAttempt = attempt + ext;
          if (checkPath(newAttempt)) {
            queryMatches.push(newAttempt);
            break;
          }
        }
      }
    }
  } else if (checkPath(cmd)) { // a valid absolute or relative path
    queryMatches.push(path.resolve(cmd));
  }

  if (queryMatches.length > 0) {
    return options.all ? queryMatches : queryMatches[0];
  }
  return options.all ? [] : null;
}
module.exports = _which;


/***/ }),
/* 664 */,
/* 665 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(180);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),
/* 666 */,
/* 667 */,
/* 668 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),
/* 669 */
/***/ (function(module) {

module.exports = require("util");

/***/ }),
/* 670 */,
/* 671 */,
/* 672 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(311);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),
/* 673 */,
/* 674 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const which = __webpack_require__(829);
const pathKey = __webpack_require__(964)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),
/* 675 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
function normalizePaginatedListResponse(octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
  const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
  if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  Object.defineProperty(response.data, namespaceKey, {
    get() {
      octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
      return Array.from(data);
    }

  });
}

function iterator(octokit, route, parameters) {
  const options = octokit.request.endpoint(route, parameters);
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return octokit.request({
          method,
          url,
          headers
        }).then(response => {
          normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),
/* 676 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var common = __webpack_require__(320);

common.register('cd', _cd, {});

//@
//@ ### cd([dir])
//@ Changes to directory `dir` for the duration of the script. Changes to home
//@ directory if no argument is supplied.
function _cd(options, dir) {
  if (!dir) dir = common.getUserHome();

  if (dir === '-') {
    if (!process.env.OLDPWD) {
      common.error('could not find previous directory');
    } else {
      dir = process.env.OLDPWD;
    }
  }

  try {
    var curDir = process.cwd();
    process.chdir(dir);
    process.env.OLDPWD = curDir;
  } catch (e) {
    // something went wrong, let's figure out the error
    var err;
    try {
      fs.statSync(dir); // if this succeeds, it must be some sort of file
      err = 'not a directory: ' + dir;
    } catch (e2) {
      err = 'no such file or directory: ' + dir;
    }
    if (err) common.error(err);
  }
  return '';
}
module.exports = _cd;


/***/ }),
/* 677 */,
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */,
/* 682 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(320);
var _ls = __webpack_require__(588);

common.register('find', _find, {});

//@
//@ ### find(path [, path ...])
//@ ### find(path_array)
//@ Examples:
//@
//@ ```javascript
//@ find('src', 'lib');
//@ find(['src', 'lib']); // same as above
//@ find('.').filter(function(file) { return file.match(/\.js$/); });
//@ ```
//@
//@ Returns array of all files (however deep) in the given paths.
//@
//@ The main difference from `ls('-R', path)` is that the resulting file names
//@ include the base directories, e.g. `lib/resources/file1` instead of just `file1`.
function _find(options, paths) {
  if (!paths) {
    common.error('no path specified');
  } else if (typeof paths === 'string') {
    paths = [].slice.call(arguments, 1);
  }

  var list = [];

  function pushFile(file) {
    if (common.platform === 'win') {
      file = file.replace(/\\/g, '/');
    }
    list.push(file);
  }

  // why not simply do ls('-R', paths)? because the output wouldn't give the base dirs
  // to get the base dir in the output, we need instead ls('-R', 'dir/*') for every directory

  paths.forEach(function (file) {
    var stat;
    try {
      stat = fs.statSync(file);
    } catch (e) {
      common.error('no such file or directory: ' + file);
    }

    pushFile(file);

    if (stat.isDirectory()) {
      _ls({ recursive: true, all: true }, file).forEach(function (subfile) {
        pushFile(path.join(file, subfile));
      });
    }
  });

  return list;
}
module.exports = _find;


/***/ }),
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

var common = __webpack_require__(320);
var _cd = __webpack_require__(676);
var path = __webpack_require__(622);

common.register('dirs', _dirs, {
  wrapOutput: false,
});
common.register('pushd', _pushd, {
  wrapOutput: false,
});
common.register('popd', _popd, {
  wrapOutput: false,
});

// Pushd/popd/dirs internals
var _dirStack = [];

function _isStackIndex(index) {
  return (/^[\-+]\d+$/).test(index);
}

function _parseStackIndex(index) {
  if (_isStackIndex(index)) {
    if (Math.abs(index) < _dirStack.length + 1) { // +1 for pwd
      return (/^-/).test(index) ? Number(index) - 1 : Number(index);
    }
    common.error(index + ': directory stack index out of range');
  } else {
    common.error(index + ': invalid number');
  }
}

function _actualDirStack() {
  return [process.cwd()].concat(_dirStack);
}

//@
//@ ### pushd([options,] [dir | '-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppresses the normal change of directory when adding directories to the stack, so that only the stack is manipulated.
//@
//@ Arguments:
//@
//@ + `dir`: Makes the current working directory be the top of the stack, and then executes the equivalent of `cd dir`.
//@ + `+N`: Brings the Nth directory (counting from the left of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@ + `-N`: Brings the Nth directory (counting from the right of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@
//@ Examples:
//@
//@ ```javascript
//@ // process.cwd() === '/usr'
//@ pushd('/etc'); // Returns /etc /usr
//@ pushd('+1');   // Returns /usr /etc
//@ ```
//@
//@ Save the current directory on the top of the directory stack and then cd to `dir`. With no arguments, pushd exchanges the top two directories. Returns an array of paths in the stack.
function _pushd(options, dir) {
  if (_isStackIndex(options)) {
    dir = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'n': 'no-cd',
  });

  var dirs = _actualDirStack();

  if (dir === '+0') {
    return dirs; // +0 is a noop
  } else if (!dir) {
    if (dirs.length > 1) {
      dirs = dirs.splice(1, 1).concat(dirs);
    } else {
      return common.error('no other directory');
    }
  } else if (_isStackIndex(dir)) {
    var n = _parseStackIndex(dir);
    dirs = dirs.slice(n).concat(dirs.slice(0, n));
  } else {
    if (options['no-cd']) {
      dirs.splice(1, 0, dir);
    } else {
      dirs.unshift(dir);
    }
  }

  if (options['no-cd']) {
    dirs = dirs.slice(1);
  } else {
    dir = path.resolve(dirs.shift());
    _cd('', dir);
  }

  _dirStack = dirs;
  return _dirs('');
}
exports.pushd = _pushd;

//@
//@ ### popd([options,] ['-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppresses the normal change of directory when removing directories from the stack, so that only the stack is manipulated.
//@
//@ Arguments:
//@
//@ + `+N`: Removes the Nth directory (counting from the left of the list printed by dirs), starting with zero.
//@ + `-N`: Removes the Nth directory (counting from the right of the list printed by dirs), starting with zero.
//@
//@ Examples:
//@
//@ ```javascript
//@ echo(process.cwd()); // '/usr'
//@ pushd('/etc');       // '/etc /usr'
//@ echo(process.cwd()); // '/etc'
//@ popd();              // '/usr'
//@ echo(process.cwd()); // '/usr'
//@ ```
//@
//@ When no arguments are given, popd removes the top directory from the stack and performs a cd to the new top directory. The elements are numbered from 0 starting at the first directory listed with dirs; i.e., popd is equivalent to popd +0. Returns an array of paths in the stack.
function _popd(options, index) {
  if (_isStackIndex(options)) {
    index = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'n': 'no-cd',
  });

  if (!_dirStack.length) {
    return common.error('directory stack empty');
  }

  index = _parseStackIndex(index || '+0');

  if (options['no-cd'] || index > 0 || _dirStack.length + index === 0) {
    index = index > 0 ? index - 1 : index;
    _dirStack.splice(index, 1);
  } else {
    var dir = path.resolve(_dirStack.shift());
    _cd('', dir);
  }

  return _dirs('');
}
exports.popd = _popd;

//@
//@ ### dirs([options | '+N' | '-N'])
//@
//@ Available options:
//@
//@ + `-c`: Clears the directory stack by deleting all of the elements.
//@
//@ Arguments:
//@
//@ + `+N`: Displays the Nth directory (counting from the left of the list printed by dirs when invoked without options), starting with zero.
//@ + `-N`: Displays the Nth directory (counting from the right of the list printed by dirs when invoked without options), starting with zero.
//@
//@ Display the list of currently remembered directories. Returns an array of paths in the stack, or a single path if +N or -N was specified.
//@
//@ See also: pushd, popd
function _dirs(options, index) {
  if (_isStackIndex(options)) {
    index = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'c': 'clear',
  });

  if (options.clear) {
    _dirStack = [];
    return _dirStack;
  }

  var stack = _actualDirStack();

  if (index) {
    index = _parseStackIndex(index);

    if (index < 0) {
      index = stack.length + index;
    }

    common.log(stack[index]);
    return stack[index];
  }

  common.log(stack.join(' '));

  return stack;
}
exports.dirs = _dirs;


/***/ }),
/* 687 */,
/* 688 */,
/* 689 */,
/* 690 */,
/* 691 */
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),
/* 692 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(97)
var reqs = Object.create(null)
var once = __webpack_require__(180)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),
/* 693 */,
/* 694 */,
/* 695 */,
/* 696 */,
/* 697 */,
/* 698 */,
/* 699 */,
/* 700 */,
/* 701 */,
/* 702 */,
/* 703 */,
/* 704 */,
/* 705 */
/***/ (function(module) {

module.exports = {"_from":"@octokit/rest@^16.43.1","_id":"@octokit/rest@16.43.1","_inBundle":false,"_integrity":"sha512-gfFKwRT/wFxq5qlNjnW2dh+qh74XgTQ2B179UX5K1HYCluioWj8Ndbgqw2PVqa1NnVJkGHp2ovMpVn/DImlmkw==","_location":"/@octokit/rest","_phantomChildren":{"@octokit/types":"2.10.0","deprecation":"2.3.1","once":"1.4.0"},"_requested":{"type":"range","registry":true,"raw":"@octokit/rest@^16.43.1","name":"@octokit/rest","escapedName":"@octokit%2frest","scope":"@octokit","rawSpec":"^16.43.1","saveSpec":null,"fetchSpec":"^16.43.1"},"_requiredBy":["/@actions/github"],"_resolved":"https://registry.npmjs.org/@octokit/rest/-/rest-16.43.1.tgz","_shasum":"3b11e7d1b1ac2bbeeb23b08a17df0b20947eda6b","_spec":"@octokit/rest@^16.43.1","_where":"/Users/menduz/code/oddish-action/node_modules/@actions/github","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/rest.js/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"dependencies":{"@octokit/auth-token":"^2.4.0","@octokit/plugin-paginate-rest":"^1.1.1","@octokit/plugin-request-log":"^1.0.0","@octokit/plugin-rest-endpoint-methods":"2.4.0","@octokit/request":"^5.2.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"deprecated":false,"description":"GitHub REST API client for Node.js","devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/auth":"^1.1.1","@octokit/fixtures-server":"^5.0.6","@octokit/graphql":"^4.2.0","@types/node":"^13.1.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.1.0","cypress":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^4.0.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","lolex":"^5.1.2","mkdirp":"^1.0.0","mocha":"^7.0.1","mustache":"^4.0.0","nock":"^11.3.3","npm-run-all":"^4.1.2","nyc":"^15.0.0","prettier":"^1.14.2","proxy":"^1.0.0","semantic-release":"^17.0.0","sinon":"^8.0.0","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"files":["index.js","index.d.ts","lib","plugins"],"homepage":"https://github.com/octokit/rest.js#readme","keywords":["octokit","github","rest","api-client"],"license":"MIT","name":"@octokit/rest","nyc":{"ignore":["test"]},"publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/rest.js.git"},"scripts":{"build":"npm-run-all build:*","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","build:ts":"npm run -s update-endpoints:typescript","coverage":"nyc report --reporter=html && open coverage/index.html","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","lint":"prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","lint:fix":"prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","prebuild:browser":"mkdirp dist/","pretest":"npm run -s lint","prevalidate:ts":"npm run -s build:ts","start-fixtures-server":"octokit-fixtures-server","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","update-endpoints":"npm-run-all update-endpoints:*","update-endpoints:fetch-json":"node scripts/update-endpoints/fetch-json","update-endpoints:typescript":"node scripts/update-endpoints/typescript","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts"},"types":"index.d.ts","version":"16.43.1"};

/***/ }),
/* 706 */,
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('head', _head, {
  canReceivePipe: true,
  cmdOptions: {
    'n': 'numLines',
  },
});

// This reads n or more lines, or the entire file, whichever is less.
function readSomeLines(file, numLines) {
  var BUF_LENGTH = 64 * 1024;
  var buf = new Buffer(BUF_LENGTH);
  var bytesRead = BUF_LENGTH;
  var pos = 0;
  var fdr = null;

  try {
    fdr = fs.openSync(file, 'r');
  } catch (e) {
    common.error('cannot read file: ' + file);
  }

  var numLinesRead = 0;
  var ret = '';
  while (bytesRead === BUF_LENGTH && numLinesRead < numLines) {
    bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
    var bufStr = buf.toString('utf8', 0, bytesRead);
    numLinesRead += bufStr.split('\n').length - 1;
    ret += bufStr;
    pos += bytesRead;
  }

  fs.closeSync(fdr);
  return ret;
}
//@
//@ ### head([{'-n': \<num\>},] file [, file ...])
//@ ### head([{'-n': \<num\>},] file_array)
//@ Available options:
//@
//@ + `-n <num>`: Show the first `<num>` lines of the files
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = head({'-n': 1}, 'file*.txt');
//@ var str = head('file1', 'file2');
//@ var str = head(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the start of a file.
function _head(options, files) {
  var head = [];
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given');

  var idx = 1;
  if (options.numLines === true) {
    idx = 2;
    options.numLines = Number(arguments[1]);
  } else if (options.numLines === false) {
    options.numLines = 10;
  }
  files = [].slice.call(arguments, idx);

  if (pipe) {
    files.unshift('-');
  }

  var shouldAppendNewline = false;
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, { continue: true });
      return;
    }

    var contents;
    if (file === '-') {
      contents = pipe;
    } else if (options.numLines < 0) {
      contents = fs.readFileSync(file, 'utf8');
    } else {
      contents = readSomeLines(file, options.numLines);
    }

    var lines = contents.split('\n');
    var hasTrailingNewline = (lines[lines.length - 1] === '');
    if (hasTrailingNewline) {
      lines.pop();
    }
    shouldAppendNewline = (hasTrailingNewline || options.numLines < lines.length);

    head = head.concat(lines.slice(0, options.numLines));
  });

  if (shouldAppendNewline) {
    head.push(''); // to add a trailing newline once we join
  }
  return head.join('\n');
}
module.exports = _head;


/***/ }),
/* 711 */,
/* 712 */,
/* 713 */,
/* 714 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(211));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(120).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),
/* 715 */,
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */,
/* 725 */,
/* 726 */,
/* 727 */,
/* 728 */,
/* 729 */,
/* 730 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const { requestLog } = __webpack_require__(568);
const {
  restEndpointMethods
} = __webpack_require__(272);

const Core = __webpack_require__(90);

const CORE_PLUGINS = [
  __webpack_require__(974),
  __webpack_require__(208), // deprecated: remove in v17
  requestLog,
  __webpack_require__(278),
  restEndpointMethods,
  __webpack_require__(550),

  __webpack_require__(731) // deprecated: remove in v17
];

const OctokitRest = Core.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit[key] = OctokitRest[key];
  }
});

module.exports = Octokit;


/***/ }),
/* 731 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(28).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(43).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(397).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(52).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(227)
  octokit.hasLastPage = __webpack_require__(113)
  octokit.hasNextPage = __webpack_require__(508)
  octokit.hasPreviousPage = __webpack_require__(206)
}


/***/ }),
/* 732 */,
/* 733 */,
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */,
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */,
/* 743 */,
/* 744 */,
/* 745 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const niceTry = __webpack_require__(471);
const resolveCommand = __webpack_require__(674);
const escape = __webpack_require__(232);
const readShebang = __webpack_require__(672);
const semver = __webpack_require__(976);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),
/* 746 */,
/* 747 */
/***/ (function(module) {

module.exports = require("fs");

/***/ }),
/* 748 */,
/* 749 */,
/* 750 */,
/* 751 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(461);
const uniq = __webpack_require__(147);

function authenticationBeforeRequest(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}


/***/ }),
/* 752 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),
/* 753 */,
/* 754 */,
/* 755 */,
/* 756 */,
/* 757 */,
/* 758 */,
/* 759 */
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),
/* 760 */,
/* 761 */
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),
/* 762 */,
/* 763 */
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),
/* 764 */,
/* 765 */,
/* 766 */,
/* 767 */,
/* 768 */,
/* 769 */,
/* 770 */,
/* 771 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }
  constructor (comp, options) {
    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (!options || typeof options !== 'object') {
      options = {
        loose: !!options,
        includePrerelease: false
      }
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    const sameDirectionIncreasing =
      (this.operator === '>=' || this.operator === '>') &&
      (comp.operator === '>=' || comp.operator === '>')
    const sameDirectionDecreasing =
      (this.operator === '<=' || this.operator === '<') &&
      (comp.operator === '<=' || comp.operator === '<')
    const sameSemVer = this.semver.version === comp.semver.version
    const differentDirectionsInclusive =
      (this.operator === '>=' || this.operator === '<=') &&
      (comp.operator === '>=' || comp.operator === '<=')
    const oppositeDirectionsLessThan =
      cmp(this.semver, '<', comp.semver, options) &&
      (this.operator === '>=' || this.operator === '>') &&
        (comp.operator === '<=' || comp.operator === '<')
    const oppositeDirectionsGreaterThan =
      cmp(this.semver, '>', comp.semver, options) &&
      (this.operator === '<=' || this.operator === '<') &&
        (comp.operator === '>=' || comp.operator === '>')

    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
}

module.exports = Comparator

const {re, t} = __webpack_require__(616)
const cmp = __webpack_require__(18)
const debug = __webpack_require__(85)
const SemVer = __webpack_require__(503)
const Range = __webpack_require__(262)


/***/ }),
/* 772 */,
/* 773 */,
/* 774 */,
/* 775 */,
/* 776 */,
/* 777 */,
/* 778 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var Stream = __webpack_require__(413).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),
/* 779 */,
/* 780 */,
/* 781 */,
/* 782 */,
/* 783 */,
/* 784 */,
/* 785 */,
/* 786 */,
/* 787 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

common.register('test', _test, {
  cmdOptions: {
    'b': 'block',
    'c': 'character',
    'd': 'directory',
    'e': 'exists',
    'f': 'file',
    'L': 'link',
    'p': 'pipe',
    'S': 'socket',
  },
  wrapOutput: false,
  allowGlobbing: false,
});


//@
//@ ### test(expression)
//@ Available expression primaries:
//@
//@ + `'-b', 'path'`: true if path is a block device
//@ + `'-c', 'path'`: true if path is a character device
//@ + `'-d', 'path'`: true if path is a directory
//@ + `'-e', 'path'`: true if path exists
//@ + `'-f', 'path'`: true if path is a regular file
//@ + `'-L', 'path'`: true if path is a symbolic link
//@ + `'-p', 'path'`: true if path is a pipe (FIFO)
//@ + `'-S', 'path'`: true if path is a socket
//@
//@ Examples:
//@
//@ ```javascript
//@ if (test('-d', path)) { /* do something with dir */ };
//@ if (!test('-f', path)) continue; // skip if it's a regular file
//@ ```
//@
//@ Evaluates expression using the available primaries and returns corresponding value.
function _test(options, path) {
  if (!path) common.error('no path given');

  var canInterpret = false;
  Object.keys(options).forEach(function (key) {
    if (options[key] === true) {
      canInterpret = true;
    }
  });

  if (!canInterpret) common.error('could not interpret expression');

  if (options.link) {
    try {
      return fs.lstatSync(path).isSymbolicLink();
    } catch (e) {
      return false;
    }
  }

  if (!fs.existsSync(path)) return false;

  if (options.exists) return true;

  var stats = fs.statSync(path);

  if (options.block) return stats.isBlockDevice();

  if (options.character) return stats.isCharacterDevice();

  if (options.directory) return stats.isDirectory();

  if (options.file) return stats.isFile();

  /* istanbul ignore next */
  if (options.pipe) return stats.isFIFO();

  /* istanbul ignore next */
  if (options.socket) return stats.isSocket();

  /* istanbul ignore next */
  return false; // fallback
} // test
module.exports = _test;


/***/ }),
/* 788 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env["https_proxy"] ||
            process.env["HTTPS_PROXY"];
    }
    else {
        proxyVar = process.env["http_proxy"] ||
            process.env["HTTP_PROXY"];
    }
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy.split(',').map(x => x.trim().toUpperCase()).filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),
/* 789 */,
/* 790 */,
/* 791 */,
/* 792 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit;

const { request } = __webpack_require__(241);
const Hook = __webpack_require__(972);

const parseClientOptions = __webpack_require__(852);

function Octokit(plugins, options) {
  options = options || {};
  const hook = new Hook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}


/***/ }),
/* 793 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var polyfills = __webpack_require__(116)
var legacy = __webpack_require__(778)
var clone = __webpack_require__(480)

var queue = []

var util = __webpack_require__(669)

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    __webpack_require__(357).equal(queue.length, 0)
  })
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

// Only patch fs once, otherwise we'll run into a memory leak if
// graceful-fs is loaded multiple times, such as in test environments that
// reset the loaded modules between tests.
// We look for the string `graceful-fs` from the comment above. This
// way we are not adding any extra properties and it will detect if older
// versions of graceful-fs are installed.
if (!/\bgraceful-fs\b/.test(fs.closeSync.toString())) {
  fs.closeSync = module.exports.closeSync;
  fs.close = module.exports.close;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),
/* 794 */,
/* 795 */,
/* 796 */,
/* 797 */,
/* 798 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),
/* 799 */,
/* 800 */,
/* 801 */,
/* 802 */,
/* 803 */,
/* 804 */,
/* 805 */,
/* 806 */,
/* 807 */,
/* 808 */,
/* 809 */,
/* 810 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(555);


/***/ }),
/* 811 */,
/* 812 */,
/* 813 */
/***/ (function(module) {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers
}


/***/ }),
/* 814 */,
/* 815 */,
/* 816 */
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),
/* 817 */,
/* 818 */
/***/ (function(module) {

module.exports = require("tls");

/***/ }),
/* 819 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);

common.register('set', _set, {
  allowGlobbing: false,
  wrapOutput: false,
});

//@
//@ ### set(options)
//@ Available options:
//@
//@ + `+/-e`: exit upon error (`config.fatal`)
//@ + `+/-v`: verbose: show all commands (`config.verbose`)
//@ + `+/-f`: disable filename expansion (globbing)
//@
//@ Examples:
//@
//@ ```javascript
//@ set('-e'); // exit upon first error
//@ set('+e'); // this undoes a "set('-e')"
//@ ```
//@
//@ Sets global configuration variables
function _set(options) {
  if (!options) {
    var args = [].slice.call(arguments, 0);
    if (args.length < 2) common.error('must provide an argument');
    options = args[1];
  }
  var negate = (options[0] === '+');
  if (negate) {
    options = '-' + options.slice(1); // parseOptions needs a '-' prefix
  }
  options = common.parseOptions(options, {
    'e': 'fatal',
    'v': 'verbose',
    'f': 'noglob',
  });

  if (negate) {
    Object.keys(options).forEach(function (key) {
      options[key] = !options[key];
    });
  }

  Object.keys(options).forEach(function (key) {
    // Only change the global config if `negate` is false and the option is true
    // or if `negate` is true and the option is false (aka negate !== option)
    if (negate !== options[key]) {
      common.config[key] = options[key];
    }
  });
  return;
}
module.exports = _set;


/***/ }),
/* 820 */
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),
/* 821 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(197);

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}


/***/ }),
/* 822 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(579);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),
/* 823 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),
/* 824 */,
/* 825 */,
/* 826 */,
/* 827 */,
/* 828 */,
/* 829 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(622)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(175)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),
/* 830 */,
/* 831 */,
/* 832 */,
/* 833 */,
/* 834 */,
/* 835 */
/***/ (function(module) {

module.exports = require("url");

/***/ }),
/* 836 */,
/* 837 */,
/* 838 */,
/* 839 */,
/* 840 */,
/* 841 */,
/* 842 */,
/* 843 */,
/* 844 */,
/* 845 */,
/* 846 */,
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */,
/* 851 */,
/* 852 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions;

const { Deprecation } = __webpack_require__(166);
const { getUserAgent } = __webpack_require__(421);
const once = __webpack_require__(180);

const pkg = __webpack_require__(705);

const deprecateOptionsTimeout = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}


/***/ }),
/* 853 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathKey = __webpack_require__(964);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),
/* 854 */,
/* 855 */,
/* 856 */,
/* 857 */,
/* 858 */,
/* 859 */,
/* 860 */,
/* 861 */,
/* 862 */
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),
/* 863 */,
/* 864 */,
/* 865 */,
/* 866 */,
/* 867 */,
/* 868 */,
/* 869 */,
/* 870 */,
/* 871 */,
/* 872 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const compare = __webpack_require__(798)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),
/* 873 */
/***/ (function(module) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),
/* 874 */,
/* 875 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const Range = __webpack_require__(262)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */,
/* 880 */,
/* 881 */,
/* 882 */,
/* 883 */,
/* 884 */,
/* 885 */,
/* 886 */,
/* 887 */,
/* 888 */,
/* 889 */,
/* 890 */,
/* 891 */,
/* 892 */,
/* 893 */,
/* 894 */,
/* 895 */,
/* 896 */,
/* 897 */,
/* 898 */,
/* 899 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

//
// ShellJS
// Unix shell commands on top of Node's API
//
// Copyright (c) 2012 Artur Adib
// http://github.com/shelljs/shelljs
//

function __ncc_wildcard$0 (arg) {
  if (arg === "cat.js" || arg === "cat") return __webpack_require__(304);
  else if (arg === "cd.js" || arg === "cd") return __webpack_require__(676);
  else if (arg === "chmod.js" || arg === "chmod") return __webpack_require__(920);
  else if (arg === "common.js" || arg === "common") return __webpack_require__(320);
  else if (arg === "cp.js" || arg === "cp") return __webpack_require__(50);
  else if (arg === "dirs.js" || arg === "dirs") return __webpack_require__(686);
  else if (arg === "echo.js" || arg === "echo") return __webpack_require__(372);
  else if (arg === "error.js" || arg === "error") return __webpack_require__(44);
  else if (arg === "exec.js" || arg === "exec") return __webpack_require__(26);
  else if (arg === "find.js" || arg === "find") return __webpack_require__(682);
  else if (arg === "grep.js" || arg === "grep") return __webpack_require__(179);
  else if (arg === "head.js" || arg === "head") return __webpack_require__(710);
  else if (arg === "ln.js" || arg === "ln") return __webpack_require__(590);
  else if (arg === "ls.js" || arg === "ls") return __webpack_require__(588);
  else if (arg === "mkdir.js" || arg === "mkdir") return __webpack_require__(660);
  else if (arg === "mv.js" || arg === "mv") return __webpack_require__(906);
  else if (arg === "popd.js" || arg === "popd") return __webpack_require__(89);
  else if (arg === "pushd.js" || arg === "pushd") return __webpack_require__(19);
  else if (arg === "pwd.js" || arg === "pwd") return __webpack_require__(330);
  else if (arg === "rm.js" || arg === "rm") return __webpack_require__(3);
  else if (arg === "sed.js" || arg === "sed") return __webpack_require__(221);
  else if (arg === "set.js" || arg === "set") return __webpack_require__(819);
  else if (arg === "sort.js" || arg === "sort") return __webpack_require__(523);
  else if (arg === "tail.js" || arg === "tail") return __webpack_require__(551);
  else if (arg === "tempdir.js" || arg === "tempdir") return __webpack_require__(986);
  else if (arg === "test.js" || arg === "test") return __webpack_require__(787);
  else if (arg === "to.js" || arg === "to") return __webpack_require__(481);
  else if (arg === "toEnd.js" || arg === "toEnd") return __webpack_require__(329);
  else if (arg === "touch.js" || arg === "touch") return __webpack_require__(33);
  else if (arg === "uniq.js" || arg === "uniq") return __webpack_require__(916);
  else if (arg === "which.js" || arg === "which") return __webpack_require__(663);
}
var common = __webpack_require__(320);

//@
//@ All commands run synchronously, unless otherwise stated.
//@ All commands accept standard bash globbing characters (`*`, `?`, etc.),
//@ compatible with the [node glob module](https://github.com/isaacs/node-glob).
//@
//@ For less-commonly used commands and features, please check out our [wiki
//@ page](https://github.com/shelljs/shelljs/wiki).
//@

// Include the docs for all the default commands
//@commands

// Load all default commands
__webpack_require__(997).forEach(function (command) {
  __ncc_wildcard$0(command);
});

//@
//@ ### exit(code)
//@ Exits the current process with the given exit code.
exports.exit = process.exit;

//@include ./src/error
exports.error = __webpack_require__(44);

//@include ./src/common
exports.ShellString = common.ShellString;

//@
//@ ### env['VAR_NAME']
//@ Object containing environment variables (both getter and setter). Shortcut
//@ to process.env.
exports.env = process.env;

//@
//@ ### Pipes
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('foo', 'file1.txt', 'file2.txt').sed(/o/g, 'a').to('output.txt');
//@ echo('files with o\'s in the name:\n' + ls().grep('o'));
//@ cat('test.js').exec('node'); // pipe to exec() call
//@ ```
//@
//@ Commands can send their output to another command in a pipe-like fashion.
//@ `sed`, `grep`, `cat`, `exec`, `to`, and `toEnd` can appear on the right-hand
//@ side of a pipe. Pipes can be chained.

//@
//@ ## Configuration
//@

exports.config = common.config;

//@
//@ ### config.silent
//@
//@ Example:
//@
//@ ```javascript
//@ var sh = require('shelljs');
//@ var silentState = sh.config.silent; // save old silent state
//@ sh.config.silent = true;
//@ /* ... */
//@ sh.config.silent = silentState; // restore old silent state
//@ ```
//@
//@ Suppresses all command output if `true`, except for `echo()` calls.
//@ Default is `false`.

//@
//@ ### config.fatal
//@
//@ Example:
//@
//@ ```javascript
//@ require('shelljs/global');
//@ config.fatal = true; // or set('-e');
//@ cp('this_file_does_not_exist', '/dev/null'); // throws Error here
//@ /* more commands... */
//@ ```
//@
//@ If `true` the script will throw a Javascript error when any shell.js
//@ command encounters an error. Default is `false`. This is analogous to
//@ Bash's `set -e`

//@
//@ ### config.verbose
//@
//@ Example:
//@
//@ ```javascript
//@ config.verbose = true; // or set('-v');
//@ cd('dir/');
//@ ls('subdir/');
//@ ```
//@
//@ Will print each command as follows:
//@
//@ ```
//@ cd dir/
//@ ls subdir/
//@ ```

//@
//@ ### config.globOptions
//@
//@ Example:
//@
//@ ```javascript
//@ config.globOptions = {nodir: true};
//@ ```
//@
//@ Use this value for calls to `glob.sync()` instead of the default options.

//@
//@ ### config.reset()
//@
//@ Example:
//@
//@ ```javascript
//@ var shell = require('shelljs');
//@ // Make changes to shell.config, and do stuff...
//@ /* ... */
//@ shell.config.reset(); // reset to original state
//@ // Do more stuff, but with original settings
//@ /* ... */
//@ ```
//@
//@ Reset shell.config to the defaults:
//@
//@ ```javascript
//@ {
//@   fatal: false,
//@   globOptions: {},
//@   maxdepth: 255,
//@   noglob: false,
//@   silent: false,
//@   verbose: false,
//@ }
//@ ```


/***/ }),
/* 900 */,
/* 901 */,
/* 902 */,
/* 903 */,
/* 904 */,
/* 905 */,
/* 906 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(320);
var cp = __webpack_require__(50);
var rm = __webpack_require__(3);

common.register('mv', _mv, {
  cmdOptions: {
    'f': '!no_force',
    'n': 'no_force',
  },
});

//@
//@ ### mv([options ,] source [, source ...], dest')
//@ ### mv([options ,] source_array, dest')
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@
//@ Examples:
//@
//@ ```javascript
//@ mv('-n', 'file', 'dir/');
//@ mv('file1', 'file2', 'dir/');
//@ mv(['file1', 'file2'], 'dir/'); // same as above
//@ ```
//@
//@ Moves files.
function _mv(options, sources, dest) {
  // Get sources, dest
  if (arguments.length < 3) {
    common.error('missing <source> and/or <dest>');
  } else if (arguments.length > 3) {
    sources = [].slice.call(arguments, 1, arguments.length - 1);
    dest = arguments[arguments.length - 1];
  } else if (typeof sources === 'string') {
    sources = [sources];
  } else {
    // TODO(nate): figure out if we actually need this line
    common.error('invalid arguments');
  }

  var exists = fs.existsSync(dest);
  var stats = exists && fs.statSync(dest);

  // Dest is not existing dir, but multiple sources given
  if ((!exists || !stats.isDirectory()) && sources.length > 1) {
    common.error('dest is not a directory (too many sources)');
  }

  // Dest is an existing file, but no -f given
  if (exists && stats.isFile() && options.no_force) {
    common.error('dest file already exists: ' + dest);
  }

  sources.forEach(function (src) {
    if (!fs.existsSync(src)) {
      common.error('no such file or directory: ' + src, { continue: true });
      return; // skip file
    }

    // If here, src exists

    // When copying to '/path/dir':
    //    thisDest = '/path/dir/file1'
    var thisDest = dest;
    if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
      thisDest = path.normalize(dest + '/' + path.basename(src));
    }

    if (fs.existsSync(thisDest) && options.no_force) {
      common.error('dest file already exists: ' + thisDest, { continue: true });
      return; // skip file
    }

    if (path.resolve(src) === path.dirname(path.resolve(thisDest))) {
      common.error('cannot move to self: ' + src, { continue: true });
      return; // skip file
    }

    try {
      fs.renameSync(src, thisDest);
    } catch (e) {
      /* istanbul ignore next */
      if (e.code === 'EXDEV') {
        // If we're trying to `mv` to an external partition, we'll actually need
        // to perform a copy and then clean up the original file. If either the
        // copy or the rm fails with an exception, we should allow this
        // exception to pass up to the top level.
        cp('-r', src, thisDest);
        rm('-rf', src);
      }
    }
  }); // forEach(src)
  return '';
} // mv
module.exports = _mv;


/***/ }),
/* 907 */,
/* 908 */,
/* 909 */,
/* 910 */,
/* 911 */,
/* 912 */,
/* 913 */,
/* 914 */,
/* 915 */,
/* 916 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);

// add c spaces to the left of str
function lpad(c, str) {
  var res = '' + str;
  if (res.length < c) {
    res = Array((c - res.length) + 1).join(' ') + res;
  }
  return res;
}

common.register('uniq', _uniq, {
  canReceivePipe: true,
  cmdOptions: {
    'i': 'ignoreCase',
    'c': 'count',
    'd': 'duplicates',
  },
});

//@
//@ ### uniq([options,] [input, [output]])
//@ Available options:
//@
//@ + `-i`: Ignore case while comparing
//@ + `-c`: Prefix lines by the number of occurrences
//@ + `-d`: Only print duplicate lines, one for each group of identical lines
//@
//@ Examples:
//@
//@ ```javascript
//@ uniq('foo.txt');
//@ uniq('-i', 'foo.txt');
//@ uniq('-cd', 'foo.txt', 'bar.txt');
//@ ```
//@
//@ Filter adjacent matching lines from input
function _uniq(options, input, output) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!input && !pipe) common.error('no input given');

  var lines = (input ? fs.readFileSync(input, 'utf8') : pipe).
              trimRight().
              split(/\r*\n/);

  var compare = function (a, b) {
    return options.ignoreCase ?
           a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()) :
           a.localeCompare(b);
  };
  var uniqed = lines.reduceRight(function (res, e) {
    // Perform uniq -c on the input
    if (res.length === 0) {
      return [{ count: 1, ln: e }];
    } else if (compare(res[0].ln, e) === 0) {
      return [{ count: res[0].count + 1, ln: e }].concat(res.slice(1));
    } else {
      return [{ count: 1, ln: e }].concat(res);
    }
  }, []).filter(function (obj) {
                 // Do we want only duplicated objects?
    return options.duplicates ? obj.count > 1 : true;
  }).map(function (obj) {
                 // Are we tracking the counts of each line?
    return (options.count ? (lpad(7, obj.count) + ' ') : '') + obj.ln;
  }).join('\n') + '\n';

  if (output) {
    (new common.ShellString(uniqed)).to(output);
    // if uniq writes to output, nothing is passed to the next command in the pipeline (if any)
    return '';
  } else {
    return uniqed;
  }
}

module.exports = _uniq;


/***/ }),
/* 917 */,
/* 918 */,
/* 919 */
/***/ (function(module, __unusedexports, __webpack_require__) {

// Determine if version is greater than all the versions possible in the range.
const outside = __webpack_require__(970)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),
/* 920 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

var PERMS = (function (base) {
  return {
    OTHER_EXEC: base.EXEC,
    OTHER_WRITE: base.WRITE,
    OTHER_READ: base.READ,

    GROUP_EXEC: base.EXEC << 3,
    GROUP_WRITE: base.WRITE << 3,
    GROUP_READ: base.READ << 3,

    OWNER_EXEC: base.EXEC << 6,
    OWNER_WRITE: base.WRITE << 6,
    OWNER_READ: base.READ << 6,

    // Literal octal numbers are apparently not allowed in "strict" javascript.
    STICKY: parseInt('01000', 8),
    SETGID: parseInt('02000', 8),
    SETUID: parseInt('04000', 8),

    TYPE_MASK: parseInt('0770000', 8),
  };
}({
  EXEC: 1,
  WRITE: 2,
  READ: 4,
}));

common.register('chmod', _chmod, {
});

//@
//@ ### chmod([options,] octal_mode || octal_string, file)
//@ ### chmod([options,] symbolic_mode, file)
//@
//@ Available options:
//@
//@ + `-v`: output a diagnostic for every file processed//@
//@ + `-c`: like verbose but report only when a change is made//@
//@ + `-R`: change files and directories recursively//@
//@
//@ Examples:
//@
//@ ```javascript
//@ chmod(755, '/Users/brandon');
//@ chmod('755', '/Users/brandon'); // same as above
//@ chmod('u+x', '/Users/brandon');
//@ chmod('-R', 'a-w', '/Users/brandon');
//@ ```
//@
//@ Alters the permissions of a file or directory by either specifying the
//@ absolute permissions in octal form or expressing the changes in symbols.
//@ This command tries to mimic the POSIX behavior as much as possible.
//@ Notable exceptions:
//@
//@ + In symbolic modes, 'a-r' and '-r' are identical.  No consideration is
//@   given to the umask.
//@ + There is no "quiet" option since default behavior is to run silent.
function _chmod(options, mode, filePattern) {
  if (!filePattern) {
    if (options.length > 0 && options.charAt(0) === '-') {
      // Special case where the specified file permissions started with - to subtract perms, which
      // get picked up by the option parser as command flags.
      // If we are down by one argument and options starts with -, shift everything over.
      [].unshift.call(arguments, '');
    } else {
      common.error('You must specify a file.');
    }
  }

  options = common.parseOptions(options, {
    'R': 'recursive',
    'c': 'changes',
    'v': 'verbose',
  });

  filePattern = [].slice.call(arguments, 2);

  var files;

  // TODO: replace this with a call to common.expand()
  if (options.recursive) {
    files = [];
    filePattern.forEach(function addFile(expandedFile) {
      var stat = fs.lstatSync(expandedFile);

      if (!stat.isSymbolicLink()) {
        files.push(expandedFile);

        if (stat.isDirectory()) {  // intentionally does not follow symlinks.
          fs.readdirSync(expandedFile).forEach(function (child) {
            addFile(expandedFile + '/' + child);
          });
        }
      }
    });
  } else {
    files = filePattern;
  }

  files.forEach(function innerChmod(file) {
    file = path.resolve(file);
    if (!fs.existsSync(file)) {
      common.error('File not found: ' + file);
    }

    // When recursing, don't follow symlinks.
    if (options.recursive && fs.lstatSync(file).isSymbolicLink()) {
      return;
    }

    var stat = fs.statSync(file);
    var isDir = stat.isDirectory();
    var perms = stat.mode;
    var type = perms & PERMS.TYPE_MASK;

    var newPerms = perms;

    if (isNaN(parseInt(mode, 8))) {
      // parse options
      mode.split(',').forEach(function (symbolicMode) {
        var pattern = /([ugoa]*)([=\+-])([rwxXst]*)/i;
        var matches = pattern.exec(symbolicMode);

        if (matches) {
          var applyTo = matches[1];
          var operator = matches[2];
          var change = matches[3];

          var changeOwner = applyTo.indexOf('u') !== -1 || applyTo === 'a' || applyTo === '';
          var changeGroup = applyTo.indexOf('g') !== -1 || applyTo === 'a' || applyTo === '';
          var changeOther = applyTo.indexOf('o') !== -1 || applyTo === 'a' || applyTo === '';

          var changeRead = change.indexOf('r') !== -1;
          var changeWrite = change.indexOf('w') !== -1;
          var changeExec = change.indexOf('x') !== -1;
          var changeExecDir = change.indexOf('X') !== -1;
          var changeSticky = change.indexOf('t') !== -1;
          var changeSetuid = change.indexOf('s') !== -1;

          if (changeExecDir && isDir) {
            changeExec = true;
          }

          var mask = 0;
          if (changeOwner) {
            mask |= (changeRead ? PERMS.OWNER_READ : 0) + (changeWrite ? PERMS.OWNER_WRITE : 0) + (changeExec ? PERMS.OWNER_EXEC : 0) + (changeSetuid ? PERMS.SETUID : 0);
          }
          if (changeGroup) {
            mask |= (changeRead ? PERMS.GROUP_READ : 0) + (changeWrite ? PERMS.GROUP_WRITE : 0) + (changeExec ? PERMS.GROUP_EXEC : 0) + (changeSetuid ? PERMS.SETGID : 0);
          }
          if (changeOther) {
            mask |= (changeRead ? PERMS.OTHER_READ : 0) + (changeWrite ? PERMS.OTHER_WRITE : 0) + (changeExec ? PERMS.OTHER_EXEC : 0);
          }

          // Sticky bit is special - it's not tied to user, group or other.
          if (changeSticky) {
            mask |= PERMS.STICKY;
          }

          switch (operator) {
            case '+':
              newPerms |= mask;
              break;

            case '-':
              newPerms &= ~mask;
              break;

            case '=':
              newPerms = type + mask;

              // According to POSIX, when using = to explicitly set the
              // permissions, setuid and setgid can never be cleared.
              if (fs.statSync(file).isDirectory()) {
                newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
              }
              break;
            default:
              common.error('Could not recognize operator: `' + operator + '`');
          }

          if (options.verbose) {
            console.log(file + ' -> ' + newPerms.toString(8));
          }

          if (perms !== newPerms) {
            if (!options.verbose && options.changes) {
              console.log(file + ' -> ' + newPerms.toString(8));
            }
            fs.chmodSync(file, newPerms);
            perms = newPerms; // for the next round of changes!
          }
        } else {
          common.error('Invalid symbolic mode change: ' + symbolicMode);
        }
      });
    } else {
      // they gave us a full number
      newPerms = type + parseInt(mode, 8);

      // POSIX rules are that setuid and setgid can only be added using numeric
      // form, but not cleared.
      if (fs.statSync(file).isDirectory()) {
        newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
      }

      fs.chmodSync(file, newPerms);
    }
  });
  return '';
}
module.exports = _chmod;


/***/ }),
/* 921 */,
/* 922 */,
/* 923 */,
/* 924 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(622);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),
/* 925 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(622)
var minimatch = __webpack_require__(645)
var isAbsolute = __webpack_require__(159)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),
/* 926 */,
/* 927 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(745);
const enoent = __webpack_require__(759);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),
/* 928 */,
/* 929 */,
/* 930 */,
/* 931 */,
/* 932 */,
/* 933 */,
/* 934 */,
/* 935 */,
/* 936 */,
/* 937 */,
/* 938 */,
/* 939 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var concatMap = __webpack_require__(148);
var balanced = __webpack_require__(169);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),
/* 940 */,
/* 941 */,
/* 942 */,
/* 943 */,
/* 944 */,
/* 945 */,
/* 946 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


var childProcess = __webpack_require__(129);
var escapeStringRegexp = __webpack_require__(873);
var fs = __webpack_require__(793);
var path = __webpack_require__(622);
var shell = __webpack_require__(899);

var HAS_NATIVE_EXECSYNC = childProcess.hasOwnProperty('spawnSync');
var PATH_SEP = path.sep;
var RE_BRANCH = /^ref: refs\/heads\/(.*)\n/;

function _command(cmd, args) {
  var result;

  if (HAS_NATIVE_EXECSYNC) {
    result = childProcess.spawnSync(cmd, args);

    if (result.status !== 0) {
      throw new Error('[git-rev-sync] failed to execute command: ' + result.stderr + '/' + result.error);
    }

    return result.stdout.toString('utf8').replace(/^\s+|\s+$/g, '');
  }

  result = shell.exec(cmd + ' ' + args.join(' '), {silent: true});

  if (result.code !== 0) {
    throw new Error('[git-rev-sync] failed to execute command: ' + result.stdout);
  }

  return result.stdout.toString('utf8').replace(/^\s+|\s+$/g, '');
}

function _getGitDirectory(start) {
  if (start === undefined || start === null) {
    start = module.parent.filename;
  }

  if (typeof start === 'string') {
    start = start.split(PATH_SEP);
  }
  var gitRepoPath = start.join(PATH_SEP);
  var testPath = gitRepoPath;

  if (!testPath.length) {
    throw new Error('[git-rev-sync] no git repository found');
  }

  testPath = path.resolve(testPath, '.git');

  if (fs.existsSync(testPath)) {
    if (!fs.statSync(testPath).isDirectory()) {
      var parentRepoPath = fs.readFileSync(testPath, 'utf8').trim().split(' ').pop();

      if (!path.isAbsolute(parentRepoPath)) {
        parentRepoPath = path.resolve(gitRepoPath, parentRepoPath);
      }

      if (fs.existsSync(parentRepoPath)) {
        return path.resolve(parentRepoPath);
      }

      throw new Error('[git-rev-sync] could not find repository from path' + parentRepoPath);
    }

    return testPath;
  }

  start.pop();

  return _getGitDirectory(start);
}

function branch(dir) {
  var gitDir = _getGitDirectory(dir);

  var head = fs.readFileSync(path.resolve(gitDir, 'HEAD'), 'utf8');
  var b = head.match(RE_BRANCH);

  if (b) {
    return b[1];
  }

  return 'Detached: ' + head.trim();
}

function long(dir) {
  var b = branch(dir);

  if (/Detached: /.test(b)) {
    return b.substr(10);
  }

  var gitDir = _getGitDirectory(dir);
  var gitRootDir = gitDir.indexOf('.git/worktrees/') > 0 ?
    gitDir.replace(/\.git\/worktrees\/.+$/, '.git') :
    gitDir;
  var refsFilePath = path.resolve(gitRootDir, 'refs', 'heads', b);
  var ref;

  if (fs.existsSync(refsFilePath)) {
    ref = fs.readFileSync(refsFilePath, 'utf8');
  } else {
    // If there isn't an entry in /refs/heads for this branch, it may be that
    // the ref is stored in the packfile (.git/packed-refs). Fall back to
    // looking up the hash here.
    var refToFind = ['refs', 'heads', b].join('/');
    var packfileContents = fs.readFileSync(path.resolve(gitDir, 'packed-refs'), 'utf8');
    var packfileRegex = new RegExp('(.*) ' + escapeStringRegexp(refToFind));
    ref = packfileRegex.exec(packfileContents)[1];
  }

  return ref.trim();
}

function short(dir, len) {
  return long(dir).substr(0, len || 7);
}

function message() {
  return _command('git', ['log', '-1', '--pretty=%B']);
}

function tag(markDirty) {
  if (markDirty) {
    return _command('git', ['describe', '--always', '--tag', '--dirty', '--abbrev=0']);
  }

  return _command('git', ['describe', '--always', '--tag', '--abbrev=0']);
}

function tagFirstParent(markDirty) {
    if (markDirty) {
        return _command('git', ['describe', '--always', '--tag', '--dirty', '--abbrev=0', '--first-parent']);
    }

    return _command('git', ['describe', '--always', '--tag', '--abbrev=0', '--first-parent']);
}

function hasUnstagedChanges() {
  var writeTree = _command('git', ['write-tree']);
  return _command('git', ['diff-index', writeTree, '--']).length > 0;
}

function isDirty() {
  return _command('git', ['diff-index', 'HEAD', '--']).length > 0;
}

function isTagDirty() {
  try {
    _command('git', ['describe', '--exact-match', '--tags']);
  } catch (e) {
    if (e.message.indexOf('no tag exactly matches')) {
      return true;
    }

    throw e;
  }
  return false;
}

function remoteUrl() {
  return _command('git', ['ls-remote', '--get-url']);
}

function date() {
  return new Date(_command('git', ['log', '--no-color', '-n', '1', '--pretty=format:"%ad"']));
}

function count() {
  return parseInt(_command('git', ['rev-list', '--all', '--count']), 10);
}

function log() {
  throw new Error('not implemented');
}

module.exports = {
  branch : branch,
  count: count,
  date: date,
  hasUnstagedChanges: hasUnstagedChanges,
  isDirty: isDirty,
  isTagDirty: isTagDirty,
  log: log,
  long: long,
  message: message,
  remoteUrl: remoteUrl,
  short: short,
  tag: tag,
  tagFirstParent: tagFirstParent
};


/***/ }),
/* 947 */,
/* 948 */,
/* 949 */,
/* 950 */,
/* 951 */,
/* 952 */,
/* 953 */,
/* 954 */,
/* 955 */,
/* 956 */,
/* 957 */,
/* 958 */,
/* 959 */,
/* 960 */,
/* 961 */,
/* 962 */,
/* 963 */,
/* 964 */
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),
/* 965 */,
/* 966 */,
/* 967 */,
/* 968 */,
/* 969 */,
/* 970 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const Comparator = __webpack_require__(771)
const {ANY} = Comparator
const Range = __webpack_require__(262)
const satisfies = __webpack_require__(295)
const gt = __webpack_require__(872)
const lt = __webpack_require__(265)
const lte = __webpack_require__(74)
const gte = __webpack_require__(823)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),
/* 971 */,
/* 972 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(979)
var addHook = __webpack_require__(636)
var removeHook = __webpack_require__(582)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),
/* 973 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const SemVer = __webpack_require__(503)
const Range = __webpack_require__(262)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),
/* 974 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { createTokenAuth } = __webpack_require__(398);
const { Deprecation } = __webpack_require__(166);
const once = __webpack_require__(180);

const beforeRequest = __webpack_require__(495);
const requestError = __webpack_require__(821);
const validate = __webpack_require__(284);
const withAuthorizationPrefix = __webpack_require__(346);

const deprecateAuthBasic = once((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),
/* 975 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const outside = __webpack_require__(970)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),
/* 976 */
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),
/* 977 */,
/* 978 */,
/* 979 */
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),
/* 980 */,
/* 981 */,
/* 982 */,
/* 983 */,
/* 984 */,
/* 985 */,
/* 986 */
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(320);
var os = __webpack_require__(87);
var fs = __webpack_require__(747);

common.register('tempdir', _tempDir, {
  allowGlobbing: false,
  wrapOutput: false,
});

// Returns false if 'dir' is not a writeable directory, 'dir' otherwise
function writeableDir(dir) {
  if (!dir || !fs.existsSync(dir)) return false;

  if (!fs.statSync(dir).isDirectory()) return false;

  var testFile = dir + '/' + common.randomFileName();
  try {
    fs.writeFileSync(testFile, ' ');
    common.unlinkSync(testFile);
    return dir;
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}


//@
//@ ### tempdir()
//@
//@ Examples:
//@
//@ ```javascript
//@ var tmp = tempdir(); // "/tmp" for most *nix platforms
//@ ```
//@
//@ Searches and returns string containing a writeable, platform-dependent temporary directory.
//@ Follows Python's [tempfile algorithm](http://docs.python.org/library/tempfile.html#tempfile.tempdir).
function _tempDir() {
  var state = common.state;
  if (state.tempDir) return state.tempDir; // from cache

  state.tempDir = writeableDir(os.tmpdir && os.tmpdir()) || // node 0.10+
                  writeableDir(os.tmpDir && os.tmpDir()) || // node 0.8+
                  writeableDir(process.env.TMPDIR) ||
                  writeableDir(process.env.TEMP) ||
                  writeableDir(process.env.TMP) ||
                  writeableDir(process.env.Wimp$ScrapDir) || // RiscOS
                  writeableDir('C:\\TEMP') || // Windows
                  writeableDir('C:\\TMP') || // Windows
                  writeableDir('\\TEMP') || // Windows
                  writeableDir('\\TMP') || // Windows
                  writeableDir('/tmp') ||
                  writeableDir('/var/tmp') ||
                  writeableDir('/usr/tmp') ||
                  writeableDir('.'); // last resort

  return state.tempDir;
}
module.exports = _tempDir;


/***/ }),
/* 987 */,
/* 988 */,
/* 989 */,
/* 990 */,
/* 991 */,
/* 992 */,
/* 993 */,
/* 994 */,
/* 995 */,
/* 996 */,
/* 997 */
/***/ (function(module) {

module.exports = [
  'cat',
  'cd',
  'chmod',
  'cp',
  'dirs',
  'echo',
  'exec',
  'find',
  'grep',
  'head',
  'ln',
  'ls',
  'mkdir',
  'mv',
  'pwd',
  'rm',
  'sed',
  'set',
  'sort',
  'tail',
  'tempdir',
  'test',
  'to',
  'toEnd',
  'touch',
  'uniq',
  'which',
];


/***/ })
/******/ ],
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'loaded', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.l; }
/******/ 			});
/******/ 			Object.defineProperty(module, 'id', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.i; }
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);