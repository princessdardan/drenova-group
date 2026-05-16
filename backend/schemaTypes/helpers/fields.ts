import {
  defineField,
  type ImageRule,
  type NumberRule,
  type StringRule,
  type TextRule,
} from "sanity";
import type { SortOrdering } from "@sanity/types";

type BaseFieldOptions = {
  name: string;
  title: string;
  description?: string;
};

type StringFieldOptions = BaseFieldOptions & {
  initialValue?: string;
  validation?: (rule: StringRule) => StringRule;
};

type TextFieldOptions = BaseFieldOptions & {
  rows?: number;
  initialValue?: string;
  validation?: (rule: TextRule) => TextRule;
};

type ImageWithAltFieldOptions = BaseFieldOptions & {
  required?: boolean;
  altRequired?: boolean;
  altDescription?: string;
  validation?: (rule: ImageRule) => ImageRule;
};

type OrderFieldOptions = {
  title?: string;
  initialValue?: number;
  validation?: (rule: NumberRule) => NumberRule;
};

export function stringField(options: StringFieldOptions) {
  return defineField({
    name: options.name,
    title: options.title,
    type: "string",
    ...(options.description ? { description: options.description } : {}),
    ...(options.initialValue !== undefined
      ? { initialValue: options.initialValue }
      : {}),
    ...(options.validation ? { validation: options.validation } : {}),
  });
}

export function requiredStringField(options: StringFieldOptions) {
  return defineField({
    name: options.name,
    title: options.title,
    type: "string",
    ...(options.description ? { description: options.description } : {}),
    ...(options.initialValue !== undefined
      ? { initialValue: options.initialValue }
      : {}),
    validation: options.validation ?? ((rule) => rule.required()),
  });
}

export function textField(options: TextFieldOptions) {
  return defineField({
    name: options.name,
    title: options.title,
    type: "text",
    ...(options.rows ? { rows: options.rows } : {}),
    ...(options.description ? { description: options.description } : {}),
    ...(options.initialValue !== undefined
      ? { initialValue: options.initialValue }
      : {}),
    ...(options.validation ? { validation: options.validation } : {}),
  });
}

export function requiredTextField(options: TextFieldOptions) {
  return defineField({
    name: options.name,
    title: options.title,
    type: "text",
    ...(options.rows ? { rows: options.rows } : {}),
    ...(options.description ? { description: options.description } : {}),
    ...(options.initialValue !== undefined
      ? { initialValue: options.initialValue }
      : {}),
    validation: options.validation ?? ((rule) => rule.required()),
  });
}

export function orderField(options: OrderFieldOptions = {}) {
  return defineField({
    name: "order",
    title: options.title ?? "Sort Order",
    type: "number",
    initialValue: options.initialValue ?? 0,
    ...(options.validation ? { validation: options.validation } : {}),
  });
}

export function orderAscOrdering(): SortOrdering {
  return {
    title: "Sort Order",
    name: "orderAsc",
    by: [{ field: "order", direction: "asc" }],
  };
}

export function imageWithAltField(options: ImageWithAltFieldOptions) {
  const altField = options.altRequired
    ? defineField({
        name: "alt",
        title: "Alt Text",
        type: "string",
        ...(options.altDescription
          ? { description: options.altDescription }
          : {}),
        validation: (rule) => rule.required(),
      })
    : defineField({
        name: "alt",
        title: "Alt Text",
        type: "string",
        ...(options.altDescription
          ? { description: options.altDescription }
          : {}),
      });

  if (options.required) {
    return defineField({
      name: options.name,
      title: options.title,
      type: "image",
      options: { hotspot: true },
      fields: [altField],
      ...(options.description ? { description: options.description } : {}),
      validation: options.validation ?? ((rule) => rule.required()),
    });
  }

  return defineField({
    name: options.name,
    title: options.title,
    type: "image",
    options: { hotspot: true },
    fields: [altField],
    ...(options.description ? { description: options.description } : {}),
    ...(options.validation ? { validation: options.validation } : {}),
  });
}

export function heroField() {
  return defineField({
    name: "hero",
    title: "Hero Section",
    type: "heroSettings",
    validation: (rule) => rule.required(),
  });
}

export function ctaField() {
  return defineField({
    name: "cta",
    title: "CTA Section",
    type: "ctaSettings",
  });
}

export function sectionHeadingField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "sectionHeading",
  });
}
