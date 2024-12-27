import { Condition, Field } from "payload";
import { IField } from "./baseTypes";
import { CSSProperties } from "react";


export class PayloadField<TIn, TOut, TPayloadType extends Field["type"], TOptionsType extends Extract<Field, {type: TPayloadType}>> implements IField<TOut, TIn, TPayloadType> {
    _output!: TOut;
    private _effect?: (arg: TOut) => any;
    private _fieldName?: string;
    protected _options: TOptionsType = {} as any as TOptionsType;
    
    constructor(public readonly _payloadFieldType: TPayloadType) {}

    transform<TActual>(cb: (arg: TOut) => TActual): IField<TActual, TOut, TPayloadType> {
        this._effect = cb;
        return this as any;
    };

    public toPayloadField(validateName?: boolean): TOptionsType {
        if (this._fieldName === undefined && !validateName) {
            throw new Error("PayloadField with out a name:" + this._payloadFieldType)
        }
        return {
            ...this._options,
            name: this._fieldName,
            type: this._payloadFieldType,
        }
    }

    protected hydrateFromPayload(value: TIn): TOut {
        throw new Error("Not implemented for: " + this._payloadFieldType);
    }

    public hydrate(value: TIn): TOut {
       const v = this.hydrateFromPayload(value);
       if (this._effect) {
        return this._effect(v)
       }
       return v
    }

    public withName(name: string): PayloadField<TIn, TOut, TPayloadType, TOptionsType> {
        if (this._fieldName === undefined) {
            this._fieldName = name;
        }
        return this;
    }

    protected setAdminValue<TAdmin extends NonNullable<TOptionsType["admin"]>, TKey extends keyof TAdmin, TValue extends TAdmin[TKey]>(key: TKey, value: TValue): this {
        this._options.admin = {
            ...(this._options.admin ?? {}),
            [key]: value,
        }
        return this;
    }

    public withAdminCondition(condition: Condition): this {
       return this.setAdminValue("condition", condition);
    }

    public withAdminDescription(description: string): this {
        return this.setAdminValue("description" as any, description);
    }

    public withAdminWidth(width: string): this {
        return this.setAdminValue("width", width);
    }

    public withAdminStyle(style: CSSProperties): this {
        return this.setAdminValue("style" as any, style);
    }

    public withAdminClassName(className: string) {
        return this.setAdminValue("className" as any, className)
    }

    public adminReadonly(): this {
        return this.setAdminValue("readOnly" as any, true)
    }

    public adminDisabled(): this {
        return this.setAdminValue("disabled" as any, true)
    }

    public adminDisableBulkEdit(): this {
        return this.setAdminValue("disableBulkEdit", true)
    }

    public adminDisableListColumn(): this {
        return this.setAdminValue("disableListColumn", true)
    }
    
    public adminDisableListFilter(): this {
        return this.setAdminValue("disableListFilter" as any, true)
    }

    public adminHidden(): this {
        return this.setAdminValue("hidden" as any, true);``
    }

    public withAdminComponents(comp: NonNullable<TOptionsType["admin"]>["components"]): this {
        return this.setAdminValue("components", comp)
    }

   
}

export type SpecificField<TKey extends Field["type"]> = Extract<Field, { type: TKey }>

type DataFields = "radio" | 
    "checkbox" | 
    "text" | 
    "code" | 
    "date" | 
    "email" | 
    "json" | 
    "number" | 
    "point" | 
    "richText" | 
    "select" |
    "textarea" |
    "upload" |
    "array" |
    "blocks";

export class BaseDataField< TIn, TOut, TData extends DataFields, TOptions extends Extract<Field, { type: TData }>> extends PayloadField<TIn, TOut, TData, TOptions> {
    constructor(key: TData) {
        super(key);
    }

    withLabel(label: string): this {
        this._options.label = label;
        return this;
    }

    required(): PayloadField<TIn, NonNullable<TOut>, TData, TOptions> {
        this._options.required = true;
        return this as PayloadField<TIn, NonNullable<TOut>, TData, TOptions>;
    }

    withValidation(validateFn: NonNullable<TOptions["validate"]>): this {
        this._options.validate = validateFn;
        return this;
    }

    withDefaultValue(defaultValue: NonNullable<TOptions["defaultValue"]>): this {
        this._options.defaultValue = defaultValue;
        return this;
    }

    virtual(): this {
        this._options.virtual = true;
        return this;
    }


    index(): this {
        this._options.index = true;
        return this;
    }

    hidden(): this {
        this._options.hidden = true;
        return this;
    }

    withAccess(access: NonNullable<TOptions["access"]>): this {
        this._options.access = access;
        return this;
    }
}
type Constructor<T> = new (...args: any[]) => T;
type AllThatSatisfy<T, U> = T extends U ? T: never

type FieldSatisfies<TAny> = AllThatSatisfy<Field, TAny>
type FieldTypeSatisfies<TAny> = FieldSatisfies<TAny>["type"]

export function RowsMixin<TPartial extends { minRows?: number, maxRows?: number}, TPayloadType extends FieldTypeSatisfies<TPartial>, TOptionsType extends Extract<Field, { type: TPayloadType }>, TClass extends Constructor<PayloadField<any, any, TPayloadType, TOptionsType>>>(Klass: TClass): TClass {
    return class extends Klass {

    withMinRows(len: number): this {
        // @ts-expect-error
        this._options.minRows = len;
        return this;
    }

    withMaxRows(len: number): this {
        // @ts-expect-error
        this._options.maxRows = len;
        return this;
    }
    }
}

export function recordToList<const TValue extends Record<string, IField<any, any, any>>>(record: TValue) {
    console.log(`Setting all names!`)
    const fields = Object.entries(record).map(([key, value]) => {
        console.log(`Setting name for: ${key} ${value._payloadFieldType}`)
        return value.withName(key)
    });
    return fields;
}