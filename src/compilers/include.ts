import * as fs from 'fs'
import * as path from 'path'

import { TagCompiler } from './tag'
import { Compiler, Context, parse, SleetNode, StringValue, IdentifierValue, Tag } from 'sleet'

export class IncludeCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        if ((node as Tag).name === '@include') return new IncludeCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        let dir = context.options.sourceFile ||  path.resolve('.')
        if (fs.statSync(dir).isFile()) dir = path.dirname(dir)
        const file = path.resolve(dir, this.getPath())

        const {nodes} = parse(fs.readFileSync(file, 'utf-8'))
        nodes.forEach(it => {
            const sub = context.compile(it, this.stack, -1)
            if (sub) sub.mergeUp()
        })
    }

    getPath () {
        if (this.tag.attributeGroups.length) {
            const v = this.tag.attributeGroups[0].attributes[0].values[0]
            if (v) {
                if (v instanceof StringValue) return v.value
                if (v instanceof IdentifierValue) return v.value
            }
        }
        const {line, column} = this.tag.location.start
        throw new SyntaxError(`no file specified, line: ${line} column: ${column}`)
    }
}
