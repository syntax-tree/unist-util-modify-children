/**
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
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
    /** @type {Array<PhrasingContent>} */
    const children = [
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '2'},
      {type: 'text', value: '3'}
    ]
    /** @type {Emphasis} */
    const context = {type: 'emphasis', children}
    let n = -1

    modifyChildren(function (child, index, parent) {
      n++
      assert.strictEqual(child, children[n])
      assert.strictEqual(index, n)
      assert.strictEqual(parent, context)
    })(context)
  })

  await t.test('should work when new children are added', function () {
    /** @type {Array<PhrasingContent>} */
    const children = [
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '2'},
      {type: 'text', value: '3'},
      {type: 'text', value: '4'},
      {type: 'text', value: '5'},
      {type: 'text', value: '6'}
    ]
    /** @type {Emphasis} */
    const parent = {
      type: 'emphasis',
      children: [
        {type: 'text', value: '0'},
        {type: 'text', value: '1'},
        {type: 'text', value: '2'},
        {type: 'text', value: '3'}
      ]
    }
    let n = -1

    modifyChildren(
      /**
       * @param {PhrasingContent} child
       * @param {Emphasis} parent
       */
      function (child, index, parent) {
        n++

        if (index < 3) {
          parent.children.push({
            type: 'text',
            value: String(parent.children.length)
          })
        }

        assert.deepEqual(child, children[n])
        assert.deepEqual(index, n)
      }
    )(parent)
  })

  await t.test('should skip forwards', function () {
    /** @type {Array<PhrasingContent>} */
    const children = [
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '2'},
      {type: 'text', value: '3'}
    ]
    /** @type {Emphasis} */
    const context = {
      type: 'emphasis',
      children: [
        {type: 'text', value: '0'},
        {type: 'text', value: '1'},
        {type: 'text', value: '3'}
      ]
    }
    let n = -1

    modifyChildren(
      /**
       * @param {PhrasingContent} child
       * @param {Emphasis} parent
       */
      function (child, index, parent) {
        assert.deepEqual(child, children[++n])

        if ('value' in child && child.value === '1') {
          parent.children.splice(index + 1, 0, {type: 'text', value: '2'})
          return index + 1
        }
      }
    )(context)

    assert.deepEqual(context.children, children)
  })

  await t.test('should skip backwards', function () {
    const calls = [
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '-1'},
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '2'},
      {type: 'text', value: '3'}
    ]
    /** @type {Emphasis} */
    const context = {
      type: 'emphasis',
      children: [
        {type: 'text', value: '0'},
        {type: 'text', value: '1'},
        {type: 'text', value: '2'},
        {type: 'text', value: '3'}
      ]
    }
    let n = -1
    let inserted = false

    modifyChildren(
      /**
       * @param {PhrasingContent} child
       * @param {Emphasis} parent
       */
      function (child, _, parent) {
        assert.deepEqual(child, calls[++n])

        if (!inserted && 'value' in child && child.value === '1') {
          inserted = true
          parent.children.unshift({type: 'text', value: '-1'})
          return -1
        }
      }
    )(context)

    assert.deepEqual(context.children, [
      {type: 'text', value: '-1'},
      {type: 'text', value: '0'},
      {type: 'text', value: '1'},
      {type: 'text', value: '2'},
      {type: 'text', value: '3'}
    ])
  })
})
