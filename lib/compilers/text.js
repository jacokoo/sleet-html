"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleet_1 = require("sleet");
const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
const escapeHtml = (string) => string.replace(/[&<>"'`=\/]/g, s => map[s]);
class TextCompiler extends sleet_1.AbstractCompiler {
    static create(node, stack) {
        if (node.name === '|')
            return new TextCompiler(node, stack);
    }
    compile(context) {
        if (!this.node.text.length)
            return;
        const escape = this.escape();
        const lines = this.node.text.filter(it => !!it.length);
        if (!this.inline())
            context.eol();
        lines.forEach(line => {
            const txt = line.map(it => it.toHTMLString()).join('');
            if (txt.length) {
                if (!this.inline())
                    context.indent();
                context.push(escape ? escapeHtml(txt) : txt);
            }
            context.eol();
        });
        context.pop();
    }
    escape() {
        return this.node.namespace === 'escape';
    }
    inline() {
        return this.node.namespace === 'inline';
    }
}
TextCompiler.type = sleet_1.NodeType.Tag;
exports.TextCompiler = TextCompiler;
