import * as fs from 'fs'
import * as path from 'path'

import { TagCompiler } from './tag'
import { Compiler, Context, parse, SleetNode, StringValue, IdentifierValue, Tag, SleetStack } from 'sleet'

export class IncludeCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === '@include') return new IncludeCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        let dir = context.options.sourceFile ||  path.resolve('.')
        if (fs.statSync(dir).isFile()) dir = path.dirname(dir)
        const file = path.resolve(dir, this.getPath())

        const {nodes} = parse(fs.readFileSync(file, 'utf-8'))
        nodes.forEach(it => context.compileUp(it, this.stack, -1))
    }

    getPath () {
        if (this.node.attributeGroups.length) {
            const v = this.node.attributeGroups[0].attributes[0].values[0]
            if (v) {
                if (v instanceof StringValue) return v.value
                if (v instanceof IdentifierValue) return v.value
            }
        }
        const {line, column} = this.node.location.start
        throw new SyntaxError(`no file specified, line: ${line} column: ${column}`)
    }
}
