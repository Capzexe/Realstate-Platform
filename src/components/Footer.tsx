import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: {
      title: "Platforma",
      links: [
        { label: "Meklēt īpašumu", href: "#search-homepage" },
        { label: "Cenu plāni", href: "#cenas" },
        { label: "Atskaišu piemēri", href: "#atskaites-piemers" },
      ],
    },
    support: {
      title: "Atbalsts",
      links: [
        { label: "Kontakti", href: "#kontakti" },
        { label: "Biežāk uzdotie jautājumi", href: "#" },
      ],
    },
    legal: {
      title: "Juridiskā informācija",
      links: [
        { label: "Privātuma politika", href: "#" },
        { label: "Lietošanas noteikumi", href: "#" },
        { label: "Sīkdatņu politika", href: "#" },
        { label: "Atteikuma tiesības", href: "#" },
      ],
    },
  };

  const contactInfo = [
    { icon: Mail, text: "info@verisale.ai", href: "mailto:info@verisale.ai" },
    { icon: Phone, text: "+371 67 123 456", href: "tel:+37167123456" },
    { icon: MapPin, text: "Rīga, Latvija", href: "#" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer
      className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800/80"
      id="app-footer"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Column - spans 2 columns */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm font-serif">
                  V
                </span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight font-serif">
                VeriSale<span className="text-indigo-400">.ai</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Latvijas nekustamā īpašuma darījumu vēstures datu platforma. Ātra,
              droša un caurskatāma piekļuve oficiālajiem reģistriem.
            </p>

            {/* Contact details */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-800/80 flex items-center justify-center group-hover:bg-indigo-900/50 transition-colors">
                    <item.icon className="w-3 h-3" />
                  </div>
                  {item.text}
                </a>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-indigo-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <social.icon className="w-4 h-4 text-slate-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5 font-mono">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                    >
                      <span>{link.label}</span>
                      {(link as any).badge && (
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                          {(link as any).badge}
                        </span>
                      )}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-60 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
              <span>© {currentYear} VeriSale Inc.</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span>Visas tiesības aizsargātas.</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span className="flex items-center gap-1">
                Veidots ar{" "}
                <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />{" "}
                Latvijā
              </span>
            </div>

            <div className="flex items-center gap-6 text-[10px]">
              <a
                href="#"
                className="text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-mono"
              >
                Privātuma politika
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-mono"
              >
                Sīkdatnes
              </a>
              <a
                href="#"
                className="text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider font-mono"
              >
                Noteikumi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
