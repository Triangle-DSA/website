import { PortableTextEditor } from "@portabletext/editor";
import { Box, Button, Card, Flex, Menu, MenuButton, MenuItem, Stack } from "@sanity/ui";
import React, { useCallback, useMemo, useRef } from "react";
import { type ArraySchemaType, type ObjectSchemaType, PortableTextInput, type PortableTextInputProps } from "sanity";
import { COLORS } from "../schemaTypes/colorDecorators";

const findAnnotationSchema = (
  schemaType: ArraySchemaType,
  annotationName: string,
): ObjectSchemaType | undefined => {
  const blockMember = schemaType.of?.find(
    (member) => (member as { name?: string }).name === "block",
  ) as ObjectSchemaType | undefined;
  if (!blockMember) return undefined;
  const markDefsField = blockMember.fields?.find((f) => f.name === "markDefs");
  if (!markDefsField) return undefined;
  const arrayType = markDefsField.type as ArraySchemaType;
  const annotation = arrayType.of?.find(
    (member) => (member as { name?: string }).name === annotationName,
  ) as ObjectSchemaType | undefined;
  return annotation;
};

type ColorDropdownProps = {
  label: string;
  editorRef: React.MutableRefObject<PortableTextEditor | null>;
  annotationSchema?: ObjectSchemaType;
  swatchKind: "text" | "bg";
};

const ColorDropdown: React.FC<ColorDropdownProps> = ({
  label,
  editorRef,
  annotationSchema,
  swatchKind,
}) => {
  const apply = useCallback(
    (color: string) => {
      const editor = editorRef.current;
      if (!editor || !annotationSchema) return;
      PortableTextEditor.addAnnotation(editor, annotationSchema, { color });
    },
    [editorRef, annotationSchema],
  );

  return (
    <MenuButton
      id={`color-menu-${swatchKind}`}
      button={
        <Button
          mode="bleed"
          padding={2}
          fontSize={1}
          text={label}
          disabled={!annotationSchema}
        />
      }
      menu={
        <Menu>
          {COLORS.map(({ name, title, hex }) => (
            <MenuItem
              key={name}
              onClick={() => apply(name)}
              text={title}
              icon={() => (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: "1em",
                    height: "1em",
                    background: swatchKind === "text" ? "transparent" : hex,
                    color: hex,
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: "2px",
                    textAlign: "center",
                    lineHeight: "1em",
                    fontWeight: 700,
                  }}
                >
                  {swatchKind === "text" ? "A" : ""}
                </span>
              )}
            />
          ))}
        </Menu>
      }
      popover={{ portal: true, placement: "bottom-start" }}
    />
  );
};

export const BlockInputWithColors: React.FC<PortableTextInputProps> = (props) => {
  const editorRef = useRef<PortableTextEditor | null>(null);

  const textColorSchema = useMemo(
    () => findAnnotationSchema(props.schemaType, "textColor"),
    [props.schemaType],
  );
  const bgColorSchema = useMemo(
    () => findAnnotationSchema(props.schemaType, "bgColor"),
    [props.schemaType],
  );

  return (
    <Stack space={1}>
      <Card padding={1} radius={2} shadow={1} tone="default">
        <Flex align="center" gap={1}>
          <Box paddingX={2} paddingY={1} style={{ fontSize: 12, opacity: 0.7 }}>
            Color:
          </Box>
          <ColorDropdown
            label="Text"
            editorRef={editorRef}
            annotationSchema={textColorSchema}
            swatchKind="text"
          />
          <ColorDropdown
            label="Background"
            editorRef={editorRef}
            annotationSchema={bgColorSchema}
            swatchKind="bg"
          />
        </Flex>
      </Card>
      <PortableTextInput {...props} editorRef={editorRef} />
    </Stack>
  );
};
