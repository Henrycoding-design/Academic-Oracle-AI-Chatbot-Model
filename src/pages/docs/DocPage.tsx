import { useParams, Navigate } from "react-router-dom";
import DocsSidebar from "./DocsSidebar";
import { docsConfig } from "./docs.config";
import { docsContent } from "./docs.content";

export default function DocPage() {
  const { slug } = useParams<{ slug: string }>();

  const exists = docsConfig.some(d => d.slug === slug);

  if (!slug || !exists) {
    return <Navigate to="/docs/getting-started" replace />;
  }

  return (
    <DocsSidebar>
      {docsContent[slug]}
    </DocsSidebar>
  );
}
