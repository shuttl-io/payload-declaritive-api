import { cloneDeep } from "lodash";
import { BaseDataField, SpecificField } from "./baseField";

class NumberField extends BaseDataField<number, number | undefined, "number", SpecificField<"number">> {
    constructor() {
        super("number")
    }

    withMin(len: number): this {
        const elem = cloneDeep(this);
        elem._options.min = len;
        return elem;
    }

    withMax(len: number): this {
        const elem = cloneDeep(this);
        elem._options.max = len;
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

    protected hydrateFromPayload(value: number): number | undefined {
        return value;
    }
}

export function Number() {
    return new NumberField();
}