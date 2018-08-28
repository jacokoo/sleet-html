import { Compiler, Context, SleetNode, Attribute, NodeType, AttributeGroup, SleetStack, AbstractCompiler } from 'sleet';
export declare class AttributeGroupCompiler extends AbstractCompiler<AttributeGroup> {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
}
export declare class AttributeCompiler extends AbstractCompiler<Attribute> {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
    key(context: Context): string;
    value(context: Context): string;
}
