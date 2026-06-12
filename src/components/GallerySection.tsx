import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/29986521/pexels-photo-29986521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Perfume bottle with elegant design",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/26704595/pexels-photo-26704595.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Rose on dark background",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.pexels.com/photos/15129291/pexels-photo-15129291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Islamic architecture",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.pexels.com/photos/30588986/pexels-photo-30588986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Gold perfume bottle",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/6434293/pexels-photo-6434293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Flowers on dark background",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.pexels.com/photos/36861475/pexels-photo-36861475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Ornate golden detail",
    span: "col-span-1 row-span-1",
  },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-32 bg-noir relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Galerie</span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-6">
            Univers <span className="italic text-gradient-gold">Immersif</span>
          </h2>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[250px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`${img.span} relative group overflow-hidden`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-noir/30 group-hover:bg-noir/10 transition-colors duration-500" />
              <div className="absolute inset-0 border border-or/0 group-hover:border-or/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
