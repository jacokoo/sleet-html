import { Compiler, Context, SleetNode, Attribute, NodeType, AttributeGroup, SleetStack } from 'sleet';
export declare class AttributeGroupCompiler implements Compiler {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    private group;
    private stack;
    constructor(node: AttributeGroup, stack: SleetStack);
    compile(context: Context): void;
}
export declare class AttributeCompiler implements Compiler {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    private node;
    private stack;
    constructor(node: Attribute, stack: SleetStack);
    compile(context: Context): void;
    key(context: Context): string;
    value(context: Context): string;
}
