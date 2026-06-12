import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const marques = [
  'Dior', 'Chanel', 'Tom Ford', 'Creed', 'Amouage',
  'Versace', 'YSL', 'Armani', 'Prada', 'Gucci',
  'Hermès', 'Givenchy', 'Valentino', 'Burberry', 'MFK',
  'Nishane', 'Xerjoff', 'Montale', 'Mancera', 'Lattafa',
];

export default function MarquesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-noir-light relative overflow-hidden border-t border-b border-or/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <span className="text-or/40 text-[10px] tracking-[0.4em] uppercase">Nos marques disponibles</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {marques.map((marque, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
              className="font-playfair text-ivoire/20 text-sm sm:text-base tracking-[0.15em] hover:text-or/50 transition-colors duration-500 cursor-default"
            >
              {marque}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
