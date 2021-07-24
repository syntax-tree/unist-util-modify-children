/**
 * @typedef {import('unist').Literal<number>} ExampleLiteral
 * @typedef {import('unist').Parent<ExampleLiteral>} ExampleParent
 */

import test from 'tape'
import {modifyChildren} from './index.js'

function noop() {}

test('modifyChildren()', (t) => {
  t.throws(
    () => {
      // @ts-expect-error runtime.
      modifyChildren(noop)()
    },
    /Missing children in `parent`/,
    'should throw without node'
  )

  t.throws(
    () => {
      // @ts-expect-error runtime.
      modifyChildren(noop)({})
    },
    /Missing children in `parent`/,
    'should throw without parent'
  )

  t.test('should invoke `fn` for each child in `parent`', (st) => {
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
      st.strictEqual(child, children[n])
      st.strictEqual(index, n)
      st.strictEqual(parent, context)
    })(context)

    st.end()
  })

  t.test('should work when new children are added', (st) => {
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

  t.test('should skip forwards', (st) => {
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
      st.deepEqual(child, children[++n])

      // @ts-expect-error: literal.
      if (child.value === 1) {
        parent.children.splice(
          index + 1,
          0,
          /** @type {ExampleLiteral} */ ({type: 'x', value: 2})
        )
        return index + 1
      }
    })(context)

    st.deepEqual(context.children, children)

    st.end()
  })

  t.test('should skip backwards', (st) => {
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
      st.deepEqual(child, calls[++n])

      // @ts-expect-error: literal.
      if (!inserted && child.value === 1) {
        inserted = true
        parent.children.unshift(
          /** @type {ExampleLiteral} */ ({type: 'x', value: -1})
        )
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
