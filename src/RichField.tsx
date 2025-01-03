import { ReactNode } from "react";
import { BaseDataField, SpecificField } from "./baseField";
import { RichText as Renderer } from "@payloadcms/richtext-lexical/react";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

class RichTextField extends BaseDataField<
  SerializedEditorState,
  ReactNode | undefined,
  "richText",
  SpecificField<"richText">
> {
  constructor() {
    super("richText");
  }

  protected hydrateFromPayload(value: SerializedEditorState): ReactNode {
    return <Renderer data={value} />;
  }
}

export function RichText() {
  return new RichTextField();
}
