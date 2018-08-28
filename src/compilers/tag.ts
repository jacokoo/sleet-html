import {
    Context, Compiler, Location, NodeType, SleetNode, Tag,
    Attribute, StringValue, AttributeGroup, SleetStack, AbstractCompiler
} from 'sleet'

export class TagCompiler extends AbstractCompiler<Tag> {
    static type = NodeType.Tag
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        return new TagCompiler(node as Tag, stack)
    }

    compile (context: Context, ...others: SleetNode[]) {
        this.tagOpen(context)
        this.content(context)
        this.tagClose(context)
    }

    tagOpen (context: Context) {
        this.openStart(context)
        this.attributes(context)
        this.openEnd(context)
    }

    openStart (context: Context) {
        context.eol().indent().push('<')
        if (this.node.namespace) {
            context.push(this.node.namespace).push(':')
        }
        context.push(this.node.name || 'div')
    }

    attributes (context: Context) {
        const groups = this.mergeAttributeGroup(context, ...[this.dotsAndHash()].concat(this.node.attributeGroups))
        if (groups.length) context.push(' ')
        groups.forEach((it, idx) => {
            const sub = context.compile(it, this.stack)

            if (sub) {
                if (idx) context.push(' ')
                sub.mergeUp()
            }
        })
    }

    openEnd (context: Context) {
        context.push('>')
    }

    content (context: Context) {
        if (this.selfClosing()) return
        this.node.children.forEach(it => context.compileUp(it, this.stack))
    }

    tagClose (context: Context) {
        if (this.selfClosing()) return
        if (context.haveIndent) context.eol().indent()
        context.push('</')
        if (this.node.namespace) {
            context.push(this.node.namespace).push(':')
        }
        context.push(this.node.name || 'div').push('>')
    }

    selfClosing () {
        return false
    }

    dotsAndHash () {
        if (!this.node.hash && !this.node.dots.length) return null

        const s = this.node.location.start
        let e
        if (this.node.attributeGroups.length) {
            e = this.node.attributeGroups[0].location.start
        } else {
            e = this.node.location.end
        }
        const location = {
            start: {offset: s.offset, line: s.line, column: s.column},
            end: {offset: e.offset, line: e.line, column: e.column}
        } as Location

        const attrs = [] as Attribute[]
        if (this.node.hash) {
            const value = [new StringValue(this.node.hash, location)]
            attrs.push(new Attribute(undefined, 'id', value, location))
        }

        if (this.node.dots.length) {
            const value = this.node.dots.map(it => new StringValue(it, location))
            attrs.push(new Attribute(undefined, 'class', value, location))
        }

        return new AttributeGroup(attrs, undefined, location)
    }

    mergeAttributeGroup (context: Context, ...groups: (AttributeGroup| null)[]) {
        const gs = groups.filter(it => !!it) as AttributeGroup[]
        if (!gs.length) return []
        if (context.options.ignoreSetting !== false) {
            return [gs.reduce((acc, item) => {
                acc.merge(item, true)
                return acc
            })]
        }
        const ns = gs.filter(it => !it.setting)
        if (!ns.length) return gs
        return gs.filter(it => !!it.setting).concat(ns.reduce((acc, item) => {
            acc.merge(item)
            return acc
        }))
    }
}

const emptyTags = [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]

export class EmptyTagCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        const tag = node as Tag
        if (!tag.name || emptyTags.indexOf(tag.name) === -1) return undefined
        return new EmptyTagCompiler(tag, stack)
    }
    selfClosing () {
        return true
    }
}
