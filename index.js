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
        

        s.define('type-set', function (size, factor) {
        //     font-size: unit(40px / root-font-size, 'rem')
        // line-height: remove-unit(vertical-unit / 40px) * 2
            var rootFontSize = getNodeAt(lookupLocal('root-font-size'), 0)
            var rootLineHeight = getNodeAt(lookupLocal('root-line-height'), 0)
            
            if (rootFontSize && rootLineHeight) {
                console.log(size.val / rootFontSize.val)
                console.log(factor.val)
                // var fontSize = new nodes.Property(['font-size'], );
                // var lineHeight = new nodes.Property(['line-height'], );
            
                // var block = this.closestBlock;

                // block.nodes.splice(block.index + 1, 0, lineHeight)
                // // block.index
                // return fontSize
            }
        });
    }
}

module.exports = plugin;