# grunt-preprocess [![Build Status](https://secure.travis-ci.org/onehealth/grunt-preprocess.png?branch=master)](http://travis-ci.org/onehealth/grunt-preprocess)

Grunt task around [preprocess](https://github.com/onehealth/preprocess) npm module

## What does it look like?

```html
<head>
  <title>Your App

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

#### inline
Type: `Boolean`
Default: `undefined

Required to enable overwriting of source files

#### context
Type: `Object`
Default: `{}`

The additional context on top of ENV that should be passed to templates


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
  js : {
    src : 'test/test.js',
    dest : 'test/test.processed.js'
  }
}
```


[grunt]: https://github.com/gruntjs/grunt

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

 - 3.0.1 Fixed issue arising from undefinedd options (#19)
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

Copyright OneHealth Solutions, Inc

Written by Jarrod Overson

Licensed under the Apache 2.0 license.
