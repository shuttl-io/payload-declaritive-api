import { CollectionSlug } from "payload";
import { PayloadField, SpecificField } from "./baseField";
import { Collection } from "./baseTypes";
import { cloneDeep } from "lodash";

type PayloadRelation<TSlug> = {
    relationTo: TSlug
    value: any;
}

// comment

class RelationshipField<TSlug extends string, const TObject extends Array<Collection<any, TSlug>>> extends PayloadField<PayloadRelation<TSlug>, TObject[number]["_returnType"] | undefined, "relationship", SpecificField<"relationship">> {
    private collectionRecord: Record<TSlug, TObject[number]>;
    constructor(...relation: TObject) {
        super("relationship")
        this._options.relationTo = relation.map(col => col.slug as CollectionSlug)
        this.collectionRecord = relation.reduce((acc, col) => {
            acc[col.slug] = col;
            return acc;
        }, {} as typeof this.collectionRecord);
    }

    public required(): PayloadField<PayloadRelation<TSlug>, TObject[number]["_returnType"], "relationship", SpecificField<"relationship">> {
        const elem = cloneDeep(this);
        elem._options.required = true;
        return elem;
    }

    public hydrateFromPayload(value: PayloadRelation<TSlug>): TObject[number]["_returnType"] | undefined {
        const col = this.collectionRecord[value.relationTo];
        return {
            __type: value.relationTo,
            ...col.hydrate(value.value),
        }
    }
}


export function Relationship<TSlug extends string, const TObject extends Array<Collection<any, TSlug>>>(...rels: TObject) {
    return new RelationshipField(...rels);
}