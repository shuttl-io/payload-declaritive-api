import { parseISO } from "date-fns";
import { BaseDataField, SpecificField } from "./baseField";


class DateFieldClass extends BaseDataField<string | null, Date | null, "date", SpecificField<"date">> {
    constructor() {
        super("date")
        this.setAdminValue("date", {})
    }

    withDateFormat(format: string): this {
        this._options.admin!.date!.displayFormat = format;
        return this;
    }

    withPickerApearance(appearance: NonNullable<NonNullable<SpecificField<"date">["admin"]>["date"]>["pickerAppearance"]): this {
        this._options.admin!.date!.pickerAppearance = appearance
        return this;
    }

    protected hydrateFromPayload(value: string | null): Date | null {
        return value !== null ? parseISO(value) : null
    }
}

export function DateField() {
    return new DateFieldClass();
}