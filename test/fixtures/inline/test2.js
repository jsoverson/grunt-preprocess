/*global define*/

define([], function () {
  "use strict";

  //@exclude NODE_ENV='production'
  foo2()
  //@endexclude

  //@if NODE_ENV='production'
  foo2()
  //@endif

  /*@include include.txt */

});
