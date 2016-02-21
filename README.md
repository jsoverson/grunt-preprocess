# grunt-preprocess
[![NPM][npm-image]][npm-url]

[![Linux Build Status][linux-ci-image]][linux-ci-url] [![dependencies][deps-image]][deps-url] [![dev-dependencies][dev-deps-image]][dev-deps-url]


Grunt task around [preprocess](https://github.com/jsoverson/preprocess) npm module

## What does it look like?

```html
<head>
  <title>Your App</title>

  <!-- @if NODE_ENV='production' -->
  <script src="some/production/lib/like/analytics.js"></script>
  <!-- @endif -->

</head>
<body>
  <!-- @ifdef DEBUG -->
  <h1>Debugging mode - <!-- @echo RELEASE_TAG --> </h1>
  <!-- @endif -->
  <p>
  <!-- @include welcome_message.txt -->
  </p>
</body>
```

```js
var configValue = '/* @echo FOO */' || 'default value';

// @ifdef DEBUG
someDebuggingCall()
// @endif

```

See preprocess documentation for more information


## Getting Started
Install this grunt plugin next to your project's Gruntfile with: `npm install --save-dev grunt-preprocess`

Then add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-preprocess');
```

## Options

#### context
Type: `Object`
Default: `{NODE_ENV: 'development'}`

The additional context on top of ENV that should be passed to templates. If NODE_ENV is not set, the task sets it to `development` by default.

#### inline
Type: `Boolean`
Default: `undefined`

Required to enable overwriting of source files

#### srcDir
Type: `String`
Default: `<path to source file to be processed>`

The directory where to look for files included via `@include` variants and `@extend`.

#### srcEol
Type: `String`
Default: EOL of source file or `os.EOL` if source file contains multiple different or no EOLs.

The end of line (EOL) character to use for the preprocessed result. May be one of:
 - `\r\n` - Windows
 - `\n` - Linux/OSX/Unix
 - `\r` - legacy Mac

#### type
Type: `String`
Default: file extension of the file to be processed 

The syntax type of source file to preprocess. See [preprocess() description](https://github.com/jsoverson/preprocess#optionstype) for a list of all supported file types.

## Example Usage

```js
preprocess : {
  options: {
    context : {
      DEBUG: true
    }
  },
  html : {
    src : 'test/test.html',
    dest : 'test/test.processed.html'
  },
  js : {
    src : 'test/test.js',
    dest : 'test/test.processed.js'
  },
  multifile : {
    files : {
      'test/test.processed.html' : 'test/test.html',
      'test/test.processed.js'   : 'test/test.js'
    }
  },
  inline : {
    src : [ 'processed/**/*.js' ],
    options: {
      inline : true,
      context : {
        DEBUG: false
      }
    }
  },
  all_from_dir: {
    src: '**/*.tmpl',
    ext: '.html',
    cwd: 'src',
    dest: 'build',
    expand: true
  }
}
```


[grunt]: https://github.com/gruntjs/grunt

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

 - 5.1.0
    - Grunt peer dependency tagged >= 0.4.0, dependency updates
    - added explicit dependency on lodash
    - added logging for preprocess errors (@marcominetti, #53)
 - 5.0.1 fixed processing of mutifile-style tasks for multiple different file extensions or different containing directories (#50)
 - 5.0.0 bumped preprocess dep to 3.0.2, implemented backward-compatible mapping of old to new options and pass-through for new options (#34, #39, #48)
 - 4.2.0 bumped preprocess dep to 2.3.1, bumped dev dependencies
 - 4.1.0 bumped preprocess dep to 2.1.0
 - 4.0.0 Switched order of context assignment, small change but necessitated major version
 - 3.0.1 Fixed issue arising from undefined options (#19)
 - 3.0.0 Updated dependencies, added merge from global options context to subtask context (#13)
 - 2.3.0 Updated preprocess, changes default handling to html
 - 2.2.0 Delegating to grunt's file.read/write for consistent usage within grunt (e.g. deep writes)
 - 2.1.0 updated preprocess dependency
 - 2.0.0 updated for grunt 0.4.0, moved context override to `context` option
 - 1.3.0 Moved logic to 'preprocess' npm module
 - 1.2.1 Added @include to include external files
 - 1.2.0 Added @include to include external files
 - 1.1.0 Added ability to process multiple destinations in a files block
 - 1.0.0 Changed syntax, added directives
 - 0.4.0 Added support for inline JS directives
 - 0.3.0 Added insert, extended context to all environment
 - 0.2.0 Added simple directive syntax
 - 0.1.0 Initial release

## License

Written by Jarrod Overson

Licensed under the Apache 2.0 license.

[npm-image]: https://nodei.co/npm/grunt-preprocess.png?downloads=true
[npm-url]: https://www.npmjs.com/package/grunt-preprocess
[linux-ci-image]: https://img.shields.io/travis/jsoverson/grunt-preprocess/master.svg?style=flat-square
[linux-ci-url]: https://travis-ci.org/jsoverson/grunt-preprocess
[deps-image]: https://img.shields.io/david/jsoverson/grunt-preprocess.svg?style=flat-square
[deps-url]: https://david-dm.org/jsoverson/grunt-preprocess
[dev-deps-image]: https://img.shields.io/david/dev/jsoverson/grunt-preprocess.svg?style=flat-square
[dev-deps-url]: https://david-dm.org/jsoverson/grunt-preprocess#info=devDependencies
