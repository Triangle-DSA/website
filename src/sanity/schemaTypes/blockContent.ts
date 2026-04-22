// ./src/sanity/schemaTypes/blockContent.ts
import { createElement } from "react";
import { defineArrayMember, defineType } from "sanity";
import { AlignPlugins } from "../plugins/exclusive-align";

const AlignLeftIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

const AlignCenterIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 3.5, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 2, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

const AlignRightIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 6, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 3, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  components: {
    portableText: {
      plugins: AlignPlugins,
    },
  },
  of: [
    defineArrayMember({
      type: "block",
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Align Left", value: "alignLeft", icon: AlignLeftIcon },
          { title: "Align Center", value: "alignCenter", icon: AlignCenterIcon },
          { title: "Align Right", value: "alignRight", icon: AlignRightIcon },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
  ],
});
