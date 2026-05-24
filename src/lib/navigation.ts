export const sectionAnchors = ['hero'] as const;

export type SectionAnchor = (typeof sectionAnchors)[number];
