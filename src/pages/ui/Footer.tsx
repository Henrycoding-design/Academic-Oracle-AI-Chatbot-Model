//  pages/home/Footer.tsx  
export default function Footer() {
    const year = new Date().getFullYear();
    return (
      <footer className="mt-24 pb-8 px-4 text-center text-sm text-white/40 pt-14">
        <p>© {year} Academic Oracle</p>
        <p className="mt-1">
          Built by the Academic Oracle Team · <span className="text-white/60">Vo Tan Binh (Henry Vo)</span>
        </p>
      </footer>
    );
}