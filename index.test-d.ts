import {expectError, expectType} from 'tsd'
import type {Literal, Parent} from 'unist'
import {modifyChildren} from './index.js'

/* Setup */
const sampleTree: Root = {
  type: 'root',
  children: [{type: 'heading', depth: 1, children: []}]
}

type Content = Flow | Phrasing

interface Root extends Parent {
  type: 'root'
  children: Flow[]
}

type Flow = Blockquote | Heading | Paragraph

interface Blockquote extends Parent {
  type: 'blockquote'
  children: Flow[]
}

interface Heading extends Parent {
  type: 'heading'
  depth: number
  children: Phrasing[]
}

interface Paragraph extends Parent {
  type: 'paragraph'
  children: Phrasing[]
}

type Phrasing = Text | Emphasis

interface Emphasis extends Parent {
  type: 'emphasis'
  children: Phrasing[]
}

interface Text extends Literal {
  type: 'text'
  value: string
}

/* Missing params. */
expectError(modifyChildren())

modifyChildren(function (node, _, parent: Emphasis) {
  expectType<Phrasing>(node)
  return undefined
})

modifyChildren(function (node, _, parent: Root) {
  expectType<Flow>(node)
  return undefined
})
