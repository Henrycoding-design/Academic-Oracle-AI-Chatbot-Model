interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
        {title}
      </h1>
      <p className="mt-4 text-white/60 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </header>
  );
}
