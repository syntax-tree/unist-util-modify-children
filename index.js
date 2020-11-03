'use strict'

var iterate = require('array-iterate')

module.exports = modifierFactory

// Turn `callback` into a child-modifier accepting a parent.  See
// `array-iterate` for more info.
function modifierFactory(callback) {
  return iterator

  function iterator(parent) {
    if (!parent || !parent.children) {
      throw new Error('Missing children in `parent` for `modifier`')
    }

    iterate(parent.children, iteratee, parent)
  }

  // Pass the context as the third argument to `callback`.
  function iteratee(value, index) {
    return callback(value, index, this)
  }
}
