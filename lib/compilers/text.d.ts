import { Compiler, Context, NodeType, SleetNode, Tag, SleetStack } from 'sleet';
export declare class TextCompiler implements Compiler {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    private tag;
    constructor(node: Tag);
    compile(context: Context): void;
    escape(): boolean;
    inline(): boolean;
}
