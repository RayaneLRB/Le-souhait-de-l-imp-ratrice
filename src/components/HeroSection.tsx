import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7850600/pexels-photo-7850600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1600"
          alt="Luxury perfume"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/40 to-noir" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/50 via-transparent to-noir/50" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-or/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="inline-block text-or/80 text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-6 sm:mb-8">
            Parfums Originaux — 100% Authentiques
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-ivoire mb-6 sm:mb-8 leading-[1.1]"
        >
          Le Souhait de
          <br />
          <span className="text-gradient-gold italic">l'Impératrice</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-cormorant text-lg sm:text-xl md:text-2xl text-ivoire/60 max-w-2xl mx-auto mb-8 sm:mb-12 italic leading-relaxed"
        >
          Les plus grandes fragrances du monde,
          <br className="hidden sm:block" />
          Dior, Chanel, Tom Ford, Creed — livrées en Algérie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => { onNavigate('catalogue'); window.scrollTo(0, 0); }}
            className="group relative px-8 sm:px-12 py-3 sm:py-4 border border-or text-or text-xs tracking-[0.2em] uppercase hover:bg-or hover:text-noir transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">Explorer la Collection</span>
          </button>
          <button
            onClick={() => { onNavigate('quiz'); window.scrollTo(0, 0); }}
            className="px-8 sm:px-12 py-3 sm:py-4 text-ivoire/50 text-xs tracking-[0.2em] uppercase hover:text-or transition-all duration-300 border border-ivoire/10 hover:border-or/30"
          >
            Trouver Votre Parfum
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-ivoire/30 text-[10px] tracking-[0.3em] uppercase">Défiler</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-or/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
