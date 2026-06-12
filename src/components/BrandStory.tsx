import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function BrandStory() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-32 bg-noir relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,169,110,0.05)_0%,_transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/15129287/pexels-photo-15129287.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Artisanat algérien"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-noir/30" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-or/30" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-or/30" />

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 -right-2 sm:right-8 bg-glass p-6 sm:p-8"
            >
              <span className="font-playfair text-3xl sm:text-4xl text-gradient-gold">250+</span>
              <p className="text-ivoire/50 text-xs tracking-wider mt-1">Parfums disponibles</p>
            </motion.div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Notre Mission</span>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-8 leading-tight">
              Pourquoi
              <br />
              <span className="italic text-gradient-gold">Nous Choisir</span>
            </h2>

            <div className="space-y-6 text-ivoire/60 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-ivoire/80">Le Souhait de l'Impératrice</strong> vous donne accès aux plus 
                grandes fragrances du monde, directement en Algérie. Nous sélectionnons avec soin chaque flacon auprès 
                de distributeurs agréés pour vous garantir des parfums <strong className="text-ivoire/80">100% originaux et authentiques</strong>.
              </p>
              <p>
                De Dior à Tom Ford, de Chanel à Creed, des créations niche Xerjoff aux classiques Versace — 
                notre catalogue rassemble les fragrances les plus désirées au monde. Chaque parfum est stocké 
                dans des conditions optimales et livré avec soin partout en Algérie.
              </p>
              <p className="font-cormorant text-lg sm:text-xl italic text-or/70">
                "Le luxe de la parfumerie internationale, enfin accessible en Algérie."
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              {[
                { label: '100% Original', desc: 'Parfums authentiques garantis' },
                { label: 'Livraison DZ', desc: 'Partout en Algérie' },
                { label: '+250 Parfums', desc: 'Les plus grandes marques' },
                { label: 'Conseil Expert', desc: 'Accompagnement personnalisé' },
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="border-l border-or/30 pl-4"
                >
                  <h4 className="text-ivoire text-sm font-medium mb-1">{value.label}</h4>
                  <p className="text-ivoire/40 text-xs">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
