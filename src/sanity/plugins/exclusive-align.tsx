import { useEditor, useEditorSelector } from "@portabletext/editor";
import { defineBehavior, execute } from "@portabletext/editor/behaviors";
import { isActiveDecorator } from "@portabletext/editor/selectors";
import { Button, Menu, MenuButton, MenuItem } from "@sanity/ui";
import { createElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PortableTextPluginsProps } from "sanity";

export const AlignLeftIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

export const AlignCenterIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 3.5, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 2, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

export const AlignRightIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 6, y: 7.25, width: 9, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 3, y: 11.5, width: 12, height: 1.5, rx: 0.5 }),
  );

export const AlignJustifyIcon = () =>
  createElement(
    "svg",
    { width: "1em", height: "1em", viewBox: "0 0 16 16", fill: "currentColor" },
    createElement("rect", { x: 1, y: 3, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 7.25, width: 14, height: 1.5, rx: 0.5 }),
    createElement("rect", { x: 1, y: 11.5, width: 14, height: 1.5, rx: 0.5 }),
  );

const ALIGN_DECORATORS = ["alignLeft", "alignCenter", "alignRight", "alignJustify"] as const;

const ALIGN_OPTIONS = [
  { value: "alignLeft", label: "Align Left", Icon: AlignLeftIcon },
  { value: "alignCenter", label: "Align Center", Icon: AlignCenterIcon },
  { value: "alignRight", label: "Align Right", Icon: AlignRightIcon },
  { value: "alignJustify", label: "Align Justify", Icon: AlignJustifyIcon },
] as const;

// CSS that makes aligned text visually align in the PTE editor, and hides
// the built-in alignment toolbar buttons (replaced by the AlignMenuButton portal).
// The AlignDecorator component renders <span data-align="...">, and
// :has() bubbles the text-align up to the Slate block element.
const ALIGN_EDITOR_CSS = `
  [data-slate-node="element"]:has([data-align="left"]) { text-align: left; }
  [data-slate-node="element"]:has([data-align="center"]) { text-align: center; }
  [data-slate-node="element"]:has([data-align="right"]) { text-align: right; }
  [data-slate-node="element"]:has([data-align="justify"]) { text-align: justify; }
  button[aria-label="Align Left"],
  button[aria-label="Align Center"],
  button[aria-label="Align Right"],
  button[aria-label="Align Justify"] { display: none !important; }
`;

const exclusiveAlignBehavior = defineBehavior({
  on: "decorator.add",
  guard: ({ event }) => {
    if (ALIGN_DECORATORS.includes(event.decorator as (typeof ALIGN_DECORATORS)[number])) {
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

function AlignMenuButton() {
  const editor = useEditor();
  const isLeft = useEditorSelector(editor, isActiveDecorator("alignLeft"));
  const isCenter = useEditorSelector(editor, isActiveDecorator("alignCenter"));
  const isRight = useEditorSelector(editor, isActiveDecorator("alignRight"));
  const isJustify = useEditorSelector(editor, isActiveDecorator("alignJustify"));

  const active: (typeof ALIGN_DECORATORS)[number] = isCenter
    ? "alignCenter"
    : isRight
    ? "alignRight"
    : isJustify
    ? "alignJustify"
    : "alignLeft";

  const ActiveIcon = ALIGN_OPTIONS.find((o) => o.value === active)!.Icon;

  return (
    <MenuButton
      id="pte-align-menu"
      button={
        <Button
          mode="bleed"
          padding={2}
          fontSize={1}
          icon={ActiveIcon}
          title="Text alignment"
          aria-label="Text alignment"
        />
      }
      menu={
        <Menu>
          {ALIGN_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              icon={opt.Icon}
              text={opt.label}
              pressed={opt.value === active}
              onClick={() => editor.send({ type: "decorator.toggle", decorator: opt.value })}
            />
          ))}
        </Menu>
      }
      popover={{ portal: true }}
    />
  );
}

// Mounts AlignMenuButton into the PTE toolbar via a portal, in the slot
// where the (now hidden) built-in alignment buttons used to live.
function AlignMenuPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const find = () => {
      const btn = document.querySelector("button[aria-label=\"Align Left\"]");
      const parent = btn?.parentElement;
      if (!parent) return;
      let placeholder = parent.querySelector<HTMLElement>("[data-align-menu-slot]");
      if (!placeholder) {
        placeholder = document.createElement("span");
        placeholder.setAttribute("data-align-menu-slot", "");
        parent.insertBefore(placeholder, btn!);
      }
      setTarget((prev) => (prev === placeholder ? prev : placeholder));
    };
    find();
    const observer = new MutationObserver(find);
    observer.observe(document.body, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  if (!target) return null;
  return createPortal(<AlignMenuButton />, target);
}

export function AlignPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {createElement("style", null, ALIGN_EDITOR_CSS)}
      {props.renderDefault(props)}
      <ExclusiveAlignPlugin />
      <AlignMenuPortal />
    </>
  );
}
