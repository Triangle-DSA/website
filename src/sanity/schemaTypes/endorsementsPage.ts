import { defineField, defineType } from "sanity";

export interface EndorsementsPage {
  title: string;
  description: string;
  currentlyEndorsedHeading: string;
  seekingHeading: string;
  seekingDescription: any[];
  notesHeading: string;
  notes: string[];
  questionnaireLabel: string;
  questionnaireUrl: string;
}

export const endorsementsPageType = defineType({
  name: "endorsementsPage",
  title: "Endorsements Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (SEO)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (SEO)",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "currentlyEndorsedHeading",
      title: "Currently Endorsed Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seekingHeading",
      title: "Seeking Endorsement Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seekingDescription",
      title: "Seeking Endorsement Description",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notesHeading",
      title: "Notes Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Candidate Notes",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "questionnaireLabel",
      title: "Questionnaire Button Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "questionnaireUrl",
      title: "Questionnaire Button URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Endorsements Page Content",
      };
    },
  },
});
