// ./src/sanity/schemaTypes/blockContent.ts
import { createElement } from "react";
import { defineArrayMember, defineType } from "sanity";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignPlugins,
  AlignRightIcon,
} from "../plugins/exclusive-align";
import { BlockInputWithColors } from "../components/BlockInputWithColors";
import { bgColorAnnotation, textColorAnnotation } from "./colorDecorators";

// Decorator component that renders a data-align span so the editor CSS
// can apply text-align to the parent block via :has().
const AlignDecorator = (props: { children: React.ReactNode; value: string }) => {
  const align = props.value.replace("align", "").toLowerCase();
  return createElement("span", { "data-align": align }, props.children);
};

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: BlockInputWithColors as any,
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
          { title: "Align Left", value: "alignLeft", icon: AlignLeftIcon, component: AlignDecorator },
          { title: "Align Center", value: "alignCenter", icon: AlignCenterIcon, component: AlignDecorator },
          { title: "Align Right", value: "alignRight", icon: AlignRightIcon, component: AlignDecorator },
          { title: "Align Justify", value: "alignJustify", icon: AlignJustifyIcon, component: AlignDecorator },
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
          textColorAnnotation,
          bgColorAnnotation,
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
