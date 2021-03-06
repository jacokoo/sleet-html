"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleet_1 = require("sleet");
class AttributeGroupCompiler extends sleet_1.AbstractCompiler {
    static create(node, stack) {
        return new AttributeGroupCompiler(node, stack);
    }
    compile(context) {
        this.node.attributes.forEach((it, idx) => {
            const sub = context.compile(it, this.stack);
            if (!sub)
                return;
            if (idx)
                context.push(' ');
            sub.mergeUp();
        });
    }
}
AttributeGroupCompiler.type = sleet_1.NodeType.AttributeGroup;
exports.AttributeGroupCompiler = AttributeGroupCompiler;
class AttributeCompiler extends sleet_1.AbstractCompiler {
    static create(node, stack) {
        return new AttributeCompiler(node, stack);
    }
    compile(context) {
        let k = this.key(context);
        const v = this.value(context);
        if (!k)
            k = v;
        context.push(k).push('="').push(v).push('"');
    }
    key(context) {
        let result = '';
        if (this.node.namespace && this.node.name)
            result += this.node.namespace + ':';
        if (this.node.name)
            result += this.node.name;
        return result;
    }
    value(context) {
        const vs = this.node.values.map(it => {
            const sub = context.compile(it, this.stack);
            return sub ? sub.getOutput() : '';
        });
        return this.node.name === 'class' ? vs.join(' ') : vs.join('');
    }
}
AttributeCompiler.type = sleet_1.NodeType.Attribute;
exports.AttributeCompiler = AttributeCompiler;
