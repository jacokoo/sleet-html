"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const tag_1 = require("./tag");
const sleet_1 = require("sleet");
class IncludeCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        if (node.name === '@include')
            return new IncludeCompiler(node, stack);
    }
    compile(context) {
        let dir = context.options.sourceFile || path.resolve('.');
        if (fs.statSync(dir).isFile())
            dir = path.dirname(dir);
        const file = path.resolve(dir, this.getPath());
        const { nodes } = sleet_1.parse(fs.readFileSync(file, 'utf-8'));
        nodes.forEach(it => context.compileUp(it, this.stack, -1));
    }
    getPath() {
        if (this.node.attributeGroups.length) {
            const v = this.node.attributeGroups[0].attributes[0].values[0];
            if (v) {
                if (v instanceof sleet_1.StringValue)
                    return v.value;
                if (v instanceof sleet_1.IdentifierValue)
                    return v.value;
            }
        }
        const { line, column } = this.node.location.start;
        throw new SyntaxError(`no file specified, line: ${line} column: ${column}`);
    }
}
exports.IncludeCompiler = IncludeCompiler;
