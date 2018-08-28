import { Compiler, Context, NodeType, SleetNode, Tag, SleetStack, AbstractCompiler } from 'sleet';
export declare class TextCompiler extends AbstractCompiler<Tag> {
    static type: NodeType;
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
    escape(): boolean;
    inline(): boolean;
}
