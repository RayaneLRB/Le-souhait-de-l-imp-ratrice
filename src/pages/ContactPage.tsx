import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-noir pt-20 sm:pt-24">
      {/* Hero */}
      <div className="relative py-16 sm:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,110,0.06)_0%,_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Contact</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-4">
            Nous <span className="italic text-gradient-gold">Rencontrer</span>
          </h1>
          <p className="font-cormorant text-ivoire/50 text-lg italic">
            Notre maison vous attend
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mb-8">
              Visitez notre <span className="italic text-gradient-gold">Boutique</span>
            </h2>
            <p className="text-ivoire/50 text-sm leading-relaxed mb-10">
              Nous vous accueillons dans un cadre d'exception pour vous faire découvrir nos créations.
              Prenez rendez-vous pour une consultation personnalisée avec nos experts en parfumerie.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: MapPin,
                  title: 'Adresse',
                  lines: ['Rue Didouche Mourad', 'Alger Centre, 16000', 'Algérie'],
                },
                {
                  icon: Phone,
                  title: 'Téléphone',
                  lines: ['+213 (0) 21 XX XX XX', '+213 (0) 5XX XX XX XX'],
                },
                {
                  icon: Mail,
                  title: 'Email',
                  lines: ['contact@souhait-imperatrice.dz', 'commande@souhait-imperatrice.dz'],
                },
                {
                  icon: Clock,
                  title: 'Horaires',
                  lines: ['Lundi – Samedi : 9h – 20h', 'Dimanche : Sur rendez-vous'],
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex gap-5"
                >
                  <div className="w-12 h-12 border border-or/20 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-or" />
                  </div>
                  <div>
                    <h3 className="text-ivoire text-sm font-medium mb-1">{item.title}</h3>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-ivoire/40 text-sm">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-10 relative aspect-[16/9] bg-noir-medium border border-ivoire/5 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/15129291/pexels-photo-15129291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=700"
                alt="Boutique"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-or mx-auto mb-2" />
                  <p className="text-ivoire/60 text-sm font-playfair">Alger Centre</p>
                  <p className="text-ivoire/30 text-xs mt-1">Rue Didouche Mourad</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mb-8">
              Écrivez-<span className="italic text-gradient-gold">nous</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-or/60 text-[10px] tracking-[0.15em] uppercase block mb-2">Nom</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-noir-light border border-ivoire/10 px-5 py-3 text-sm text-ivoire placeholder-ivoire/20 focus:outline-none focus:border-or/40 transition-colors"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label className="text-or/60 text-[10px] tracking-[0.15em] uppercase block mb-2">Email</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-noir-light border border-ivoire/10 px-5 py-3 text-sm text-ivoire placeholder-ivoire/20 focus:outline-none focus:border-or/40 transition-colors"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-or/60 text-[10px] tracking-[0.15em] uppercase block mb-2">Sujet</label>
                <select
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full bg-noir-light border border-ivoire/10 px-5 py-3 text-sm text-ivoire/60 focus:outline-none focus:border-or/40 transition-colors"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="rdv">Prendre rendez-vous</option>
                  <option value="info">Information produit</option>
                  <option value="pro">Partenariat professionnel</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>

              <div>
                <label className="text-or/60 text-[10px] tracking-[0.15em] uppercase block mb-2">Message</label>
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  rows={6}
                  className="w-full bg-noir-light border border-ivoire/10 px-5 py-3 text-sm text-ivoire placeholder-ivoire/20 focus:outline-none focus:border-or/40 transition-colors resize-none"
                  placeholder="Votre message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-or text-noir px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors duration-300"
              >
                {submitted ? (
                  <>
                    <Check size={14} />
                    Message envoyé
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Envoyer
                  </>
                )}
              </button>
            </form>

            {/* Social */}
            <div className="mt-12 pt-8 border-t border-ivoire/5">
              <h3 className="text-or/60 text-[10px] tracking-[0.15em] uppercase mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'TikTok'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-5 py-2 border border-ivoire/10 text-ivoire/40 text-xs hover:border-or hover:text-or transition-all duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
