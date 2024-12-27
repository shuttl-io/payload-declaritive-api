import { BaseDataField, SpecificField } from "./baseField";

class CodeField extends BaseDataField<string, string | undefined, "code", SpecificField<"code">> {
    constructor() {
        super("code")
    }

    withMinLength(len: number): this {
        this._options.minLength = len;
        return this;
    }

    withMaxLength(len: number): this {
        this._options.maxLength = len;
        return this;
    }
}

export function Code() {
    return new CodeField();
}