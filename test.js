/**
 * @typedef {import('unist').Literal<number>} ExampleLiteral
 * @typedef {import('unist').Parent<ExampleLiteral>} ExampleParent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {modifyChildren} from './index.js'

function noop() {}

test('modifyChildren()', () => {
  assert.throws(
    () => {
      // @ts-expect-error runtime.
      modifyChildren(noop)()
    },
    /Missing children in `parent`/,
    'should throw without node'
  )

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      modifyChildren(noop)({})
    },
    /Missing children in `parent`/,
    'should throw without parent'
  )
})

test('should call `fn` for each child in `parent`', () => {
  const children = [
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: 2},
    {type: 'x', value: 3}
  ]
  const context = {type: 'y', children}
  let n = -1

  modifyChildren((child, index, parent) => {
    n++
    assert.strictEqual(child, children[n])
    assert.strictEqual(index, n)
    assert.strictEqual(parent, context)
  })(context)
})

test('should work when new children are added', () => {
  const children = [
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: 2},
    {type: 'x', value: 3},
    {type: 'x', value: 4},
    {type: 'x', value: 5},
    {type: 'x', value: 6}
  ]
  let n = -1

  modifyChildren((child, index, parent) => {
    n++

    if (index < 3) {
      parent.children.push(
        /** @type {ExampleLiteral} */ ({
          type: 'x',
          value: parent.children.length
        })
      )
    }

    assert.deepEqual(child, children[n])
    assert.deepEqual(index, n)
  })(
    /** @type {ExampleParent} */ ({
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 2},
        {type: 'x', value: 3}
      ]
    })
  )
})

test('should skip forwards', () => {
  const children = [
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: 2},
    {type: 'x', value: 3}
  ]
  let n = -1
  const context = {
    type: 'y',
    children: [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 3}
    ]
  }

  modifyChildren((child, index, parent) => {
    assert.deepEqual(child, children[++n])

    if (child.value === 1) {
      parent.children.splice(
        index + 1,
        0,
        /** @type {ExampleLiteral} */ ({type: 'x', value: 2})
      )
      return index + 1
    }
  })(context)

  assert.deepEqual(context.children, children)
})

test('should skip backwards', () => {
  const calls = [
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: -1},
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: 2},
    {type: 'x', value: 3}
  ]
  let n = -1
  const context = {
    type: 'y',
    children: [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
  }
  let inserted = false

  modifyChildren((child, _, parent) => {
    assert.deepEqual(child, calls[++n])

    if (!inserted && child.value === 1) {
      inserted = true
      parent.children.unshift(
        /** @type {ExampleLiteral} */ ({type: 'x', value: -1})
      )
      return -1
    }
  })(context)

  assert.deepEqual(context.children, [
    {type: 'x', value: -1},
    {type: 'x', value: 0},
    {type: 'x', value: 1},
    {type: 'x', value: 2},
    {type: 'x', value: 3}
  ])
})
