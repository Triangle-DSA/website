import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "socialMedia",
            ),
            S.documentTypeListItem("socialMedia")
              .title("Social Media")
              .child(
                S.documentTypeList("socialMedia")
                  .title("Social Media")
                  .defaultOrdering([{ field: "order", direction: "asc" }]),
              ),
          ]),
    }),
  ],
  schema,
});
