import { Context, Compiler, NodeType, SleetNode, Tag, AttributeGroup, SleetStack, AbstractCompiler } from 'sleet';
export declare class TagCompiler extends AbstractCompiler<Tag> {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context, ...others: SleetNode[]): void;
    tagOpen(context: Context): void;
    openStart(context: Context): void;
    attributes(context: Context): void;
    openEnd(context: Context): void;
    content(context: Context): void;
    tagClose(context: Context): void;
    selfClosing(): boolean;
    dotsAndHash(): AttributeGroup | null;
    mergeAttributeGroup(context: Context, ...groups: (AttributeGroup | null)[]): AttributeGroup[];
}
export declare class EmptyTagCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    selfClosing(): boolean;
}
