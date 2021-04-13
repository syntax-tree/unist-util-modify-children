import test from 'tape'
import {modifyChildren} from './index.js'

var noop = Function.prototype

test('modifyChildren()', function (t) {
  t.throws(
    function () {
      modifyChildren(noop)()
    },
    /Missing children in `parent`/,
    'should throw without node'
  )

  t.throws(
    function () {
      modifyChildren(noop)({})
    },
    /Missing children in `parent`/,
    'should throw without parent'
  )

  t.test('should invoke `fn` for each child in `parent`', function (st) {
    var values = [0, 1, 2, 3]
    var context = {}
    var n = -1

    context.children = values

    modifyChildren(function (child, index, parent) {
      n++
      st.strictEqual(child, values[n])
      st.strictEqual(index, n)
      st.strictEqual(parent, context)
    })(context)

    st.end()
  })

  t.test('should work when new children are added', function (st) {
    var values = [0, 1, 2, 3, 4, 5, 6]
    var n = -1

    modifyChildren(function (child, index, parent) {
      n++

      if (index < 3) {
        parent.children.push(parent.children.length)
      }

      st.strictEqual(child, values[n])
      st.strictEqual(index, values[n])
    })({children: [0, 1, 2, 3]})

    st.end()
  })

  t.test('should skip forwards', function (st) {
    var values = [0, 1, 2, 3]
    var n = -1
    var context = {}

    context.children = [0, 1, 3]

    modifyChildren(function (child, index, parent) {
      st.strictEqual(child, values[++n])

      if (child === 1) {
        parent.children.splice(index + 1, 0, 2)
        return index + 1
      }
    })(context)

    st.deepEqual(context.children, values)

    st.end()
  })

  t.test('should skip backwards', function (st) {
    var invocations = [0, 1, -1, 0, 1, 2, 3]
    var n = -1
    var context = {}
    var inserted

    context.children = [0, 1, 2, 3]

    modifyChildren(function (child, index, parent) {
      st.strictEqual(child, invocations[++n])

      if (!inserted && child === 1) {
        inserted = true
        parent.children.unshift(-1)
        return -1
      }
    })(context)

    st.deepEqual(context.children, [-1, 0, 1, 2, 3])

    st.end()
  })

  t.end()
})
