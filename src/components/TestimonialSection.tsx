import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const testimonials = [
  {
    text: "J'ai commandé un Tom Ford Tobacco Vanille et un Creed Aventus. Parfums 100% originaux, livraison rapide, emballage soigné. Je recommande !",
    author: "Amina K.",
    location: "Alger",
  },
  {
    text: "Enfin une boutique en Algérie qui propose les grands noms de la parfumerie avec un vrai conseil personnalisé. Le Dior Sauvage Elixir est incroyable.",
    author: "Karim B.",
    location: "Oran",
  },
  {
    text: "Tous les parfums sont 100% originaux avec un service impeccable. Le Souhait de l'Impératrice est devenu ma référence en Algérie.",
    author: "Leïla M.",
    location: "Constantine",
  },
];

export default function TestimonialSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-noir relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Témoignages</span>
          <h2 className="font-playfair text-3xl sm:text-4xl text-ivoire mt-4 mb-12">
            Ils nous <span className="italic text-gradient-gold">inspirent</span>
          </h2>
        </motion.div>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="text-or/30 text-5xl font-playfair mb-6">"</div>
              <p className="font-cormorant text-xl sm:text-2xl text-ivoire/70 italic leading-relaxed max-w-2xl mx-auto mb-8">
                {testimonials[current].text}
              </p>
              <div>
                <p className="text-or text-sm tracking-wider">{testimonials[current].author}</p>
                <p className="text-ivoire/30 text-xs mt-1">{testimonials[current].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === current ? 'bg-or w-8' : 'bg-ivoire/15 hover:bg-ivoire/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
