import { cloneDeep } from "lodash";
import { BaseDataField, SpecificField } from "./baseField";

export class TextField extends BaseDataField<string, string | undefined, "text", SpecificField<"text">> {
    
    constructor() {
        super("text")
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

    many(): this {
        const elem = cloneDeep(this);
        elem._options.hasMany = true;
        return elem;
    }

    withMinRows(len: number): this {
        const elem = cloneDeep(this);
        elem._options.minRows = len;
        return elem;
    }

    withMaxRows(len: number): this {
        const elem = cloneDeep(this);
        elem._options.maxRows = len;
        return elem;
    }

    withAdminPlaceHolder(placeholder: string): this {
        return this.setAdminValue("placeholder", placeholder)
    }

    withAutoComplete(completion: string): this {
        return this.setAdminValue("autoComplete", completion);
    }

    protected hydrateFromPayload(value: string): string | undefined {
        return value;
    }
}

export function Text() {
    return new TextField();
}