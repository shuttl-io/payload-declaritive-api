import { cloneDeep } from "lodash";
import { BaseDataField, SpecificField } from "./baseField";

class TextareaField extends BaseDataField<string, string | undefined, "textarea", SpecificField<"textarea">> {
    constructor() {
        super("textarea")
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