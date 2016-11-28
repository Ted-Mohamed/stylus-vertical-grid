var stylus = require('stylus'),
    nodes = stylus.nodes,
    utils = stylus.utils;

var plugin = function () {

    return function (s) {
        function getNodeAt(input, index) {
          return input && input.nodes && input.nodes[index];
        }

        function lookupLocal(varName) {
            var i = s.evaluator.stack.length;
            while (i-- && !node) {
                var node = s.evaluator.stack[i].lookup(varName);
            }
            return node;
        }
        
        function verticalUnit(rootLineHeight, rootFontSize, factor) {
            return rootLineHeight * rootFontSize * factor
        }

        s.define('type-set', function (size, factor) {
            var rootFontSize = getNodeAt(lookupLocal('root-font-size'), 0)
            var rootLineHeight = getNodeAt(lookupLocal('root-line-height'), 0)
            factor = factor || 1

            if (rootFontSize && rootLineHeight) {
                var fontSize = new nodes.Property(['font-size'], new nodes.Unit(size.val / rootFontSize.val, 'rem'));
                var lineHeight = new nodes.Property(['line-height'], new nodes.Unit(verticalUnit(rootLineHeight.val, rootFontSize.val, factor.val)  / size.val, 'rem'));
            
                var block = this.closestBlock;

                block.nodes.splice(block.index + 1, 0, lineHeight)
                return fontSize
            }
        })

        s.define('vr', function (factor) {
            var rootFontSize = getNodeAt(lookupLocal('root-font-size'), 0)
            var rootLineHeight = getNodeAt(lookupLocal('root-line-height'), 0)
            factor = factor || 1

            if (rootFontSize && rootLineHeight) {
                return new nodes.Unit(verticalUnit(rootLineHeight.val, rootFontSize.val, factor.val), 'rem')
            }
        })
    }
}

module.exports = plugin;