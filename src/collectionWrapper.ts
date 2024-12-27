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
            const payload = await getPayloadPromise;
            const data = await payload?.findByID({
                collection: opts.name as any,
                id,
                depth: 2,
                showHiddenFields: true,
                overrideAccess: true,
            });
            if (data === undefined) {
                return null;
            }
            console.log("DATA:", data, JSON.stringify(opts.fields));
            return hydrate(data)
        },
        async bindPayload(prom: Promise<Payload>) {
            getPayloadPromise = prom;
        }
    } satisfies Collection2<TCollectType, TSlug>
} 

export function InjectCollections<const TCollections extends Array<Collection2<any, any>>>(config: Config, ...collections: TCollections) {
    config.collections = collections.map(col => col.toPayloadCollection());
    const conf = buildConfig(config);
    const getPayloadProm = getPayload({config: conf});
    collections.map(col => col.bindPayload(getPayloadProm));
    return conf;
}