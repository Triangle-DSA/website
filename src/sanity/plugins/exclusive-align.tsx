import { useEditor, useEditorSelector } from "@portabletext/editor";
import { defineBehavior, execute } from "@portabletext/editor/behaviors";
import { isActiveDecorator } from "@portabletext/editor/selectors";
import { createElement, useEffect } from "react";
import type { PortableTextPluginsProps } from "sanity";

// CSS that makes aligned text visually align in the PTE editor.
// The AlignDecorator component renders <span data-align="...">, and
// :has() bubbles the text-align up to the Slate block element.
// Also styles the Align Left button as selected when used as the default.
const ALIGN_EDITOR_CSS = `
  [data-slate-node="element"]:has([data-align="left"]) { text-align: left; }
  [data-slate-node="element"]:has([data-align="center"]) { text-align: center; }
  [data-slate-node="element"]:has([data-align="right"]) { text-align: right; }
  [data-slate-node="element"]:has([data-align="justify"]) { text-align: justify; }
  button[aria-label="Align Left"][data-default-selected="true"] {
    background-color: var(--card-badge-default-bg-color, rgba(0, 0, 0, 0.06));
  }
`;

const ALIGN_DECORATORS = ["alignLeft", "alignCenter", "alignRight", "alignJustify"];

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
    (_, { others }) => others.map((decorator: string) => execute({ type: "decorator.remove", decorator })),
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

function AlignLeftDefaultHighlight() {
  const editor = useEditor();
  const isLeft = useEditorSelector(editor, isActiveDecorator("alignLeft"));
  const isCenter = useEditorSelector(editor, isActiveDecorator("alignCenter"));
  const isRight = useEditorSelector(editor, isActiveDecorator("alignRight"));
  const isJustify = useEditorSelector(editor, isActiveDecorator("alignJustify"));

  const anyActive = isLeft || isCenter || isRight || isJustify;

  useEffect(() => {
    const btn = document.querySelector('button[aria-label="Align Left"]');
    if (!btn) return;
    if (!anyActive) {
      btn.setAttribute("data-default-selected", "true");
    } else {
      btn.removeAttribute("data-default-selected");
    }
  }, [anyActive]);

  return null;
}

export function AlignPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {createElement("style", null, ALIGN_EDITOR_CSS)}
      {props.renderDefault(props)}
      <ExclusiveAlignPlugin />
      <AlignLeftDefaultHighlight />
    </>
  );
}
