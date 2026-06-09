import { defineField, defineType } from "sanity";

export interface Candidate {
  name: string;
  office: string;
  image: {
    alt?: string;
    asset?: {
      _ref: string;
      _type: string;
    };
  };
  summary: string;
  order?: number;
}

export const candidateType = defineType({
  name: "candidate",
  title: "Candidate",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "office",
      title: "Office",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order (Ascending)",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "office",
      media: "image",
    },
  },
});
