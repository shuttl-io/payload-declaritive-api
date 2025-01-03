import { cache, ComponentType, memo } from "react";
import { Collection, IField, RecordToObject } from "./baseTypes";
import {
  BaseDataField,
  PayloadField,
  recordToList,
  SpecificField,
} from "./baseField";

import { Block as PayloadBlock } from "payload";
import { cloneDeep } from "lodash";

type _BlockType<
  TFields extends {
    type: string;
    fields: Record<string, IField<any, any, any>>;
  },
  renderBlock extends boolean,
> = {
  type: TFields["type"];
  fields: TFields["fields"];
};

type BlocksToUnion<
  TBlock extends _BlockType<
    { type: string; fields: Record<string, IField<any, any, any>> },
    boolean
  >[],
> = TBlock extends [infer First, ...infer Rest]
  ? First extends {
      type: string;
      fields: Record<string, IField<any, any, any>>;
    }
    ? Rest extends {
        type: string;
        fields: Record<string, IField<any, any, any>>;
      }[]
      ? [BlockToField<First>, ...BlocksToUnion<Rest>]
      : [BlockToField<First>]
    : []
  : [];

type BlockToField<
  TBlock extends _BlockType<
    { type: string; fields: Record<string, IField<any, any, any>> },
    boolean
  >,
> = RecordToObject<TBlock["fields"]> & { type: TBlock["type"] };
// type BlockToField<TBlock extends _BlockType<{ type: string, fields: Record<string, IField<any, any, any>>}, boolean>> = {
//     type: TBlock["type"]
//     data: RecordToObject<TBlock["fields"]>
//     component: ReturnType<NonNullable<TBlock["render"]>>
// }

class BlocksField<
  TSlug extends string,
  const TBlocks extends Array<{
    type: TSlug;
    fields: Record<string, IField<any, any, any>>;
  }>,
> extends BaseDataField<
  { blockType: TSlug; [key: string]: any }[],
  BlocksToUnion<TBlocks>[number][] | undefined,
  "blocks",
  SpecificField<"blocks">
> {
  private readonly blockMap: Record<TSlug, _BlockType<TBlocks[number], false>>;
  constructor(blocks: TBlocks) {
    super("blocks");
    this._options.blocks = blocks.map(({ type, ...block }) => ({
      ...block,
      slug: type,
      fields: recordToList(block.fields).map((b) => b.toPayloadField()),
    }));

    this.blockMap = blocks.reduce(
      (acc, block) => {
        acc[block.type] = block;
        return acc;
      },
      {} as Record<TSlug, TBlocks[number]>
    );
  }

  withMinRows(len: number): this {
    const elem = cloneDeep(this);
    elem._options.minRows = len;
    return elem;
  }

  withMaxRows(len: number): this {
    const elem = cloneDeep(this);
    elem._options.maxRows = len;
    return elem;
  }

  collapsed(): this {
    return this.setAdminValue("initCollapsed", true);
  }

  notSortable(): this {
    return this.setAdminValue("isSortable", false);
  }

  sortable(): this {
    return this.setAdminValue("isSortable", true);
  }

  protected hydrateFromPayload(
    value: { [key: string]: any; blockType: TSlug }[]
  ): BlocksToUnion<TBlocks>[number][] | undefined {
    return value.map((blockConf) => {
      const block = this.blockMap[blockConf.blockType];

      const data = Object.entries(block.fields).reduce(
        (acc, [key, field]) => {
          acc[key] = field.hydrate(blockConf[key]);
          return acc;
        },
        {} as BlocksToUnion<TBlocks>[number]["data"]
      );

      return {
        type: blockConf.blockType,
        ...data,
      };
    });
  }
}

export const Blocks = <
  TSlug extends string,
  const TBlocks extends Array<{
    type: TSlug;
    fields: Record<string, IField<any, any, any>>;
  }>,
>(
  ...blocks: TBlocks
) => new BlocksField(blocks);

type _BlockFieldType<
  TType extends string,
  TField extends Record<string, IField<any, any, any>>,
> = _BlockType<{ type: TType; fields: TField }, false> & {};
class _BlockField<
  TType extends string,
  TField extends Record<string, IField<any, any, any>>,
> implements _BlockFieldType<TType, TField>
{
  public render?:
    | ((props: RecordToObject<TField>) => React.ReactNode)
    | undefined;
  constructor(
    public type: TType,
    public fields: TField
  ) {
    this.render = () => null;
  }
}

export const Block = <
  TType extends string,
  TField extends Record<string, IField<any, any, any>>,
>(
  name: TType,
  fields: TField
): _BlockType<{ type: TType; fields: TField }, false> &
  Omit<PayloadBlock, "slug" | "fields"> & {} => {
  return new _BlockField(name, fields);
};

export type BlockType<TBlock extends ReturnType<typeof Block>> =
  BlockToField<TBlock>;

const blockCache = cache(
  () =>
    ({ blocks: globalBlocks }) as { blocks: Record<string, ComponentType<any>> }
);

const globalBlocks: Record<string, ComponentType<any>> = {};

export function localBindBlockToComponent<
  TBlock extends _BlockType<
    { type: string; fields: Record<string, IField<any, any, any>> },
    false
  >,
>(block: TBlock, component: ComponentType<BlockToField<TBlock>>) {
  const cache = blockCache();
  cache.blocks = {
    ...cache.blocks,
    [block.type]: component,
  };
}

export function bindBlockToComponent<
  TBlock extends _BlockType<
    { type: string; fields: Record<string, IField<any, any, any>> },
    false
  >,
>(block: TBlock, component: ComponentType<BlockToField<TBlock>>) {
  globalBlocks[block.type] = component;
}

export const BlockRenderer = (props: {
  blocks: (
    | BlockToField<_BlockType<{ fields: any; type: string }, boolean>>
    | null
    | undefined
  )[];
}) => {
  const components = props.blocks.map((block, ndx) => {
    if (!block) {
      return null;
    }
    const Component = blockCache().blocks[block.type];
    if (Component === undefined) {
      console.warn(`Component of type ${block.type} not bound, returning null`);
      return null;
    }
    return <Component {...block} key={`${block.type}-${ndx}`} />;
  });
  return <>{components}</>;
};
