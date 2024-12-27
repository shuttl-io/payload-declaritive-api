import { BaseDataField, SpecificField } from "./baseField";

class PointField extends BaseDataField<string, { latitude: number, longitude: number} | undefined, "point", SpecificField<"point">> {
    constructor() {
        super("point")
    }
}

export function Point() {
    return new PointField()
}