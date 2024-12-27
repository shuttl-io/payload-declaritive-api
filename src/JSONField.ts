import { BaseDataField, SpecificField } from "./baseField";

class JSONField extends BaseDataField<string, any | undefined, "json", SpecificField<"json">> {
    constructor() {
        super("json");
    }
}

export function JSON() {
    return new JSONField();
}