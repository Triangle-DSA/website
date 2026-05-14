import { defineField, defineType } from "sanity";

export interface SocialMedia {
  platform: string;
  label: string;
  url: string;
  icon?: { asset: { _ref: string; _type: string } };
  order?: number;
}

export const socialMediaType = defineType({
  name: "socialMedia",
  title: "Social Media",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Displayed text for the link (e.g. @ncdsa or contact@ncdsa.org)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
      description: "Link target, such as https://... or mailto:...",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) {
            return "URL is required";
          }
          if (value.startsWith("https://") || value.startsWith("http://") || value.startsWith("mailto:")) {
            return true;
          }
          return "URL must start with https://, http://, or mailto:";
        }),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Optional icon image to show in the Get Involved list",
      options: { hotspot: false },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: async (_params, context) => {
        const client = context.getClient({ apiVersion: "2026-02-21" });
        const max = await client.fetch<number | null>(`*[_type == "socialMedia"] | order(order desc)[0].order`);
        return (max ?? -1) + 1;
      },
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
      title: "platform",
      subtitle: "label",
      media: "icon",
    },
  },
});
