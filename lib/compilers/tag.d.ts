import { Context, Compiler, NodeType, SleetNode, Tag, AttributeGroup, SleetStack } from 'sleet';
export declare class TagCompiler implements Compiler {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    protected tag: Tag;
    protected stack: SleetStack;
    constructor(node: Tag, stack: SleetStack);
    compile(context: Context): void;
    tagOpen(context: Context): void;
    openStart(context: Context): void;
    attributes(context: Context): void;
    openEnd(context: Context): void;
    content(context: Context): void;
    tagClose(context: Context): void;
    selfClosing(): boolean;
    dotsAndHash(): AttributeGroup | null;
    mergeAttributeGroup(...groups: (AttributeGroup | null)[]): AttributeGroup[];
}
export declare class EmptyTagCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    selfClosing(): boolean;
}
