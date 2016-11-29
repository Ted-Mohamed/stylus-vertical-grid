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
                var node = s.evaluator.stack[i].scope.lookup(varName)
            }
            return node;
        }
        
        function defineInStack(stack, name, node) {
            var scope = stack[stack.length - 1].scope
            var exp = new nodes.Expression()
            exp.push(node)
            var rootLineHeight = new nodes.Ident(name, exp)
            scope.add(rootLineHeight)
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
            factor = getNodeAt(factor, 0) || new nodes.Unit(1)
            if (rootLineHeight) {
                return new nodes.Unit(rootLineHeight.val * factor.val, 'rem')
            }
        }
        vr.raw = true

        function context(fontSize, lineHeight) {
            fontSize = getNodeAt(fontSize, 0)
            lineHeight = getNodeAt(lineHeight, 0)
            if ((fontSize.nodeName == "ident" || fontSize.nodeName == "string") && sizesMap[fontSize.string]) {
                lineHeight = sizesMap[fontSize.string][1]
                fontSize = sizesMap[fontSize.string][0]
            }

            lineHeight = lineHeight || new nodes.Unit(1)
            defineInStack(this.stack, 'root-font-size', fontSize)
            defineInStack(this.stack, 'root-line-height', lineHeight)
        }
        context.raw = true

        var sizesMap = {}
        function setupTypeSizes(map) {
            Object.keys(map.vals).forEach(function(key) {
                sizesMap[key] = map.vals[key].nodes  
            })
        }
        
        s.define('type-context', context) 
        s.define('setup-type-sizes', setupTypeSizes) 
        s.define('type-set', typeSet)
        s.define('vr', vr)
    }
}

module.exports = plugin;