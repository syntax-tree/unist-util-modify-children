/**
 * @typedef {import('unist').Literal<number>} ExampleLiteral
 * @typedef {import('unist').Parent<ExampleLiteral>} ExampleParent
 */

import test from 'tape'
import {modifyChildren} from './index.js'

function noop() {}

test('modifyChildren()', function (t) {
  t.throws(
    function () {
      // @ts-expect-error runtime.
      modifyChildren(noop)()
    },
    /Missing children in `parent`/,
    'should throw without node'
  )

  t.throws(
    function () {
      // @ts-expect-error runtime.
      modifyChildren(noop)({})
    },
    /Missing children in `parent`/,
    'should throw without parent'
  )

  t.test('should invoke `fn` for each child in `parent`', function (st) {
    var children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    var context = {type: 'y', children}
    var n = -1

    modifyChildren(function (child, index, parent) {
      n++
      st.strictEqual(child, children[n])
      st.strictEqual(index, n)
      st.strictEqual(parent, context)
    })(context)

    st.end()
  })

  t.test('should work when new children are added', function (st) {
    var children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3},
      {type: 'x', value: 4},
      {type: 'x', value: 5},
      {type: 'x', value: 6}
    ]
    var n = -1

    modifyChildren(function (
      /** @type {ExampleLiteral} */ child,
      index,
      /** @type {ExampleParent} */ parent
    ) {
      n++

      if (index < 3) {
        parent.children.push({type: 'x', value: parent.children.length})
      }

      st.deepEqual(child, children[n])
      st.deepEqual(index, n)
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

    st.end()
  })

  t.test('should skip forwards', function (st) {
    var children = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    var n = -1
    var context = {
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 3}
      ]
    }

    modifyChildren(function (
      /** @type {ExampleLiteral} */ child,
      index,
      /** @type {ExampleParent} */ parent
    ) {
      st.deepEqual(child, children[++n])

      if (child.value === 1) {
        parent.children.splice(index + 1, 0, {type: 'x', value: 2})
        return index + 1
      }
    })(context)

    st.deepEqual(context.children, children)

    st.end()
  })

  t.test('should skip backwards', function (st) {
    var calls = [
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: -1},
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ]
    var n = -1
    var context = {
      type: 'y',
      children: [
        {type: 'x', value: 0},
        {type: 'x', value: 1},
        {type: 'x', value: 2},
        {type: 'x', value: 3}
      ]
    }
    var inserted = false

    modifyChildren(function (
      /** @type {ExampleLiteral} */ child,
      _,
      /** @type {ExampleParent} */ parent
    ) {
      st.deepEqual(child, calls[++n])

      if (!inserted && child.value === 1) {
        inserted = true
        parent.children.unshift({type: 'x', value: -1})
        return -1
      }
    })(context)

    st.deepEqual(context.children, [
      {type: 'x', value: -1},
      {type: 'x', value: 0},
      {type: 'x', value: 1},
      {type: 'x', value: 2},
      {type: 'x', value: 3}
    ])

    st.end()
  })

  t.end()
})
