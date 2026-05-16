export function fixedTitlePreview(title: string) {
  return {
    prepare: () => ({ title }),
  };
}

export function titlePreview(fieldName = "title") {
  return {
    select: { title: fieldName },
  };
}

export function titleSubtitlePreview(
  titleFieldName = "title",
  subtitleFieldName = "subtitle",
) {
  return {
    select: { title: titleFieldName, subtitle: subtitleFieldName },
  };
}
