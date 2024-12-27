import { BaseDataField, SpecificField } from "./baseField";

class TextareaField extends BaseDataField<string, string | undefined, "textarea", SpecificField<"textarea">> {
    constructor() {
        super("textarea")
    }

    withMinLength(len: number): this {
        this._options.minLength = len;
        return this;
    }

    withMaxLength(len: number): this {
        this._options.maxLength = len;
        return this;
    }

    withAdminPlaceHolder(placeholder: string): this {
        return this.setAdminValue("placeholder", placeholder)
    }

    withAdminRows(rows: number): this {
        return this.setAdminValue("rows", rows);
    }
}

export function Textarea() {
    return new TextareaField();
}