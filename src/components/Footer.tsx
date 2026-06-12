import { Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onAdminAccess?: () => void;
}

export default function Footer({ onNavigate, onAdminAccess }: FooterProps) {
  return (
    <footer className="bg-noir border-t border-or/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 border border-or/60 flex items-center justify-center">
                <span className="font-playfair text-or text-base font-bold">SI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-ivoire text-xs tracking-[0.15em] leading-none">LE SOUHAIT DE</span>
                <span className="text-gradient-gold font-playfair text-sm tracking-[0.2em] leading-none mt-0.5">L'IMPÉRATRICE</span>
              </div>
            </div>
            <p className="text-ivoire/50 text-sm leading-relaxed mb-6">
              Votre destination pour les plus grandes fragrances du monde. 
              Parfums 100% originaux des plus grandes maisons internationales.
            </p>
            <div className="flex gap-4">
              {[Mail, MapPin, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 border border-ivoire/20 flex items-center justify-center text-ivoire/50 hover:border-or hover:text-or transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-playfair text-or text-sm tracking-[0.15em] uppercase mb-6">Navigation</h4>
            <ul className="space-y-3">
              {['Accueil', 'Catalogue', 'Assistant Parfum', 'Journal', 'Contact'].map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      onNavigate(['home', 'catalogue', 'quiz', 'journal', 'contact'][i]);
                      window.scrollTo(0, 0);
                    }}
                    className="text-ivoire/50 text-sm hover:text-or transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-playfair text-or text-sm tracking-[0.15em] uppercase mb-6">Collections</h4>
            <ul className="space-y-3">
              {['Les Intemporels', 'Les Jardins', 'Héritage', 'Éditions Limitées'].map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => { onNavigate('catalogue'); window.scrollTo(0, 0); }}
                    className="text-ivoire/50 text-sm hover:text-or transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-or text-sm tracking-[0.15em] uppercase mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-or mt-0.5 shrink-0" />
                <span className="text-ivoire/50 text-sm">Rue Didouche Mourad, Alger Centre, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-or shrink-0" />
                <span className="text-ivoire/50 text-sm">+213 (0) 21 XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-or shrink-0" />
                <span className="text-ivoire/50 text-sm">contact@souhait-imperatrice.dz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="line-gold mb-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-ivoire/30 text-xs tracking-wider">
            © 2025 Le Souhait de l'Impératrice. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-ivoire/20 text-xs tracking-wider font-cormorant italic">
              Les plus grandes fragrances du monde, livrées chez vous
            </p>
            {onAdminAccess && (
              <button onClick={onAdminAccess} className="text-ivoire/10 hover:text-or/40 transition-colors text-[10px]" title="Admin">
                ⚙
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
