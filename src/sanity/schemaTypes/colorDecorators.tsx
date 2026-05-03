import React, { createElement } from "react";
import type { BlockAnnotationProps, PortableTextPluginsProps } from "sanity";

export type ColorName =
  | "black"
  | "white"
  | "darkGrey"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "purple"
  | "pink"
  | "brown";

export const COLORS: { name: ColorName; title: string; hex: string }[] = [
  { name: "black", title: "Black", hex: "#000000" },
  { name: "white", title: "White", hex: "#ffffff" },
  { name: "darkGrey", title: "Dark Grey", hex: "#424242" },
  { name: "red", title: "Red", hex: "#d32f2f" },
  { name: "orange", title: "Orange", hex: "#ef6c00" },
  { name: "yellow", title: "Yellow", hex: "#f9d423" },
  { name: "green", title: "Green", hex: "#2e7d32" },
  { name: "teal", title: "Teal", hex: "#00897b" },
  { name: "blue", title: "Blue", hex: "#1976d2" },
  { name: "purple", title: "Purple", hex: "#7b1fa2" },
  { name: "pink", title: "Pink", hex: "#c2185b" },
  { name: "brown", title: "Brown", hex: "#6d4c41" },
];

const colorList = COLORS.map(({ name, title }) => ({ title, value: name }));

const TextColorIcon = () => (
  <span
    aria-hidden
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      fontWeight: 700,
      borderBottom: "3px solid #d32f2f",
      lineHeight: 1,
    }}
  >
    A
  </span>
);

const BgColorIcon = () => (
  <span
    aria-hidden
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      backgroundColor: "#f9d423",
      borderRadius: "2px",
      fontWeight: 700,
    }}
  >
    A
  </span>
);

const colorPreview = (label: string) => ({
  select: { color: "color" },
  prepare({ color }: { color?: string }) {
    const match = COLORS.find((c) => c.name === color);
    return { title: `${label}: ${match?.title ?? color ?? "—"}` };
  },
});

const TextColorAnnotationComponent = (props: BlockAnnotationProps) => {
  const color = (props.value as { color?: string })?.color;
  return <span data-text-color={color}>{props.renderDefault(props)}</span>;
};

const BgColorAnnotationComponent = (props: BlockAnnotationProps) => {
  const color = (props.value as { color?: string })?.color;
  return <span data-bg-color={color}>{props.renderDefault(props)}</span>;
};

// CSS injected into the PTE editor so that text-color / bg-color annotations
// preview their selected color. !important is required to win over the
// editor's default annotation styles (gray background + theme color).
const COLOR_EDITOR_CSS = COLORS.map(({ name, hex }) =>
  `[data-text-color="${name}"], [data-text-color="${name}"] * { color: ${hex} !important; }
[data-bg-color="${name}"], [data-bg-color="${name}"] * { background-color: ${hex} !important; }`
).join("\n") + `
button[aria-label="Text Color"],
button[aria-label="Background Color"] { display: none !important; }`;

export function ColorPlugins(props: PortableTextPluginsProps) {
  return (
    <>
      {createElement("style", null, COLOR_EDITOR_CSS)}
      {props.renderDefault(props)}
    </>
  );
}

export const textColorAnnotation = {
  name: "textColor",
  title: "Text Color",
  type: "object",
  icon: TextColorIcon,
  fields: [
    {
      name: "color",
      title: "Color",
      type: "string",
      options: { list: colorList },
    },
  ],
  preview: colorPreview("Text"),
  components: {
    annotation: TextColorAnnotationComponent,
  },
};

export const bgColorAnnotation = {
  name: "bgColor",
  title: "Background Color",
  type: "object",
  icon: BgColorIcon,
  fields: [
    {
      name: "color",
      title: "Color",
      type: "string",
      options: { list: colorList },
    },
  ],
  preview: colorPreview("Background"),
  components: {
    annotation: BgColorAnnotationComponent,
  },
};
