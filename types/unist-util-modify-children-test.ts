import {Node} from 'unist'

import unified = require('unified')

import * as modifyChildren from 'unist-util-modify-children'

const node: Node = {
  type: 'root',
  children: [
    {type: 'leaf', value: '1'},
    {type: 'leaf', children: [{type: 'leaf', value: '2'}]},
    {type: 'leaf', value: '3'}
  ]
}

// $ExpectType Modify
modifyChildren((node, index) => index + 1)

// $ExpectType Modify
modifyChildren(() => {})

// $ExpectError
modifyChildren(() => '')

// $ExpectType void
modifyChildren((node, index) => index + 1)(node)

// Usable in unified transform
unified().use(() => tree => {
  const modify = modifyChildren((node, index, parent) => {
    if (node.type === 'node') {
      parent.children.splice(index, 1, {
        type: 'subtree',
        children: node.children
      })
      return index + 1
    }
  })

  modify(tree)

  return tree
})
