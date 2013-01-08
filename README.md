# grunt-preprocess

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
Install this grunt plugin next to your project's [Gruntfile][getting_started] with: `npm install grunt-preprocess`

Then add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-preprocess');
```

## Configuration and Usage

grunt-preprocess is a Grunt Multi Task that takes your
standard source and destination and processes a template based
around environment configuration.


```js
preprocess : {
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
    files : [ 'processed/**/*.js' ],
    inline : true
  },
  js : {
    src : 'test/test.js',
    dest : 'test/test.js'
  }
}
```


[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

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
