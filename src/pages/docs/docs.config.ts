export interface DocConfig {
  slug: string;
  title: string;
}

export const docsConfig: DocConfig[] = [
  { slug: "getting-started", title: "Getting Started" },
  { slug: "api", title: "API Reference" },
  { slug: "architecture", title: "Architecture" },
];
