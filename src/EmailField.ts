import { BaseDataField, SpecificField } from "./baseField";

class EmailField extends BaseDataField<string, string | undefined, "email", SpecificField<"email">> {

    constructor() {
        super("email")
    }

    withAdminPlaceHolder(placeholder: string): this {
        return this.setAdminValue("placeholder", placeholder)
    }

    withAutoComplete(completion: string): this {
        return this.setAdminValue("autoComplete", completion);
    }
}

export function Email() {
    return new EmailField();
}