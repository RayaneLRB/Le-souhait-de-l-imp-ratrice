import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import { quizQuestions, type Product } from '../data/products';

interface QuizPageProps {
  onSelectProduct: (id: string) => void;
  products: Product[];
}

export default function QuizPage({ onSelectProduct, products }: QuizPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < quizQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const getRecommendations = () => {
    const scores: Record<string, number> = { floral: 0, boise: 0, oriental: 0, frais: 0 };
    answers.forEach(a => { if (scores[a] !== undefined) scores[a]++; });

    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

    const familyMap: Record<string, string[]> = {
      floral: ['Floral', 'Floral oriental', 'Floral frais'],
      boise: ['Cuir boisé', 'Oriental boisé'],
      oriental: ['Oriental épicé', 'Oriental ambré', 'Oriental boisé'],
      frais: ['Frais aromatique', 'Floral frais'],
    };

    const families = familyMap[dominant] || [];
    const recommended = products.filter(p => families.includes(p.family));
    return recommended.length > 0 ? recommended.slice(0, 3) : products.slice(0, 3);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-noir pt-20 sm:pt-24">
      {/* Hero */}
      <div className="relative py-12 sm:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,110,0.06)_0%,_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4"
        >
          <Sparkles size={24} className="text-or mx-auto mb-4" />
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Assistant Parfum</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-4">
            Trouvez Votre <span className="italic text-gradient-gold">Fragrance</span>
          </h1>
          <p className="font-cormorant text-ivoire/50 text-lg italic max-w-xl mx-auto">
            Répondez à quelques questions et découvrez le parfum qui vous correspond
          </p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Progress */}
              <div className="flex items-center gap-2 mb-8">
                {quizQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 transition-all duration-500 ${
                      i <= currentStep ? 'bg-or' : 'bg-ivoire/10'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center mb-2">
                <span className="text-or/50 text-xs">
                  Question {currentStep + 1} / {quizQuestions.length}
                </span>
              </div>

              <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire text-center mb-10">
                {quizQuestions[currentStep].question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {quizQuestions[currentStep].options.map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-5 sm:p-6 border transition-all duration-300 group ${
                      answers[currentStep] === option.value
                        ? 'border-or bg-or/10 text-or'
                        : 'border-ivoire/10 text-ivoire/70 hover:border-or/40 hover:text-ivoire'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base">{option.label}</span>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-or" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 mt-8 text-ivoire/40 text-sm hover:text-or transition-colors"
                >
                  <ArrowLeft size={14} />
                  Question précédente
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <Sparkles size={28} className="text-or mx-auto mb-4" />
                <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mb-3">
                  Vos <span className="text-gradient-gold italic">Recommandations</span>
                </h2>
                <p className="font-cormorant text-ivoire/50 italic text-lg">
                  Basées sur votre profil olfactif unique
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {getRecommendations().map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="group cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product.id);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-noir-medium">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
                      {i === 0 && (
                        <div className="absolute top-4 left-4 bg-or text-noir text-[9px] tracking-[0.15em] uppercase px-3 py-1 font-medium">
                          Meilleur Match
                        </div>
                      )}
                    </div>
                    <h3 className="font-playfair text-ivoire group-hover:text-or transition-colors">{product.name}</h3>
                    <p className="font-cormorant text-ivoire/40 text-sm italic">{product.subtitle}</p>
                    <p className="text-or/60 text-xs mt-1">{product.family}</p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-or/40 text-or text-xs tracking-[0.15em] uppercase hover:bg-or hover:text-noir transition-all duration-300"
                >
                  <RotateCcw size={14} />
                  Recommencer le quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
