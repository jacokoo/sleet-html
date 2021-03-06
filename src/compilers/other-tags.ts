import { Compiler, Context, SleetNode, Tag, StringValue, SleetStack } from 'sleet'
import { TagCompiler } from './tag'

export class CommentCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === '#') return new CommentCompiler(node as Tag, stack)
    }

    tagOpen (context: Context) {
        context.eol().indent().push('<!--')
        if (this.inline()) context.push(' ')
    }

    tagClose (context: Context) {
        if (context.haveIndent) context.eol().indent()
        if (this.inline()) context.push(' ')
        context.push('-->')
    }

    inline () {
        const node = this.node.children[0]
        return node && node.namespace === 'inline'
    }
}

export class DoctypeCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === 'doctype') return new DoctypeCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        context.eol().indent().push('<!DOCTYPE html>')
    }
}

export class IeifCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        const tag = node as Tag

        if (tag.name === 'ieif') return new IeifCompiler(tag, stack, false)
        if (tag.name === '@ieif') return new IeifCompiler(tag, stack, true)
    }

    private closeIt: boolean

    constructor(node: Tag, stack: SleetStack, closeIt: boolean = false) {
        super(node, stack)
        this.closeIt = closeIt
    }

    openStart (context: Context) {
        context.eol().indent().push('<!--[if ')
    }

    openEnd (context: Context) {
        context.push(this.closeIt ? ']><!-->' : ']>')
    }

    attributes (context: Context) {
        if (this.node.attributeGroups.length) {
            const attr = this.node.attributeGroups[0].attributes[0]
            if (attr && attr.values[0] && attr.values[0] instanceof StringValue) {
                const v = attr.values[0] as StringValue
                context.push(v.value)
            }
        }
    }

    tagClose (context: Context) {
        if (context.haveIndent) context.eol().indent()
        context.push(this.closeIt ? '<!--<![endif]-->' : '<![endif]-->')
    }
}

export class EchoCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === 'echo') return new EchoCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.node.attributeGroups.length) return
        context.eol().indent()

        this.node.attributeGroups.forEach(it => it.attributes.forEach(attr => attr.values.forEach(v => {
            const stack = this.stack.concat([it, attr])
            context.compileUp(v, stack)
        })))
    }
}
