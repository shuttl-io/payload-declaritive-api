import { BaseDataField, SpecificField } from "./baseField";
import { Collection } from "./baseTypes";

class UploadField<TSlug extends string, TCollection extends Collection<any, TSlug>> extends BaseDataField<string, string | undefined, "upload", SpecificField<"upload">> {
    constructor(protected readonly relationTo: TCollection) {
        super("upload");
    }
}

export function Upload<TSlug extends string, TCollection extends Collection<any, TSlug>>(coll: TCollection) {
    return new UploadField(coll);
} 