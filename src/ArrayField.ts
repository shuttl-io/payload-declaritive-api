import { cloneDeep } from "lodash";
import { BaseDataField, recordToList, SpecificField } from "./baseField";
import { IField, RecordToObject } from "./baseTypes";

class ArrayField<TGroup extends Record<string, IField<any, any, any>>> extends BaseDataField<RecordToObject<TGroup>[], RecordToObject<TGroup>[], "array", SpecificField<"array">> {
    // private name: string;
    constructor(private readonly fields: TGroup) {
        super("array");
        this._options.fields = recordToList(fields).map(field => field.toPayloadField());
    }

    withMinRows(len: number): this {
        const elem = cloneDeep(this);
        elem._options.minRows = len;
        return elem;
    }

    withMaxRows(len: number): this {
        const elem = cloneDeep(this);
        elem._options.maxRows = len;
        return elem;
    }

    protected hydrateFromPayload(value: RecordToObject<TGroup>[]): RecordToObject<TGroup>[] {
        console.log("Value in array:", value)
        const data = value.map(v => {
            return Object.entries(this.fields).reduce((acc, [name, field]) => {
                if (field._payloadFieldType === "row") {
                    return {
                        ...acc,
                        ...field.hydrate(v),
                    }
                }
                // @ts-expect-error
                const d = v[field._fieldName ?? name];
                return {
                    ...acc,
                    [field._fieldName ?? name]: field.hydrate(d),
                }
            }, {} as RecordToObject<TGroup>);
            
        });
        return data
    }
}

export function Array<TGroup extends Record<string, IField<any, any, any>>>(field: TGroup) {
    return new ArrayField(field);
}