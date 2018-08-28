import { TagCompiler } from './tag'
import { Compiler, Context, SleetNode, Tag, SleetStack } from 'sleet'

interface Mixin {
    nodes: SleetNode[]
    replacement: {[name: string]: any}
}

export class MixinDefineCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === '@mixin') return new MixinDefineCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.node.hash) {
            throw new Error('Hash property is required for mixin definition. eg. @mixin#name')
        }

        if (this.node.indent !== 0) {
            throw new Error('Mixin definition must be placed in top level(the indent of it must be 0)')
        }

        if (!context.note.mixin) context.note.mixin = {}
        if (context.note.mixin[this.node.hash]) {
            throw new Error(`Mixin definition #${this.node.hash} have already defined`)
        }

        context.note.mixin[this.node.hash] = {
            nodes: this.node.children,
            replacement: this.replacement(context)
        } as Mixin
    }

    replacement (context: Context): {[name: string]: any} {
        if (!this.node.attributeGroups.length) return {}
        const attrs = this.node.attributeGroups[0].attributes
        return attrs.reduce((acc, it) => {
            const v = it.values[0]
            if (!v) return acc

            const stack = this.stack.concat([this.node.attributeGroups[0], it])
            const sub = context.compile(v, stack)
            if (!sub) return acc
            const vv = sub.getOutput()

            it.name ? acc[it.name] = vv : acc[vv] = null
            return acc
        }, {} as {[name: string]: any})
    }
}

export class MixinReferenceCompiler extends MixinDefineCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === 'mixin') return new MixinReferenceCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.node.hash) {
            throw new Error('Hash property is required for mixin reference. eg. mixin#name')
        }

        if (!context.note.mixin || !context.note.mixin[this.node.hash]) {
            throw new Error(`Mixin #${this.node.hash} is not defined`)
        }
        const def = context.note.mixin[this.node.hash] as Mixin
        const ctx = context.sub()
        def.nodes.forEach(it => ctx.compileUp(it, this.stack, -2))

        const output = ctx.getOutput()
        const actual = Object.assign({}, def.replacement, this.replacement(context))
        const o = Object.keys(actual).reduce((acc, item) => {
            return acc.replace(new RegExp(`\\$${item}`, 'g'), actual[item])
        }, output)
        context.push(o)
    }

}
