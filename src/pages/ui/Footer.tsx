import { MailIcon } from "lucide-react";
//  pages/home/Footer.tsx  
export default function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer className="mt-24 pt-14 pb-8 px-4 text-center text-sm text-white/40">
        <div className="space-y-1">
          <p>© {year} <span className="font-bold">Academic Oracle</span></p>
          <p>
            Built by the Academic Oracle Team · 
            <span className="text-white/60"> Vo Tan Binh (Henry Vo)</span>
          </p>
        </div>

        <a
          href="mailto:tanbinhvo.hcm@gmail.com"
          className="mt-3 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1"
        >
          <MailIcon className="w-4 h-4 mr-1" />
          Contact: tanbinhvo.hcm@gmail.com
        </a>
      </footer>
    );
}