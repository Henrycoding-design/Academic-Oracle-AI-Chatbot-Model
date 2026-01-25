import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  tag?: string; // e.g. "Products", "Developers"
  title: string;
  subtitle: string;
  button?: string;
  btnLink?: string;
  imgLink?: string;
}

export default function PageHeader({
  tag = "Page",
  title,
  subtitle,
  button = "Try Now", 
  btnLink = "#",
  imgLink = "#",
}: PageHeaderProps) {
  return (
    <header className="max-w-6xl mx-auto px-6 pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT: Text content */}
        <div className="text-left">
          {/* Page tag */}
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-indigo-400 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{tag}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-white/60 max-w-xl leading-relaxed">
            {subtitle}
          </p>

          {/* CTA button */}
          <div className="mt-10">
            <a
              href={btnLink}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              {button}
            </a>
          </div>
        </div>

        {/* RIGHT: Image / visual */}
        <div className="relative">
          {/* Gradient shadow */}
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-blue-600/20 blur-2xl" />

          {/* Image frame */}
          <div className="relative rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden h-[420px]">
            <img
              src={imgLink}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
