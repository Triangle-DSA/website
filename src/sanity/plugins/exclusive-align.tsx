import { useEditor } from "@portabletext/editor";
import { defineBehavior, execute } from "@portabletext/editor/behaviors";
import type { PortableTextPluginsProps } from "sanity";
import { useEffect } from "react";

const ALIGN_DECORATORS = ["alignLeft", "alignCenter", "alignRight"];

const exclusiveAlignBehavior = defineBehavior({
  on: "decorator.add",
  guard: ({ event }) => {
    if (ALIGN_DECORATORS.includes(event.decorator)) {
      const others = ALIGN_DECORATORS.filter((d) => d !== event.decorator);
      return { others };
    }
    return false;
  },
  actions: [
    (_, { others }) =>
      others.map((decorator: string) =>
        execute({ type: "decorator.remove", decorator }),
      ),
    ({ event }) => [execute(event)],
  ],
});

function ExclusiveAlignPlugin() {
  const editor = useEditor();

  useEffect(() => {
    const unregister = editor.registerBehavior({
      behavior: exclusiveAlignBehavior,
    });
    return unregister;
  }, [editor]);

  return null;
}

export function AlignPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {props.renderDefault(props)}
      <ExclusiveAlignPlugin />
    </>
  );
}
