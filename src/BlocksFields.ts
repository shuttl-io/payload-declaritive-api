import { Collection, IField, RecordToObject } from "./baseTypes"
import { BaseDataField, PayloadField, recordToList, SpecificField } from "./baseField"

import { Block as PayloadBlock } from "payload"


type _BlockType<TFields extends { type: string, fields: Record<string, IField<any, any, any>> }, renderBlock extends boolean> = {
    type: TFields["type"],
    fields: TFields["fields"],
    render?: (props: BlockToField<TFields>) => React.ReactNode
}

type BlocksToUnion<TBlock extends _BlockType<{ type: string, fields: Record<string, IField<any, any, any>>}, boolean>[]> = TBlock extends [infer First, ...infer Rest] ? 
    First extends { type: string, fields: Record<string, IField<any, any, any>>} ?
        Rest extends { type: string, fields: Record<string, IField<any, any, any>>} [] ?
            [BlockToField<First>, ...BlocksToUnion<Rest>] : [BlockToField<First>]
        : []
    : []

type BlockToField<TBlock extends _BlockType<{ type: string, fields: Record<string, IField<any, any, any>>}, boolean>> = RecordToObject<TBlock["fields"]> & { type: TBlock["type"]}

class BlocksField<TSlug extends string, const TBlocks extends Array<{ type: TSlug, fields: Record<string, IField<any, any, any>>}>> extends BaseDataField<{ blockType: TSlug, [key: string]: any}[], BlocksToUnion<TBlocks>[number][] | undefined, "blocks", SpecificField<"blocks">> {
    private readonly blockMap: Record<TSlug, TBlocks[number]>;
    constructor(blocks: TBlocks) {
        super("blocks")
        this._options.blocks = blocks.map(({type, ...block}) => ({
            ...block,
            slug: type,
            fields: recordToList(block.fields).map(b => b.toPayloadField()),
        }))

        this.blockMap = blocks.reduce((acc, block) => {
            acc[block.type] = block;
            return acc;
        }, {} as Record<TSlug, TBlocks[number]>);
    }

    withMinRows(len: number): this {
        this._options.minRows = len;
        return this;
    }

    withMaxRows(len: number): this {
        this._options.maxRows = len;
        return this;
    }

    collapsed(): this {
        return this.setAdminValue("initCollapsed", true);
    }

    notSortable(): this {
        return this.setAdminValue("isSortable", false)
    }

    sortable(): this {
        return this.setAdminValue("isSortable", true);
    }

    protected hydrateFromPayload(value: { [key: string]: any; blockType: TSlug; }[]): BlocksToUnion<TBlocks>[number][] | undefined {
        console.log("value", value);
        return value.map((blockConf) => {
            const block = this.blockMap[blockConf.blockType];
        
            return Object.entries(block.fields).reduce((acc, [key, field]) => {
                acc[key] = field.hydrate(blockConf[key]);
                return acc;
            }, {type: blockConf.blockType} as BlocksToUnion<TBlocks>[number])
        })
    }
}

export const Blocks = <TSlug extends string, const TBlocks extends Array<{ type: TSlug, fields: Record<string, IField<any, any, any>>}>>(...blocks: TBlocks) => new BlocksField(blocks)

export const Block = <TType extends string, TField extends Record<string, IField<any, any, any>>>(name: TType, fields: TField): _BlockType<{type: TType, fields: TField }, false> & Omit<PayloadBlock, "slug" | "fields"> => { 
    const elem = {
        type: name,
        fields: fields,
    }
    return elem
}

export type BlockType<TBlock extends ReturnType<typeof Block>> = BlockToField<TBlock>
