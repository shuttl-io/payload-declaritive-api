import { parseISO } from "date-fns";
import { BaseDataField, SpecificField } from "./baseField";
import { cloneDeep } from "lodash";


class DateFieldClass extends BaseDataField<string | null, Date | null, "date", SpecificField<"date">> {
    constructor() {
        super("date")
        this.setAdminValue("date", {})
    }

    withDateFormat(format: string): this {
        const elem = cloneDeep(this);
        elem._options.admin!.date!.displayFormat = format;
        return elem;
    }

    withPickerApearance(appearance: NonNullable<NonNullable<SpecificField<"date">["admin"]>["date"]>["pickerAppearance"]): this {
        const elem = cloneDeep(this);
        elem._options.admin!.date!.pickerAppearance = appearance
        return elem;
    }

    protected hydrateFromPayload(value: string | null): Date | null {
        return value !== null ? parseISO(value) : null
    }
}

export function DateField() {
    return new DateFieldClass();
}