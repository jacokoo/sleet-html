import { Compiler, Context, NodeType, SleetNode, SleetValue, StringValue, BooleanValue, NumberValue, IdentifierValue } from 'sleet';
declare abstract class ValueCompiler<T extends SleetValue<any>> implements Compiler {
    private value;
    constructor(value: T);
    compile(context: Context): void;
}
export declare class StringValueCompiler extends ValueCompiler<StringValue> {
    static type: NodeType;
    static create(node: SleetNode): Compiler | undefined;
}
export declare class BooleanValueCompiler extends ValueCompiler<BooleanValue> {
    static type: NodeType;
    static create(node: SleetNode): Compiler | undefined;
}
export declare class NumberValueCompiler extends ValueCompiler<NumberValue> {
    static type: NodeType;
    static create(node: SleetNode): Compiler | undefined;
}
export declare class IdentifierValueCompiler extends ValueCompiler<IdentifierValue> {
    static type: NodeType;
    static create(node: SleetNode): Compiler | undefined;
}
export {};
