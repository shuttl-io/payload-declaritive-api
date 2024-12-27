import { BaseDataField, SpecificField } from "./baseField";

class SelectField<const TSelect extends {label: string, value: string}[]> extends BaseDataField<string, TSelect[number]["value"] | undefined, "select", SpecificField<"select">> {
    constructor(opts: TSelect) {
        super("select")
        this._options.options = opts;
    }

    many(): BaseDataField<string, TSelect[number]["value"][] | undefined, "select", SpecificField<"select">> {
        this._options.hasMany = true;
        return this as any as BaseDataField<string, TSelect[number]["value"][] | undefined, "select", SpecificField<"select">>;
    }
}

export function Select<const TSelect extends {label: string, value: string}[]>(opts: TSelect) {
    return new SelectField(opts);
}