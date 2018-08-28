import { Compiler, Context, SleetNode, Attribute, NodeType, AttributeGroup, SleetStack, AbstractCompiler } from 'sleet'

export class AttributeGroupCompiler extends AbstractCompiler<AttributeGroup> {
    static type = NodeType.AttributeGroup
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        return new AttributeGroupCompiler(node as AttributeGroup, stack)
    }

    compile (context: Context) {
        this.node.attributes.forEach((it, idx) => {
            const sub = context.compile(it, this.stack)
            if (!sub) return
            if (idx) context.push(' ')
            sub.mergeUp()
        })
    }
}

export class AttributeCompiler extends AbstractCompiler<Attribute> {
    static type = NodeType.Attribute
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        return new AttributeCompiler(node as Attribute, stack)
    }

    compile (context: Context) {
        let k = this.key(context)
        const v = this.value(context)

        if (!k) k = v
        context.push(k).push('="').push(v).push('"')
    }

    key (context: Context) {
        let result = ''
        if (this.node.namespace && this.node.name) result += this.node.namespace + ':'
        if (this.node.name) result += this.node.name
        return result
    }

    value (context: Context) {
        const vs = this.node.values.map(it => {
            const sub = context.compile(it, this.stack)
            return sub ? sub.getOutput() : ''
        })
        return this.node.name === 'class' ? vs.join(' ') : vs.join('')
    }
}
