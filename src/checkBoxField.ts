import { BaseDataField, PayloadField, SpecificField } from "./baseField";

export class CheckboxField extends BaseDataField<unknown, boolean | undefined, "checkbox", SpecificField<"checkbox">> {
    constructor() {
        super("checkbox")
    }
    

}

export function Checkbox() {
    return new CheckboxField();
}