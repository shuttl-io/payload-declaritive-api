import { Tab } from "payload";
import { PayloadField, SpecificField } from "./baseField";
import { IField, RecordToObject } from "./baseTypes";

type TabsConfigToObject<TTabs extends Record<string, {label?: string, fields: Record<string, IField<any, any, any>>}>> = {
    [key in keyof TTabs]: RecordToObject<TTabs[key]["fields"]>
}

class TabField<
    TObject extends Record<string, IField<any, any, any>>,
    TTab extends Record<string, { label?: string, fields: TObject }>
> extends PayloadField<string, TabsConfigToObject<TTab> | undefined, "tabs", SpecificField<"tabs">> {
    constructor(conf: TTab) {
        super("tabs")
        this._options.tabs = Object.entries(conf).map<Tab>(([key, value]) => {
            return {
                fields: Object.entries(value.fields).map(([key, value]) => {
                    return {
                        name: key,
                        ...value.toPayloadField(),
                    }
                }),
                label: value.label ?? key,
                name: key,
            } satisfies Tab
        });
    }
}

export function Tabs<
    TObject extends Record<string, IField<any, any, any>>,
    TTab extends Record<string, { label?: string, fields: TObject }>
>(conf: TTab) {
    return new TabField(conf);
}