import {expectError, expectType} from 'tsd'
import {Node} from 'unist'

import * as modifyChildren from '.'

const node: Node = {
  type: 'root',
  children: [
    {type: 'leaf', value: '1'},
    {type: 'leaf', children: [{type: 'leaf', value: '2'}]},
    {type: 'leaf', value: '3'}
  ]
}

expectType<modifyChildren.Modify>(
  modifyChildren(function(node, index) {
    return index + 1
  })
)

expectType<modifyChildren.Modify>(modifyChildren(function() {}))

expectError(
  modifyChildren(function() {
    return ''
  })
)

expectType<undefined>(
  modifyChildren(function(node, index) {
    return index + 1
  })(node)
)
