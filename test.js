/**
 * @typedef {import('unist').Literal<number>} ExampleLiteral
 * @typedef {import('unist').Parent<ExampleLiteral>} ExampleParent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {modifyChildren} from 'unist-util-modify-children'

function noop() {}

test('modifyChildren', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('unist-util-modify-children')).sort(),
      ['modifyChildren']
    )
  })

  await t.test('should throw without node', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that a runtime error is thrown.
      modifyChildren(noop)()
    }, /Missing children in `parent`/)
  })

  await t.test('should throw without parent', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that a runtime error is thrown.
      modifyChildren(noop)({})
    }, /Missing children in `parent`/)
  })

  await t.test('should call `fn` for each child in `parent`', function () {
    const children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    /** @type {ExampleParent} */
    const context = {type: 'y', children}
    let n = -1

    modifyChildren(function (child, index, parent) {
      n++
      assert.strictEqual(child, children[n])
      assert.strictEqual(index, n)
      assert.strictEqual(parent, context)
      return undefined
    })(context)
  })

  await t.test('should work when new children are added', function () {
    const children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3},
      {type: 'x', value: 4},
      {type: 'x', value: 5},
      {type: 'x', value: 6}
    ]
    /** @type {ExampleParent} */
    const parent = {
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 2},
        {type: 'x', value: 3}
      ]
    }
    let n = -1

    modifyChildren(
      /**
       * @param {ExampleLiteral} child
       * @param {ExampleParent} parent
       */
      function (child, index, parent) {
        n++

        if (index < 3) {
          parent.children.push({type: 'x', value: parent.children.length})
        }

        assert.deepEqual(child, children[n])
        assert.deepEqual(index, n)
        return undefined
      }
    )(parent)
  })

  await t.test('should skip forwards', function () {
    const children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    const context = {
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 3}
      ]
    }
    let n = -1

    modifyChildren(
      /**
       * @param {ExampleLiteral} child
       * @param {ExampleParent} parent
       */
      function (child, index, parent) {
        assert.deepEqual(child, children[++n])

        if (child.value === 1) {
          parent.children.splice(index + 1, 0, {type: 'x', value: 2})
          return index + 1
        }
      }
    )(context)

    assert.deepEqual(context.children, children)
  })

  await t.test('should skip backwards', function () {
    const calls = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: -1},
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    const context = {
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 2},
        {type: 'x', value: 3}
      ]
    }
    let n = -1
    let inserted = false

    modifyChildren(
      /**
       * @param {ExampleLiteral} child
       * @param {ExampleParent} parent
       */
      function (child, _, parent) {
        assert.deepEqual(child, calls[++n])

        if (!inserted && child.value === 1) {
          inserted = true
          parent.children.unshift({type: 'x', value: -1})
          return -1
        }
      }
    )(context)

    assert.deepEqual(context.children, [
      {type: 'x', value: -1},
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ])
  })
})
