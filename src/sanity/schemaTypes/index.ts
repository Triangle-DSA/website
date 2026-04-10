// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContent";
import { campaignType } from "./campaign";
import { categoryType } from "./category";
import { homepageContentType } from "./homepageContent";
import { postType } from "./post";
import { programItemType } from "./programItem";
import { socialMediaType } from "./socialMedia";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    campaignType,
    categoryType,
    homepageContentType,
    postType,
    programItemType,
    socialMediaType,
  ],
};
