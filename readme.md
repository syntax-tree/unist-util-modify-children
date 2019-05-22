# unist-util-modify-children

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Modify direct children of a parent.

## Installation

[npm][]:

```bash
npm install unist-util-modify-children
```

## Usage

```javascript
var remark = require('remark')
var modifyChildren = require('unist-util-modify-children')

var doc = remark()
  .use(plugin)
  .process('This _and_ that')

console.log(String(doc))

function plugin() {
  return transformer
  function transformer(tree) {
    modifyChildren(modifier)(tree.children[0])
  }
}

function modifier(node, index, parent) {
  if (node.type === 'emphasis') {
    parent.children.splice(index, 1, {type: 'strong', children: node.children})
    return index + 1
  }
}
```

Yields:

```js
This **and** that
```

## API

### `modify = modifyChildren(modifier)`

Wrap [`modifier`][modifier] to be invoked for each child in the node given to
[`modify`][modify].

#### `next? = modifier(child, index, parent)`

Invoked if [`modify`][modify] is called on a parent node for each `child`
in `parent`.

###### Returns

`number` (optional) — Next position to iterate.

#### `function modify(parent)`

Invoke the bound [`modifier`][modifier] for each child in `parent`
([`Node`][node]).

## Contribute

See [`contributing.md` in `syntax-tree/unist`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-modify-children.svg

[build]: https://travis-ci.org/syntax-tree/unist-util-modify-children

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-modify-children.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-modify-children

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-modify-children.svg

[downloads]: https://www.npmjs.com/package/unist-util-modify-children

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-modify-children.svg

[size]: https://bundlephobia.com/result?p=unist-util-modify-children

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[node]: https://github.com/syntax-tree/unist#node

[modifier]: #next--modifierchild-index-parent

[modify]: #function-modifyparent

[contributing]: https://github.com/syntax-tree/unist/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/unist/blob/master/code-of-conduct.md
