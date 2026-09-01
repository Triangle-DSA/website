import { defineField, defineType } from "sanity";

export interface CarouselSlide {
  label: string;
  image?: {
    alt?: string;
    asset?: {
      _ref: string;
      _type: string;
    };
  };
}

export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    carousel?: CarouselSlide[];
  };
  about: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
  };
  join: {
    heading: string;
    text: string;
    duesInfo: string;
  };
}

export const homepageContentType = defineType({
  name: "homepageContent",
  title: "Homepage Content",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "carousel",
          title: "Carousel Slides",
          type: "array",
          of: [
            {
              type: "object",
              name: "slide",
              title: "Slide",
              fields: [
                {
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
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
                    },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "about",
      title: "About",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "paragraph1",
          title: "Paragraph 1",
          type: "text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "paragraph2",
          title: "Paragraph 2",
          type: "text",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "join",
      title: "Join",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "duesInfo",
          title: "Dues Info",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Content",
      };
    },
  },
});
