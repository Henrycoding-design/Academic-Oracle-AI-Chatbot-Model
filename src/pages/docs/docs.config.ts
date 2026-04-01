export interface DocConfig {
  slug: string;
  title: string;
}

export const docsConfig: DocConfig[] = [
  { slug: "getting-started", title: "Getting Started" },
  { slug: "auth", title: "Account & Access" },
  { slug: "aistudio", title: "Integration Notes" },
  { slug: "chatflow", title: "Learning Flow" },
];
