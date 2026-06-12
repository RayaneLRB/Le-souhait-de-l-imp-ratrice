import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Leaf, Gem, Heart, Shield } from 'lucide-react';

const engagements = [
  {
    icon: Shield,
    title: '100% Originaux',
    description: 'Tous nos parfums sont authentiques, sourcés auprès de distributeurs agréés par les marques.',
  },
  {
    icon: Gem,
    title: '+250 Références',
    description: 'Le catalogue le plus complet d\'Algérie : Dior, Chanel, Tom Ford, Creed, Amouage et bien plus.',
  },
  {
    icon: Heart,
    title: 'Conseil Expert',
    description: 'Notre équipe passionnée vous guide pour trouver la fragrance parfaite selon vos goûts.',
  },
  {
    icon: Leaf,
    title: 'Livraison Soignée',
    description: 'Emballage premium et livraison rapide partout en Algérie. Votre parfum arrive en parfait état.',
  },
];

export default function EngagementsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-noir relative border-t border-or/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {engagements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-5 border border-or/20 flex items-center justify-center group-hover:border-or/50 group-hover:bg-or/5 transition-all duration-500">
                <item.icon size={22} className="text-or/70 group-hover:text-or transition-colors duration-500" />
              </div>
              <h3 className="font-playfair text-ivoire text-base mb-2">{item.title}</h3>
              <p className="text-ivoire/35 text-xs sm:text-sm leading-relaxed max-w-[250px] mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
