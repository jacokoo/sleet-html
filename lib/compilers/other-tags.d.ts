import { Compiler, Context, SleetNode, Tag, SleetStack } from 'sleet';
import { TagCompiler } from './tag';
export declare class CommentCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    tagOpen(context: Context): void;
    tagClose(context: Context): void;
    inline(): boolean;
}
export declare class DoctypeCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
}
export declare class IeifCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    private closeIt;
    constructor(node: Tag, stack: SleetStack, closeIt?: boolean);
    openStart(context: Context): void;
    openEnd(context: Context): void;
    attributes(context: Context): void;
    tagClose(context: Context): void;
}
export declare class EchoCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
}
