export interface DocConfig {
  slug: string;
  title: string;
}

export const docsConfig: DocConfig[] = [
  { slug: "getting-started", title: "Getting Started" },
  { slug: "auth", title: "Auth" },
  { slug: "ggaistudio", title: "GG AI integration" },
  { slug: "chatflow", title: "Academic Oracle Flow" },
];
