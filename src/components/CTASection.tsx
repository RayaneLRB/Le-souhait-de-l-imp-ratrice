import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface CTASectionProps {
  onNavigate: (page: string) => void;
}

export default function CTASection({ onNavigate }: CTASectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-24 sm:py-36 overflow-hidden">
      {/* BG Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/36834015/pexels-photo-36834015.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1600"
          alt="Luxury perfume"
          className="w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-noir/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/50 to-noir" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase block mb-6">Besoin d'aide ?</span>
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mb-6 leading-tight">
          Trouvez le parfum
          <br />
          <span className="italic text-gradient-gold">qui vous ressemble</span>
        </h2>
        <p className="font-cormorant text-ivoire/50 text-lg sm:text-xl italic mb-10 max-w-xl mx-auto">
          Notre quiz olfactif analyse vos préférences parmi +250 fragrances pour vous guider vers la fragrance idéale
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => { onNavigate('quiz'); window.scrollTo(0, 0); }}
            className="px-10 sm:px-14 py-3 sm:py-4 bg-or text-noir text-xs tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors duration-300"
          >
            Commencer l'expérience
          </button>
          <button
            onClick={() => { onNavigate('contact'); window.scrollTo(0, 0); }}
            className="px-10 sm:px-14 py-3 sm:py-4 border border-ivoire/20 text-ivoire/60 text-xs tracking-[0.2em] uppercase hover:border-or hover:text-or transition-all duration-300"
          >
            Prendre rendez-vous
          </button>
        </div>
      </motion.div>
    </section>
  );
}
