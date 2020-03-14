// TypeScript Version: 3.5

import {Node, Parent} from 'unist'

declare namespace unistUtilModifyChildren {
  type Modifier = (
    node: Node,
    index: number,
    parent: Parent
  ) => number | void

  type Modify = (tree: Node) => void
}

declare function unistUtilModifyChildren(
  modifier: unistUtilModifyChildren.Modifier
): unistUtilModifyChildren.Modify

export = unistUtilModifyChildren
