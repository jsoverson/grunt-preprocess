# grunt-preprocess

Preprocess files based off environment configuration

## Getting Started
Install this grunt plugin next to your project's [Gruntfile][getting_started] with: `npm install grunt-preprocess`

Then add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-preprocess');
```

## Configuration and Usage

grunt-preprocess is a Multi Task directive that takes your
standard source and destination and processes a template based
around environment

```js
preprocess : {
  html : {
    src : 'test/test.html',
    dest : 'test/test.processed.html'
  },
  js : {
    src : 'test/test.js',
    dest : 'test/test.js'
  }
}
```

## Directive syntax

### HTML Syntax
```html
<body>
    <!-- exclude env='production' -->
    <header>Your on dev!</header>
    <!-- endexclude -->

    <!-- include env='production' -->
    <script src="some/production/javascript.js"></script>
    <!-- endinclude -->
</head>
```

With a NODE_ENV set to 'production' this will be built to look like

```html
<body>
    <script src="some/production/javascript.js"></script>
</head>
```

With NODE_ENV not set or set to dev, the built file will be

```html
<body>
    <header>Your on dev!</header>
</head>
```


### JavaScript Syntax

```js
normalFunction();
//exclude env='production'
superExpensiveDebugFunction()
//endexclude

anotherFunction();
```

Built with a NODE_ENV of production :

```js
normalFunction();

anotherFunction();
```


[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History

 - 0.1.0 Initial release

## License

Copyright OneHealth Solutions, Inc

Written by Jarrod Overson

Licensed under the Apache 2.0 license.
