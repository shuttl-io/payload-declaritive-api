import { BaseDataField, SpecificField } from "./baseField";

class NumberField extends BaseDataField<number, number | undefined, "number", SpecificField<"number">> {
    constructor() {
        super("number")
    }

    withMin(len: number): this {
        this._options.min = len;
        return this;
    }

    withMax(len: number): this {
        this._options.max = len;
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

    protected hydrateFromPayload(value: number): number | undefined {
        return value;
    }
}

export function Number() {
    return new NumberField();
}