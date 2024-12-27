import { ReactNode } from "react";
import { BaseDataField, SpecificField } from "./baseField";

class RichTextField extends BaseDataField<string, ReactNode | undefined, "richText", SpecificField<"richText">> {
    constructor() {
        super("richText")
    }

}

export function RichText() {
    return new RichTextField();
}