/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist').Node} Node
 *
 * @callback Modifier
 *   Callback called for each `child` in `parent` later given to `modify`.
 * @param {Node} node
 *   Child of `parent`.
 * @param {number} index
 *   Position of `child` in `parent`.
 * @param {Parent} parent
 *   Parent node.
 * @returns {number|void}
 *   Position to move to next.
 *
 * @callback Modify
 *   Modify children of `parent`.
 * @param {Parent} node
 *   Parent node.
 * @returns {void}
 *   Nothing.
 */

import {arrayIterate} from 'array-iterate'

/**
 * Wrap `modifier` to be called for each child in the nodes later given to
 * `modify`.
 *
 * @param {Modifier} modifier
 *   Callback called for each `child` in `parent` later given to `modify`.
 * @returns {Modify}
 *   Modify children of `parent`.
 */
export function modifyChildren(modifier) {
  return modify

  /** @type {Modify} */
  function modify(parent) {
    if (!parent || !parent.children) {
      throw new Error('Missing children in `parent` for `modifier`')
    }

    arrayIterate(parent.children, iteratee, parent)
  }

  /**
   * Pass the context as the third argument to `modifier`.
   *
   * @this {Parent}
   * @param {Node} node
   * @param {number} index
   */
  function iteratee(node, index) {
    return modifier(node, index, this)
  }
}
