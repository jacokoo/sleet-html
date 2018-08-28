import { Compiler, Context, NodeType, SleetNode, Tag, SleetStack, AbstractCompiler } from 'sleet'

const map: {[name: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
}

const escapeHtml = (string: string) => string.replace(/[&<>"'`=\/]/g, s => map[s])

export class TextCompiler extends AbstractCompiler<Tag> {
    static type = NodeType.Tag

    static create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        if ((node as Tag).name === '|') return new TextCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.node.text.length) return

        const escape = this.escape()
        const lines = this.node.text.filter(it => !!it.length)

        if (!this.inline()) context.eol()
        lines.forEach(line => {
            const txt = line.map(it => it.toHTMLString()).join('')
            if (txt.length) {
                if (!this.inline()) context.indent()
                context.push(escape ? escapeHtml(txt) : txt)
            }
            context.eol()
        })
        context.pop()
    }

    escape () {
        return this.node.namespace === 'escape'
    }

    inline () {
        return this.node.namespace === 'inline'
    }
}
