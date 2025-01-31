import { getPayload, type CollectionConfig, Config, Payload, buildConfig } from 'payload'
import {type Collection as Collection2, IField, RecordToObject, WhereCollection } from './baseTypes';
import { recordToList } from './baseField';
import { parseISO } from 'date-fns';


type CollectionOptions<TSlug extends string, TCollectionFields extends Record<string, IField<any, any, any>>> = Omit<CollectionConfig, "slug" | "fields"> & {
    name: TSlug
    fields: TCollectionFields,

}

export type CollectionType<TType extends Collection2<any, any>> = TType extends Collection2<infer TCollectType, infer TSlug> ? TCollectType : never

export const Collection = <TSlug extends string, TCollectionFields extends Record<string, IField<any, any, any>>, TCollectType extends RecordToObject<TCollectionFields> & {
    createdAt: Date,
    updatedAt: Date,
}>(opts: CollectionOptions<TSlug, TCollectionFields>): Collection2<TCollectType, TSlug> => {
    const fields = recordToList(opts.fields).map(f => f.toPayloadField())
    let getPayloadPromise: Promise<Payload> | undefined = undefined;
    let payload: Payload | null = null;

    const hydrate = (data: any): TCollectType => {
        return Object.entries(opts.fields).reduce((acc, [name, field]) => {
            return {
                ...acc,
                [name]: field.hydrate(data[name]),
            }
        }, {
            updatedAt: parseISO(data.updatedAt),
            createdAt: parseISO(data.createdAt),
        }) as any
    }

    function search(query: WhereCollection<TCollectType>, options: {limit: 1, sort?: string, page?: number} | {limit?: number, sort?: string, page?: number}): Promise<TCollectType | null>
    function search(query: WhereCollection<TCollectType>, options: {limit?: number, sort?: string, page?: number}): Promise<TCollectType[]>
    async function search(query: WhereCollection<TCollectType>, options: {limit: 1, sort?: string, page?: number} | {limit?: number, sort?: string, page?: number}) {
            if (payload === null) {
                payload = await getPayloadPromise ?? null;
                if (payload === null) {
                    throw new Error("Payload is not instantiated properly here!")
                }
            }
            const data = await payload.find({
                collection: opts.name as any,
                limit: options?.limit ?? 100,
                sort: options?.sort ??  "createdAt",
                depth: 2,
                showHiddenFields: true,
                where: query,
                page: options?.page ?? 1,
            });
            if (options?.limit === 1) {
                if (data.docs.length === 0) {
                    return null;
                }
                return hydrate(data.docs[0]);
            }
            return data.docs.map(hydrate);
    }

    return {
        _returnType: {} as any as TCollectType & { __type: TSlug },
        slug: opts.name,
        toPayloadCollection(): CollectionConfig {
            return {
                ...opts,
                slug: opts.name,
                fields,
            }
        },
        search,
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
        search(query) {
            return [] as any
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

export const PluginRelationShip = <THydrate, TSlug extends string>(slug: TSlug, hydrate: (v: unknown) => THydrate): Collection2<THydrate, TSlug>  => {
    return {
        _returnType: {} as any,
        slug,
        toPayloadCollection() {
            return {
                relationTo: slug,
                hasMany: true,
            } as any
        },
        search(query) {
            return [] as any
        },  
        get(id) {
            return {} as any      
        },
        bindPayload(prom) {
        },
        hydrate,
    };
}   

export function InjectCollections<const TCollections extends Array<Collection2<any, any>>>(config: Config, ...collections: TCollections) {
    config.collections = collections.map(col => col.toPayloadCollection());
    const conf = buildConfig(config);
    const getPayloadProm = getPayload({config: conf});
    collections.map(col => col.bindPayload(getPayloadProm));
    return conf;
}