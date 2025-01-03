import { getPayload, type CollectionConfig, Config, Payload, buildConfig } from 'payload'
import {type Collection as Collection2, IField, RecordToObject } from './baseTypes';
import { recordToList } from './baseField';


type CollectionOptions<TSlug extends string, TCollectionFields extends Record<string, IField<any, any, any>>> = Omit<CollectionConfig, "slug" | "fields"> & {
    name: TSlug
    fields: TCollectionFields,

}

export const Collection = <TSlug extends string, TCollectionFields extends Record<string, IField<any, any, any>>, TCollectType extends RecordToObject<TCollectionFields>>(opts: CollectionOptions<TSlug, TCollectionFields>): Collection2<TCollectType, TSlug> => {
    const fields = recordToList(opts.fields).map(f => f.toPayloadField())
    let getPayloadPromise: Promise<Payload> | undefined = undefined;
    let payload: Payload | null = null;

    const hydrate = (data: any): TCollectType => {
        return Object.entries(opts.fields).reduce((acc, [name, field]) => {
            return {
                ...acc,
                [name]: field.hydrate(data[name]),
            }
        }, {}) as any
    }
    return {
        _returnType: {} as any as TCollectType,
        slug: opts.name,
        toPayloadCollection(): CollectionConfig {
            return {
                ...opts,
                slug: opts.name,
                fields,
            }
        },
        hydrate, 
        async get(id): Promise<TCollectType | null> {
            if (payload === null) {
                payload = await getPayloadPromise ?? null;
                if (payload === null) {
                    throw new Error("Payload is not instantiated properly here!")
                }
            }
            const data = await payload.findByID({
                collection: opts.name as any,
                id,
                depth: 2,
                showHiddenFields: true,
            });
            if (data === undefined) {
                return null;
            }
            return hydrate(data)
        },
        async bindPayload(prom: Promise<Payload>) {
            getPayloadPromise = prom;
        }
    } satisfies Collection2<TCollectType, TSlug>
} 

type extractSlug<T extends Collection2<any, any>> = T extends Collection2<any, infer Slug> ? Slug : never
// type extractReturn<T extends Collection2<any, any>> = T extends Collection2<infer TReturn, any> ? TReturn
type CollectionToFields<TFields extends object> = {
    [TKey in keyof TFields]: IField<any, TFields[TKey], any>
}


type Unionize<T> = {
    [key in keyof T]: T[key]
}[keyof T]

export const ForwardDeclaration = <TCollection extends Collection2<any, any>> () => <TFields extends Record<string, IField<any, any, any>>>(slug: extractSlug<TCollection>, fields: TFields): Collection2<RecordToObject<TFields>, extractSlug<extractSlug<TCollection>>> => {
    const actFields = recordToList(fields);
    return {
        _returnType: {} as any,
        slug,
        toPayloadCollection() {
            return {
                slug: slug as any,
                fields: actFields.map(f => f.toPayloadField()),
            }
        },
        get(id) {
            return {} as any      
        },
        bindPayload(prom) {
        },
        hydrate(v) {
            return Object.entries(fields).reduce((acc, [name, field]) => {
                return {
                    ...acc,
                    [name]: field.hydrate(v[name]),
                }
            }, {} as RecordToObject<TFields>);
        },
    };
}

export function InjectCollections<const TCollections extends Array<Collection2<any, any>>>(config: Config, ...collections: TCollections) {
    config.collections = collections.map(col => col.toPayloadCollection());
    console.log("config", JSON.stringify(config))
    const conf = buildConfig(config);
    const getPayloadProm = getPayload({config: conf});
    collections.map(col => col.bindPayload(getPayloadProm));
    return conf;
}