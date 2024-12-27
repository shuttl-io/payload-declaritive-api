import { BaseDataField, SpecificField } from "./baseField";

class RadioField<const TOpts extends {label: string, value: string}[]> extends BaseDataField<string, TOpts[number]["value"] | undefined, "radio", SpecificField<"radio">> {
    constructor(opts: TOpts) {
        super("radio");

        this._options.options = opts;
    }

    withDefaultValue(defaultValue: TOpts[number]["value"]): this {
        this._options.defaultValue = defaultValue;
        return this;
    }

    withLayout(layout: "horizontal" | "vertical"): this {
       return this.setAdminValue("layout", layout);
    }
}
 
export function Radio<const TOpts extends { label: string, value: string}[]>(opts: TOpts) {
    return new RadioField<TOpts>(opts);
}