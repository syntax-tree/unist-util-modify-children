import {arrayIterate} from 'array-iterate'

// Turn `callback` into a child-modifier accepting a parent.  See
// `array-iterate` for more info.
export function modifyChildren(callback) {
  return iterator

  function iterator(parent) {
    if (!parent || !parent.children) {
      throw new Error('Missing children in `parent` for `modifier`')
    }

    arrayIterate(parent.children, iteratee, parent)
  }

  // Pass the context as the third argument to `callback`.
  function iteratee(value, index) {
    return callback(value, index, this)
  }
}
