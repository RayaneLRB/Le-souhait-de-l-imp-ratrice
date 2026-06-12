import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Accueil' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'quiz', label: 'Assistant Parfum' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-noir/90 backdrop-blur-xl border-b border-or/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => { onNavigate('home'); window.scrollTo(0, 0); }}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 border border-or/60 flex items-center justify-center group-hover:border-or transition-colors duration-300">
                <span className="font-playfair text-or text-sm sm:text-lg font-bold">SI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-playfair text-ivoire text-[10px] sm:text-xs tracking-[0.15em] leading-none">
                  LE SOUHAIT DE
                </span>
                <span className="text-gradient-gold font-playfair text-xs sm:text-sm tracking-[0.2em] leading-none mt-0.5">
                  L'IMPÉRATRICE
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); window.scrollTo(0, 0); }}
                  className={`relative text-xs tracking-[0.15em] uppercase transition-colors duration-300 py-2 ${
                    currentPage === item.id ? 'text-or' : 'text-ivoire/70 hover:text-ivoire'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0 left-0 right-0 h-px bg-or"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('catalogue')}
                className="text-ivoire/60 hover:text-or transition-colors duration-300"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden text-ivoire/80 hover:text-or transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-noir/98 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-5">
              <span className="font-playfair text-or text-lg tracking-[0.15em]">L'IMPÉRATRICE</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-ivoire/60">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileOpen(false);
                    window.scrollTo(0, 0);
                  }}
                  className={`font-playfair text-2xl tracking-widest transition-colors ${
                    currentPage === item.id ? 'text-or' : 'text-ivoire/60 hover:text-ivoire'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div className="text-center pb-8 text-ivoire/30 text-xs tracking-widest">
              LE SOUHAIT DE L'IMPÉRATRICE — ALGÉRIE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
