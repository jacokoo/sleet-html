"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleet_1 = require("sleet");
class TagCompiler extends sleet_1.AbstractCompiler {
    static create(node, stack) {
        return new TagCompiler(node, stack);
    }
    compile(context, ...others) {
        this.tagOpen(context);
        this.content(context);
        this.tagClose(context);
    }
    tagOpen(context) {
        this.openStart(context);
        this.attributes(context);
        this.openEnd(context);
    }
    openStart(context) {
        context.eol().indent().push('<');
        if (this.node.namespace) {
            context.push(this.node.namespace).push(':');
        }
        context.push(this.node.name || 'div');
    }
    attributes(context) {
        const groups = this.mergeAttributeGroup(context, ...[this.dotsAndHash()].concat(this.node.attributeGroups));
        if (groups.length)
            context.push(' ');
        groups.forEach((it, idx) => {
            const sub = context.compile(it, this.stack);
            if (sub) {
                if (idx)
                    context.push(' ');
                sub.mergeUp();
            }
        });
    }
    openEnd(context) {
        context.push('>');
    }
    content(context) {
        if (this.selfClosing())
            return;
        this.node.children.forEach(it => context.compileUp(it, this.stack));
    }
    tagClose(context) {
        if (this.selfClosing())
            return;
        if (context.haveIndent)
            context.eol().indent();
        context.push('</');
        if (this.node.namespace) {
            context.push(this.node.namespace).push(':');
        }
        context.push(this.node.name || 'div').push('>');
    }
    selfClosing() {
        return false;
    }
    dotsAndHash() {
        if (!this.node.hash && !this.node.dots.length)
            return null;
        const s = this.node.location.start;
        let e;
        if (this.node.attributeGroups.length) {
            e = this.node.attributeGroups[0].location.start;
        }
        else {
            e = this.node.location.end;
        }
        const location = {
            start: { offset: s.offset, line: s.line, column: s.column },
            end: { offset: e.offset, line: e.line, column: e.column }
        };
        const attrs = [];
        if (this.node.hash) {
            const value = [new sleet_1.StringValue(this.node.hash, location)];
            attrs.push(new sleet_1.Attribute(undefined, 'id', value, location));
        }
        if (this.node.dots.length) {
            const value = this.node.dots.map(it => new sleet_1.StringValue(it, location));
            attrs.push(new sleet_1.Attribute(undefined, 'class', value, location));
        }
        return new sleet_1.AttributeGroup(attrs, undefined, location);
    }
    mergeAttributeGroup(context, ...groups) {
        const gs = groups.filter(it => !!it);
        if (!gs.length)
            return [];
        if (context.options.ignoreSetting !== false) {
            return [gs.reduce((acc, item) => {
                    acc.merge(item, true);
                    return acc;
                })];
        }
        const ns = gs.filter(it => !it.setting);
        if (!ns.length)
            return gs;
        return gs.filter(it => !!it.setting).concat(ns.reduce((acc, item) => {
            acc.merge(item);
            return acc;
        }));
    }
}
TagCompiler.type = sleet_1.NodeType.Tag;
exports.TagCompiler = TagCompiler;
const emptyTags = [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
];
class EmptyTagCompiler extends TagCompiler {
    static create(node, stack) {
        const tag = node;
        if (!tag.name || emptyTags.indexOf(tag.name) === -1)
            return undefined;
        return new EmptyTagCompiler(tag, stack);
    }
    selfClosing() {
        return true;
    }
}
exports.EmptyTagCompiler = EmptyTagCompiler;
