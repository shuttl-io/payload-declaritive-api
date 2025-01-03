import { CollectionSlug } from "payload";
import { BaseDataField, SpecificField } from "./baseField";
import { Collection } from "./baseTypes";

type MediaDetails = {
    url: string,
    mimeType: string,
    filesize: number,
    width: number,
    height: number,
}

type CollectionType<TCollection extends Collection<any, string>> = TCollection extends Collection<infer TReturnType, any> ? 
    TReturnType & MediaDetails & {
        thumbnailURL: string,
        focalX: number,
        focalY: number,
        sizes: Record<string, MediaDetails>
    } : never

class UploadField<TSlug extends string, TCollection extends Collection<any, TSlug>> extends BaseDataField<CollectionType<TCollection> | null, CollectionType<TCollection> | null, "upload", SpecificField<"upload">> {
    constructor(protected readonly relationTo: TCollection) {
        super("upload");
        this._options.relationTo = relationTo.slug as CollectionSlug
    }

    protected hydrateFromPayload(value: CollectionType<TCollection> | null): CollectionType<TCollection> | null {
        if (value === null && !this._options.required) {
            return null
        }
        const data = this.relationTo.hydrate(value);
        const val = {
            ...value,
            ...data,
        }
        return val;
    }
}

export function Upload<TSlug extends string, TCollection extends Collection<any, TSlug>>(coll: TCollection) {
    return new UploadField(coll);
} 