import { BaseDataField, SpecificField } from "./baseField";
import type { FieldClientComponent, FieldServerComponent } from "payload";
import type { CustomComponent } from "payload";

class JSONField extends BaseDataField<unknown, any | undefined, "json", SpecificField<"json">> {
    constructor() {
        super("json");
    }

    protected hydrateFromPayload(value: unknown) {
        return value;
    }
}

export function JSON() {
    return new JSONField();
}

type Parser<T> = {
    parse: (value: unknown) => T;
}

class CustomJSONField<TReturn> extends BaseDataField<unknown, TReturn | undefined, "json", SpecificField<"json">> {
    constructor(protected readonly modelValidator: Parser<TReturn>, protected readonly Component: CustomComponent<FieldClientComponent | FieldServerComponent>) {
        super("json");
        this._options.admin = {
            components: {
                Field: Component,
            }
        }
    }

    protected hydrateFromPayload(value: unknown) {
        return this.modelValidator.parse(value);
    }
}

export function CustomJSON<TReturn>(modelValidator: Parser<TReturn>, Component: CustomComponent<FieldClientComponent | FieldServerComponent>) {
    return new CustomJSONField<TReturn>(modelValidator, Component);
}
