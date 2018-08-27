import { TagCompiler } from './tag';
import { Compiler, Context, SleetNode, SleetStack } from 'sleet';
export declare class MixinDefineCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
    replacement(context: Context): {
        [name: string]: any;
    };
}
export declare class MixinReferenceCompiler extends MixinDefineCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
}
