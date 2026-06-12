import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { olfactiveNotes } from '../data/products';
import { useState } from 'react';

export default function OlfactiveNotes() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeNote, setActiveNote] = useState<number>(0);

  return (
    <section ref={ref} className="py-20 sm:py-32 bg-noir-light relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,169,110,0.04)_0%,_transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">L'Art Olfactif</span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-6">
            Notes <span className="italic text-gradient-gold">Olfactives</span>
          </h2>
          <p className="font-cormorant text-ivoire/50 text-lg sm:text-xl max-w-xl mx-auto italic">
            Explorez les familles olfactives qui composent nos créations
          </p>
        </motion.div>

        {/* Notes Interactive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {olfactiveNotes.map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setActiveNote(i)}
              className={`relative group cursor-pointer rounded-sm overflow-hidden transition-all duration-500 ${
                activeNote === i
                  ? 'ring-1 ring-or/50 scale-[1.02]'
                  : 'hover:ring-1 hover:ring-or/20'
              }`}
            >
              <div className={`bg-gradient-to-br ${note.color} p-6 sm:p-8 text-center min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center`}>
                <span className="text-3xl sm:text-4xl mb-3 block">{note.icon}</span>
                <h3 className={`font-playfair text-base sm:text-lg mb-2 transition-colors duration-300 ${
                  activeNote === i ? 'text-or' : 'text-ivoire'
                }`}>
                  {note.name}
                </h3>
                <p className="text-ivoire/40 text-[11px] sm:text-xs leading-relaxed">{note.description}</p>

                {/* Active indicator */}
                {activeNote === i && (
                  <motion.div
                    layoutId="note-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-or"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Note Detail */}
        <motion.div
          key={activeNote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-glass-light rounded-sm p-8 sm:p-12 max-w-2xl mx-auto">
            <span className="text-4xl block mb-4">{olfactiveNotes[activeNote].icon}</span>
            <h3 className="font-playfair text-2xl text-or mb-3">
              Notes {olfactiveNotes[activeNote].name}
            </h3>
            <p className="text-ivoire/50 text-sm leading-relaxed">
              {activeNote === 0 && "Les notes florales apportent romantisme et féminité. Elles évoquent les jardins en pleine floraison, du jasmin enivrant à la rose majestueuse, en passant par l'iris poudrée et la fleur d'oranger délicate."}
              {activeNote === 1 && "Les notes boisées incarnent la profondeur et la noblesse. Le santal crémeux, le cèdre majestueux, le vétiver terreux et le oud mystérieux créent des sillages d'une élégance intemporelle."}
              {activeNote === 2 && "Les notes orientales sont chaleur et mystère. L'ambre doré, l'encens sacré, la myrrhe ancestrale et la vanille envoûtante composent des fragrances d'une richesse incomparable."}
              {activeNote === 3 && "Les notes fraîches sont lumière et énergie. Les agrumes pétillants, la menthe vivifiante, le thé vert apaisant et les accords marins créent des compositions vivifiantes et joyeuses."}
              {activeNote === 4 && "Les notes gourmandes éveillent les sens. La vanille onctueuse, la praline caramélisée, le café torréfié et le miel doré offrent des fragrances addictives et réconfortantes."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
