import { Field, Payload, CollectionConfig as PayloadCollection } from "payload"

export interface IField<TOut, TIn, TType extends Field["type"]> {
    _fieldName?: string;
    _payloadFieldType: TType
    transform: <T2>(cb: (arg: TOut) => T2) => IField<T2, TOut, TType>
    toPayloadField(validateName?: boolean): Field;
    withName(name: string): IField<TOut, TIn, TType>;
    hydrate(name: TIn): TOut;
}

export type extractOut<Type> = Type extends IField<infer Out, infer In, infer TYpe> ? Out : never
export type extractIn<Type> = Type extends IField<infer Out, infer In, infer Type> ? In : never

export type RecordToObject<TCollectionFields extends Record<string, IField<any, any, any>>> = IFieldRecordToObject<ExcludeFields<TCollectionFields, IField<any, any, "row">>> & UnionToIntersection<extractOut<UnionizeRecord<PickFields<TCollectionFields, IField<any, any, "row">>>>>

type IFieldRecordToObject<TCollectionFields> = {
    [key in keyof TCollectionFields]: extractOut<TCollectionFields[key]>
}

export interface Collection<TReturn, TSlug extends string> {
    _returnType: TReturn
    get: (id: string) => Promise<TReturn | null>
    slug: TSlug;
    toPayloadCollection():  PayloadCollection;
    bindPayload(prom: Promise<Payload>): void;
    hydrate(v: any): TReturn;
}

type ExcludedTypes<TValue, TReject> = {
    [key in keyof TValue]: TValue[key] extends TReject ? never : {Key: key, value: TValue[key]}
}[keyof TValue]["Key"]

type IncludedTypes<TValue, TReject> = {
    [key in keyof TValue]: TValue[key] extends TReject ? {Key: key, value: TValue[key]} : never
}[keyof TValue]["Key"]

type UnionToIntersection<U> = 
  (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

type ExcludeFields<T extends Record<string, IField<any, any, any>>, U> = Pick<T, ExcludedTypes<T, U>>

type PickFields<T extends Record<string, IField<any, any, any>>, U> = Pick<T, IncludedTypes<T, U>> 

type UnionizeRecord<T extends Record<string, IField<any, any, any>>> = T[keyof T]