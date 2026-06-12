import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface CollectionsSectionProps {
  onNavigateCatalogue: (gender: string) => void;
}

const categories = [
  {
    id: 'homme',
    name: 'Homme',
    description: 'Les fragrances masculines des plus grandes maisons',
    image: 'https://images.pexels.com/photos/12562773/pexels-photo-12562773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 'femme',
    name: 'Femme',
    description: 'L\'élégance féminine sublimée par les plus grands nez',
    image: 'https://images.pexels.com/photos/32630385/pexels-photo-32630385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
  {
    id: 'mixte',
    name: 'Unisexe',
    description: 'Des fragrances sans frontières, pour tous',
    image: 'https://images.pexels.com/photos/29255492/pexels-photo-29255492.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  },
];

export default function CollectionsSection({ onNavigateCatalogue }: CollectionsSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-32 bg-noir relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 line-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Nos Catégories</span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-6">
            Explorer par <span className="italic text-gradient-gold">Univers</span>
          </h2>
          <p className="font-cormorant text-ivoire/50 text-lg sm:text-xl max-w-xl mx-auto italic">
            Trouvez la fragrance parfaite dans votre univers
          </p>
        </motion.div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
              onClick={() => onNavigateCatalogue(cat.id)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
              <div className="absolute inset-0 bg-noir/20 group-hover:bg-noir/10 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="w-12 h-px bg-or mb-4 transition-all duration-500 group-hover:w-20" />
                <h3 className="font-playfair text-xl sm:text-2xl text-ivoire mb-2">
                  {cat.name}
                </h3>
                <p className="text-ivoire/50 text-sm font-cormorant italic">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-or text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                  Découvrir
                  <svg width="16" height="8" viewBox="0 0 16 8" className="fill-current">
                    <path d="M15.354 4.354a.5.5 0 000-.708L12.172.464a.5.5 0 10-.708.708L14.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h15v-1H0v1z" />
                  </svg>
                </div>
              </div>

              {/* Border effect */}
              <div className="absolute inset-0 border border-or/0 group-hover:border-or/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
