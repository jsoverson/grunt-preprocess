/*global define*/

define([], function () {
  "use strict";

  //@if globalOption='bar'
  bar();
  //@endif

  //@if globalOption='foo'
  foo();
  //@endif

});
