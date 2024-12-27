import { BaseDataField, SpecificField } from "./baseField";

export class TextField extends BaseDataField<string, string | undefined, "text", SpecificField<"text">> {
    
    constructor() {
        super("text")
    }

    withMinLength(len: number): this {
        this._options.minLength = len;
        return this;
    }

    withMaxLength(len: number): this {
        this._options.maxLength = len;
        return this;
    }

    many(): this {
        this._options.hasMany = true;
        return this;
    }

    withMinRows(len: number): this {
        this._options.minRows = len;
        return this;
    }

    withMaxRows(len: number): this {
        this._options.maxRows = len;
        return this;
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