import { BaseDataField, SpecificField } from "./baseField";
import { IField } from "./baseTypes";

class ArrayField<TField extends IField<any, any, any>> extends BaseDataField<string, TField[] | undefined, "array", SpecificField<"array">> {
    constructor(fields: TField) {
        super("array");
        this._options.fields = [fields.toPayloadField(true)];
    }

    withMinRows(len: number): this {
        this._options.minRows = len;
        return this;
    }

    withMaxRows(len: number): this {
        this._options.maxRows = len;
        return this;
    }
}

export function Array<TField extends IField<any, any, any>>(field: TField) {
    return new ArrayField(field);
}