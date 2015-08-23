/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module unist:util:modify-children
 * @fileoverview Test suite for `unist-util-modify-children`.
 */

'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var modifyChildren = require('./');

/*
 * Methods.
 */

var throws = assert.throws;
var equal = assert.strictEqual;
var deepEqual = assert.deepEqual;

/**
 * No-op.
 */
function noop() {}

noop();

/*
 * Tests.
 */

describe('modifyChildren()', function () {
    it('should throw when no `parent` is given', function () {
        throws(function () {
            modifyChildren(noop)();
        }, /Missing children in `parent`/);

        throws(function () {
            modifyChildren(noop)({});
        }, /Missing children in `parent`/);
    });

    it('should invoke `fn` for each child in `parent`', function () {
        var values = [0, 1, 2, 3];
        var context = {};
        var n = -1;

        context.children = values;

        modifyChildren(function (child, index, parent) {
            n++;
            equal(child, values[n]);
            equal(index, n);
            equal(parent, context);
        })(context);
    });

    it('should work when new children are added', function () {
        var values = [0, 1, 2, 3, 4, 5, 6];
        var n = -1;

        modifyChildren(function (child, index, parent) {
            n++;

            if (index < 3) {
                parent.children.push(parent.children.length);
            }

            equal(child, values[n]);
            equal(index, values[n]);
        })({
            'children': [0, 1, 2, 3]
        });
    });

    it('should skip forwards', function () {
        var values = [0, 1, 2, 3];
        var n = -1;
        var context = {};

        context.children = [0, 1, 3];

        modifyChildren(function (child, index, parent) {
            equal(child, values[++n]);

            if (child === 1) {
                parent.children.splice(index + 1, 0, 2);
                return index + 1;
            }
        })(context);

        deepEqual(context.children, values);
    });

    it('should skip backwards', function () {
        var invocations = [0, 1, -1, 0, 1, 2, 3];
        var n = -1;
        var context = {};
        var inserted;

        context.children = [0, 1, 2, 3];

        modifyChildren(function (child, index, parent) {
            equal(child, invocations[++n]);

            if (!inserted && child === 1) {
                inserted = true;
                parent.children.unshift(-1);
                return -1;
            }
        })(context);

        deepEqual(context.children, [-1, 0, 1, 2, 3]);
    });
});
