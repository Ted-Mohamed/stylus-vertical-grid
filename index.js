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


        var typeSet = function (size, factor) {
            var rootFontSize = getNodeAt(lookupLocal('root-font-size'), 0)
            var rootLineHeight = getNodeAt(lookupLocal('root-line-height'), 0)

            size = size
            factor = factor || new nodes.Unit(1)
            
            if (size && rootFontSize && rootLineHeight) {
                var fontSize = new nodes.Property(['font-size'], new nodes.Unit(size.val / rootFontSize.val, 'rem'));
                var lineHeight = new nodes.Property(['line-height'], new nodes.Unit(rootLineHeight.val * rootFontSize.val * factor.val  / size.val));
            
                var block = this.closestBlock;

                block.nodes.splice(block.index + 1, 0, lineHeight)
                return fontSize
            }
        }

        typeSet.raw = true

        var vr = function (factor) {
            var rootLineHeight = getNodeAt(lookupLocal('root-line-height'), 0)
            var factor = arguments[0].nodes[0] || new nodes.Unit(1)
            factor = factor || new nodes.Unit(1)
            if (rootLineHeight) {
                return new nodes.Unit(rootLineHeight.val * factor.val, 'rem')
            }
        }

        vr.raw = true

        s.define('type-set', typeSet)
        s.define('vr', vr)
    }
}

module.exports = plugin;