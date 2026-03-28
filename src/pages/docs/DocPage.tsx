import { useEffect } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import DocsSidebar from "./DocsSidebar";
import { docsConfig } from "./docs.config";
import { docsContent } from "./docs.content";

export default function DocPage() {
  const { slug } = useParams<{ slug: string }>();
  const { hash } = useLocation();

  const exists = docsConfig.some(d => d.slug === slug);

  useEffect(() => {
    if (!slug || hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug, hash]);

  if (!slug || !exists) {
    return <Navigate to="/docs/getting-started" replace />;
  }

  return (
    <DocsSidebar>
      {docsContent[slug]}
    </DocsSidebar>
  );
}
