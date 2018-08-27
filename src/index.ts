import { SleetPlugin, SleetOptions, SleetOutput, Context, CompileResult } from 'sleet'
import { TagCompiler, EmptyTagCompiler } from './compilers/tag'
import { TextCompiler } from './compilers/text'
import { CommentCompiler, DoctypeCompiler, IeifCompiler, EchoCompiler } from './compilers/other-tags'
import {
    StringValueCompiler, BooleanValueCompiler, NumberValueCompiler, IdentifierValueCompiler
} from './compilers/values'
import { AttributeGroupCompiler, AttributeCompiler } from './compilers/attribute'
import { IncludeCompiler } from './compilers/include'
import { MixinDefineCompiler, MixinReferenceCompiler } from './compilers/mixin'

export const plugin = {
    prepare (context: Context) {
        context.register(
            TagCompiler, TextCompiler, EmptyTagCompiler, CommentCompiler,
            DoctypeCompiler, IeifCompiler, EchoCompiler,
            MixinDefineCompiler, MixinReferenceCompiler
        )

        context.register(StringValueCompiler, BooleanValueCompiler, NumberValueCompiler, IdentifierValueCompiler)
        context.register(AttributeGroupCompiler, AttributeCompiler)
        context.register(IncludeCompiler)
    },
    compile (input: CompileResult, options: SleetOptions, context: Context): SleetOutput {
        const {nodes, declaration} = input

        nodes.forEach(it => {
            const sub = context.compile(it, [], -1)
            if (sub) sub.mergeUp()
        })
        return {
            code: context.getOutput(),
            extension: (declaration && declaration.extension) || 'html'
        }
    }
} as SleetPlugin
