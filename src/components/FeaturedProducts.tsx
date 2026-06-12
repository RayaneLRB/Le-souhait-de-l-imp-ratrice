import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { type Product } from '../data/products';
import { Star } from 'lucide-react';

interface FeaturedProductsProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
  products: Product[];
}

export default function FeaturedProducts({ onNavigate, onSelectProduct, products }: FeaturedProductsProps) {
  const { ref, isVisible } = useScrollAnimation();
  const featured = products.filter(p => (p.status || 'disponible') !== 'rupture').slice(0, 6);

  return (
    <section ref={ref} className="py-20 sm:py-32 bg-noir-light relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Sélection</span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-6">
            Parfums <span className="italic text-gradient-gold">Vedettes</span>
          </h2>
          <p className="font-cormorant text-ivoire/50 text-lg sm:text-xl max-w-xl mx-auto italic">
            Les créations les plus emblématiques de la Maison
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group cursor-pointer"
              onClick={() => {
                onSelectProduct(product.id);
                window.scrollTo(0, 0);
              }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-noir-medium">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-or text-noir text-[9px] tracking-[0.15em] uppercase px-3 py-1 font-medium">
                      Nouveau
                    </span>
                  )}
                  {product.isExclusive && (
                    <span className="bg-noir/80 text-or text-[9px] tracking-[0.15em] uppercase px-3 py-1 border border-or/30">
                      Exclusif
                    </span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="px-6 py-2 border border-or text-or text-[10px] tracking-[0.2em] uppercase bg-noir/60 backdrop-blur-sm">
                    Découvrir
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-or/50 text-[10px] tracking-[0.15em] uppercase">{product.brand}</span>
                </div>
                <h3 className="font-playfair text-lg text-ivoire group-hover:text-or transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="font-cormorant text-ivoire/40 text-sm italic mt-1">{product.family}</p>

                {/* Notes preview */}
                <div className="flex items-center gap-1 mt-3">
                  {Array.from({ length: product.intensity }).map((_, j) => (
                    <Star key={j} size={10} className="fill-or text-or" />
                  ))}
                  {Array.from({ length: 5 - product.intensity }).map((_, j) => (
                    <Star key={j} size={10} className="text-ivoire/15" />
                  ))}
                  <span className="text-ivoire/30 text-[10px] ml-2">Intensité</span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-or font-playfair text-lg">{product.price.toLocaleString('fr-DZ')}</span>
                  <span className="text-ivoire/30 text-xs">DZD</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button
            onClick={() => { onNavigate('catalogue'); window.scrollTo(0, 0); }}
            className="px-10 py-3 border border-or/40 text-or text-xs tracking-[0.2em] uppercase hover:bg-or hover:text-noir transition-all duration-500"
          >
            Voir toute la collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
