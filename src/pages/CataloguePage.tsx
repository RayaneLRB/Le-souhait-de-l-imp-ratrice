import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product } from '../data/products';

interface CataloguePageProps {
  onSelectProduct: (id: string) => void;
  products: Product[];
  initialGender?: string;
}

const genders = ['Tous', 'homme', 'femme', 'mixte'];
const sortOptions = ['Prix croissant', 'Prix décroissant', 'Nouveautés', 'Intensité'];

const PER_PAGE = 12;

export default function CataloguePage({ onSelectProduct, products, initialGender = 'Tous' }: CataloguePageProps) {
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState(initialGender);
  const [brand, setBrand] = useState('Tous');
  const [sort, setSort] = useState('Nouveautés');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Build brand list dynamically from products
  const brandOptions = useMemo(() => {
    const brands = Array.from(new Set(products.map(p => p.brand))).sort();
    return ['Tous', ...brands];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.family.toLowerCase().includes(s) ||
        p.subtitle.toLowerCase().includes(s)
      );
    }
    if (gender !== 'Tous') result = result.filter(p => p.gender === gender);
    if (brand !== 'Tous') result = result.filter(p => p.brand === brand);

    switch (sort) {
      case 'Prix croissant': result.sort((a, b) => a.price - b.price); break;
      case 'Prix décroissant': result.sort((a, b) => b.price - a.price); break;
      case 'Nouveautés': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'Intensité': result.sort((a, b) => b.intensity - a.intensity); break;
    }

    return result;
  }, [products, search, gender, brand, sort]);

  // Sync gender with initialGender prop
  useEffect(() => { setGender(initialGender); }, [initialGender]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, gender, brand, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [gender, brand].filter(f => f !== 'Tous').length;

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
          <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Catalogue</span>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-4 mb-4">
            {gender === 'homme' ? <>Parfums <span className="italic text-gradient-gold">Homme</span></> :
             gender === 'femme' ? <>Parfums <span className="italic text-gradient-gold">Femme</span></> :
             gender === 'mixte' ? <>Parfums <span className="italic text-gradient-gold">Unisexe</span></> :
             <>Nos <span className="italic text-gradient-gold">Créations</span></>}
          </h1>
          <p className="font-cormorant text-ivoire/50 text-lg italic">
            {filtered.length} fragrance{filtered.length !== 1 ? 's' : ''} d'exception
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ivoire/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un parfum..."
              className="w-full bg-noir-light border border-ivoire/10 pl-11 pr-4 py-3 text-sm text-ivoire placeholder-ivoire/30 focus:outline-none focus:border-or/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-ivoire/30 hover:text-or">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 border text-xs tracking-[0.15em] uppercase transition-all duration-300 ${
              showFilters || activeFiltersCount > 0
                ? 'border-or text-or'
                : 'border-ivoire/10 text-ivoire/50 hover:border-ivoire/30'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-or text-noir text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-noir-light border border-ivoire/10 px-6 py-3 pr-10 text-sm text-ivoire/70 focus:outline-none focus:border-or/40 w-full sm:w-auto cursor-pointer"
            >
              {sortOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivoire/30 pointer-events-none" />
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-noir-light border border-ivoire/5 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Gender */}
                <div>
                  <label className="text-or/70 text-[10px] tracking-[0.15em] uppercase block mb-3">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {genders.map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`px-4 py-1.5 text-xs transition-all duration-300 ${
                          gender === g
                            ? 'bg-or text-noir'
                            : 'border border-ivoire/15 text-ivoire/50 hover:border-or/30 hover:text-or'
                        }`}
                      >
                        {g === 'Tous' ? 'Tous' : g === 'homme' ? 'Homme' : g === 'femme' ? 'Femme' : 'Unisexe'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-or/70 text-[10px] tracking-[0.15em] uppercase block mb-3">Marque</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-noir border border-ivoire/15 px-4 py-2 text-sm text-ivoire/60 focus:outline-none focus:border-or/40"
                  >
                    {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Clear */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => { setGender('Tous'); setBrand('Tous'); }}
                  className="mt-3 text-or/60 text-xs hover:text-or transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-ivoire/30 text-xs sm:text-sm">
            {filtered.length} parfum{filtered.length !== 1 ? 's' : ''}{totalPages > 1 && ` — Page ${safePage} sur ${totalPages}`}
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {paged.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => {
                  onSelectProduct(product.id);
                  window.scrollTo(0, 0);
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-1 sm:mb-4 bg-noir-medium">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />

                  <div className="absolute top-1 left-1 sm:top-3 sm:left-3 flex flex-col gap-1">
                    {product.status === 'promo' && (
                      <span className="bg-amber-500 text-noir text-[6px] sm:text-[8px] tracking-[0.1em] uppercase px-1.5 sm:px-2.5 py-0.5 font-medium">
                        Promo
                      </span>
                    )}
                    {product.status === 'rupture' && (
                      <span className="bg-red-500/80 text-white text-[6px] sm:text-[8px] tracking-[0.1em] uppercase px-1.5 sm:px-2.5 py-0.5 font-medium">
                        Rupture
                      </span>
                    )}
                    {product.isNew && product.status !== 'promo' && product.status !== 'rupture' && (
                      <span className="bg-or text-noir text-[6px] sm:text-[8px] tracking-[0.1em] uppercase px-1.5 sm:px-2.5 py-0.5 font-medium">
                        Nouveau
                      </span>
                    )}
                    {product.isExclusive && (
                      <span className="hidden sm:inline-block bg-noir/70 text-or text-[8px] tracking-[0.15em] uppercase px-2.5 py-0.5 border border-or/30 backdrop-blur-sm">
                        Exclusif
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 hidden sm:block">
                    <span className="bg-or text-noir text-[10px] tracking-[0.15em] uppercase px-4 py-2 font-medium">
                      Découvrir
                    </span>
                  </div>
                </div>

                <div className="px-0.5 sm:px-1 text-center">
                  <span className="text-or/40 text-[7px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.15em] uppercase block">{product.brand}</span>
                  <h3 className="font-playfair text-[11px] sm:text-base text-ivoire group-hover:text-or transition-colors duration-300 mt-0.5 sm:mt-1 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-ivoire/30 text-[7px] sm:text-[10px] mt-0.5 hidden sm:block">{product.family}</p>
                  
                  <div className="hidden sm:flex items-center justify-center gap-1 mt-2">
                    {Array.from({ length: product.intensity }).map((_, j) => (
                      <Star key={j} size={9} className="fill-or text-or" />
                    ))}
                    {Array.from({ length: 5 - product.intensity }).map((_, j) => (
                      <Star key={j} size={9} className="text-ivoire/15" />
                    ))}
                  </div>
                  <div className="flex items-baseline justify-center gap-0.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                    <span className="text-or font-playfair text-[10px] sm:text-base">{product.price.toLocaleString('fr-DZ')}</span>
                    <span className="text-ivoire/25 text-[7px] sm:text-xs">DA</span>
                    {product.status === 'promo' && product.originalPrice && (
                      <span className="text-ivoire/30 text-[7px] sm:text-xs line-through">{product.originalPrice.toLocaleString('fr-DZ')}</span>
                    )}
                    <span className="text-ivoire/20 text-[7px] sm:text-xs hidden sm:inline">{product.volume}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 sm:mt-14">
            {/* Prev */}
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-ivoire/10 text-ivoire/40 disabled:opacity-20 disabled:cursor-not-allowed hover:border-or hover:text-or transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              // Show: first, last, current, current±1
              const show = p === 1 || p === totalPages || Math.abs(p - safePage) <= 1;
              // Show dots
              const dot = p === 2 && safePage > 3 || p === totalPages - 1 && safePage < totalPages - 2;
              if (dot && !show) return <span key={p} className="text-ivoire/20 text-xs px-1">…</span>;
              if (!show) return null;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm transition-colors ${
                    p === safePage
                      ? 'bg-or text-noir font-medium'
                      : 'border border-ivoire/10 text-ivoire/40 hover:border-or hover:text-or'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-ivoire/10 text-ivoire/40 disabled:opacity-20 disabled:cursor-not-allowed hover:border-or hover:text-or transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-cormorant text-ivoire/40 text-xl italic">Aucun parfum ne correspond à vos critères</p>
            <button
              onClick={() => { setSearch(''); setGender('Tous'); setBrand('Tous'); }}
              className="mt-4 text-or text-sm hover:text-or-light transition-colors"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
