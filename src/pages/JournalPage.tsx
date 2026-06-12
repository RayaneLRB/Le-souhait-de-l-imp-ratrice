import { motion } from 'framer-motion';
import { blogPosts } from '../data/products';
import { Clock, ArrowRight } from 'lucide-react';

export default function JournalPage() {
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
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Le Journal</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-4">
            Inspirations & <span className="italic text-gradient-gold">Savoir</span>
          </h1>
          <p className="font-cormorant text-ivoire/50 text-lg italic">
            L'univers de la parfumerie dévoilé
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Featured Article */}
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="group cursor-pointer mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-noir/20 group-hover:bg-noir/10 transition-colors duration-500" />
              <span className="absolute top-4 left-4 bg-or text-noir text-[9px] tracking-[0.15em] uppercase px-3 py-1 font-medium">
                À la une
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-or/50 text-[10px] tracking-[0.15em] uppercase">{blogPosts[0].category}</span>
              <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mt-2 mb-4 group-hover:text-or transition-colors duration-300">
                {blogPosts[0].title}
              </h2>
              <p className="text-ivoire/50 text-sm leading-relaxed mb-6">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-ivoire/30 text-xs">
                <span>{blogPosts[0].date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-or text-xs tracking-[0.15em] uppercase group-hover:gap-3 transition-all duration-300">
                Lire l'article
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </motion.article>

        <div className="line-gold mb-16" />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-noir/20 group-hover:bg-noir/10 transition-colors duration-500" />
              </div>
              <span className="text-or/50 text-[10px] tracking-[0.15em] uppercase">{post.category}</span>
              <h3 className="font-playfair text-lg text-ivoire mt-2 mb-2 group-hover:text-or transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-ivoire/40 text-sm leading-relaxed mb-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-ivoire/25 text-xs">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 sm:mt-28 bg-glass-light p-8 sm:p-12 text-center max-w-2xl mx-auto"
        >
          <h3 className="font-playfair text-2xl text-ivoire mb-3">
            Restez <span className="italic text-gradient-gold">Inspiré</span>
          </h3>
          <p className="text-ivoire/40 text-sm mb-6">
            Recevez nos derniers articles et découvertes olfactives
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 bg-noir border border-ivoire/10 px-5 py-3 text-sm text-ivoire placeholder-ivoire/30 focus:outline-none focus:border-or/40 transition-colors"
            />
            <button className="bg-or text-noir px-8 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-or-light transition-colors">
              S'abonner
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
