import { cloneDeep } from "lodash";
import { BaseDataField, SpecificField } from "./baseField";

class CodeField extends BaseDataField<string, string | undefined, "code", SpecificField<"code">> {
    constructor() {
        super("code")
    }

    withMinLength(len: number): this {
        const elem = cloneDeep(this);
        elem._options.minLength = len;
        return elem;
    }

    withMaxLength(len: number): this {
        const elem = cloneDeep(this);
        elem._options.maxLength = len;
        return elem;
    }
}

export function Code() {
    return new CodeField();
}