import { TagCompiler } from './tag';
import { Compiler, Context, SleetNode, SleetStack } from 'sleet';
export declare class IncludeCompiler extends TagCompiler {
    static create(node: SleetNode, stack: SleetStack): Compiler | undefined;
    compile(context: Context): void;
    getPath(): string;
}
