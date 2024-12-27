import { PayloadField, recordToList, SpecificField } from "./baseField";
import { IField, RecordToObject } from "./baseTypes";


class GroupField<TGroup extends Record<string, IField<any, any, any>>> extends PayloadField<RecordToObject<TGroup>, RecordToObject<TGroup>,  "group", SpecificField<"group">> {
    constructor(private readonly group: TGroup) {
        super("group");
        this._options.fields = recordToList(group).map(field => field.toPayloadField())
    }

    hideGutter() {
        return this.setAdminValue("hideGutter", true);
    }

    protected hydrateFromPayload(value: RecordToObject<TGroup>): RecordToObject<TGroup> {
        return Object.entries(this.group).reduce((acc, [key, field]) => {
            if (field._payloadFieldType === "row"){
                return {
                    ...acc,
                    ...field.hydrate(value)
                }
            }
            return {
                ...acc,
                // @ts-expect-error
                [key]: field.hydrate(value[key] as any),
            }
        }, {}) as any;
    }
} 

export function Group<TGroup extends Record<string, IField<any, any, any>>>(group: TGroup) {
    return new GroupField(group);
}