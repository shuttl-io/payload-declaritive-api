import { RowField as PayloadRowField } from "payload";
import { PayloadField, recordToList, SpecificField } from "./baseField";
import { IField, RecordToObject } from "./baseTypes";

class RowField<TRow extends Record<string, IField<any, any, any>>> extends PayloadField<RecordToObject<TRow>, RecordToObject<TRow>, "row", SpecificField<"row">> {
    constructor(private readonly row: TRow) {
        super("row")
        this._options.fields = recordToList(row).map(field => field.toPayloadField())
    } 

    public toPayloadField(validateName?: boolean): PayloadRowField {
        return {
            ...this._options,
            type: "row",
            fields: this._options.fields,

        }
    }

    protected hydrateFromPayload(value: RecordToObject<TRow>): RecordToObject<TRow> {
        return Object.entries(this.row).reduce((acc, [key, field]) => {
            // @ts-expect-error
            acc[key] = field.hydrate(value[key]);
            return acc;
        }, {} as RecordToObject<TRow>);
    }
}

export function Row<TRow extends Record<string, IField<any, any, any>>>(row: TRow) {
    return new RowField(row);
}