"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sleet_1 = require("sleet");
class ValueCompiler {
    constructor(value) {
        this.value = value;
    }
    compile(context) {
        context.push(this.value.value);
    }
}
class StringValueCompiler extends ValueCompiler {
    static create(node) {
        return new StringValueCompiler(node);
    }
}
StringValueCompiler.type = sleet_1.NodeType.StringValue;
exports.StringValueCompiler = StringValueCompiler;
class BooleanValueCompiler extends ValueCompiler {
    static create(node) {
        return new BooleanValueCompiler(node);
    }
}
BooleanValueCompiler.type = sleet_1.NodeType.BooleanValue;
exports.BooleanValueCompiler = BooleanValueCompiler;
class NumberValueCompiler extends ValueCompiler {
    static create(node) {
        return new NumberValueCompiler(node);
    }
}
NumberValueCompiler.type = sleet_1.NodeType.NumberValue;
exports.NumberValueCompiler = NumberValueCompiler;
class IdentifierValueCompiler extends ValueCompiler {
    static create(node) {
        return new IdentifierValueCompiler(node);
    }
}
IdentifierValueCompiler.type = sleet_1.NodeType.IdentifierValue;
exports.IdentifierValueCompiler = IdentifierValueCompiler;
