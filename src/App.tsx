import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import CollectionsSection from './components/CollectionsSection';
import FeaturedProducts from './components/FeaturedProducts';
import BrandStory from './components/BrandStory';
import OlfactiveNotes from './components/OlfactiveNotes';
import GallerySection from './components/GallerySection';
import MarquesSection from './components/MarquesSection';
import CTASection from './components/CTASection';
import TestimonialSection from './components/TestimonialSection';
import EngagementsSection from './components/EngagementsSection';
import CataloguePage from './pages/CataloguePage';
import ProductPage from './pages/ProductPage';
import QuizPage from './pages/QuizPage';
import JournalPage from './pages/JournalPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import { type Product } from './data/products';
import { type Order } from './store/orderStore';
import { loadProductsAsync, subscribeProducts, getAdminPin } from './store/productStore';
import { loadOrdersAsync, addOrderAsync, subscribeOrders } from './store/orderStore';

type Page = 'home' | 'catalogue' | 'product' | 'quiz' | 'journal' | 'contact' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [catalogueGender, setCatalogueGender] = useState<string>('Tous');

  // Load data + subscribe to real-time updates
  useEffect(() => {
    let unsubProducts: (() => void) | null = null;
    let unsubOrders: (() => void) | null = null;

    async function init() {
      const [prods, ords] = await Promise.all([
        loadProductsAsync(),
        loadOrdersAsync(),
      ]);
      setProducts(prods);
      setOrders(ords);

      // Subscribe to real-time updates (Firebase) — keeps data fresh
      unsubProducts = subscribeProducts((p) => setProducts(p));
      unsubOrders = subscribeOrders((o) => setOrders(o));
    }

    init();
    const timer = setTimeout(() => setIsLoading(false), 1800);

    return () => {
      clearTimeout(timer);
      unsubProducts?.();
      unsubOrders?.();
    };
  }, []);

  // Secret URL hash: #admin -> shows PIN modal
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setShowPinModal(true);
        history.replaceState(null, '', window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Secret keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowPinModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'product' && selectedProduct) {
      setCurrentPage('product');
    } else {
      setCurrentPage(page as Page);
      setSelectedProduct(null);
      if (page !== 'catalogue') setCatalogueGender('Tous');
    }
  };

  const handleNavigateCatalogue = (gender: string) => {
    setCatalogueGender(gender);
    setCurrentPage('catalogue');
    setSelectedProduct(null);
    window.scrollTo(0, 0);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProduct(id);
    setCurrentPage('product');
  };

  const handleBackFromProduct = () => {
    setCurrentPage('catalogue');
    setSelectedProduct(null);
  };

  const handleOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder = await addOrderAsync(orderData);
    // Optimistic update for local (Firebase subscription will also update)
    setOrders(prev => [newOrder, ...prev]);
  };

  const handlePinSubmit = () => {
    if (pinInput === getAdminPin()) {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      setCurrentPage('dashboard');
      window.scrollTo(0, 0);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const publicProducts = products.filter(p => (p.status || 'disponible') !== 'bientot');

  // Loading Screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-noir z-[200] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-6">
            <div className="w-16 h-16 border border-or/60 flex items-center justify-center mx-auto">
              <span className="font-playfair text-or text-xl font-bold">SI</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <span className="font-playfair text-ivoire text-base tracking-[0.2em]">LE SOUHAIT DE</span>
            <br />
            <span className="text-gradient-gold font-playfair text-lg tracking-[0.25em]">L'IMPÉRATRICE</span>
          </motion.div>
          <motion.div initial={{ width: 0 }} animate={{ width: '120px' }} transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
            className="h-px bg-gradient-to-r from-transparent via-or to-transparent mx-auto mt-6" />
        </motion.div>
      </div>
    );
  }

  // PIN Modal
  const pinModal = showPinModal && (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-noir/95 z-[200] flex items-center justify-center p-4"
      onClick={() => { setShowPinModal(false); setPinInput(''); }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-noir-light border border-or/20 p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 border border-or/40 flex items-center justify-center mx-auto mb-6">
          <span className="font-playfair text-or font-bold">SI</span>
        </div>
        <h3 className="font-playfair text-lg text-ivoire text-center mb-1">Accès Administration</h3>
        <p className="text-ivoire/40 text-xs text-center mb-6">Entrez le code PIN pour accéder au dashboard</p>
        <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePinSubmit()} placeholder="Code PIN" maxLength={10} autoFocus
          className={`w-full bg-noir border px-4 py-3 text-center text-lg tracking-[0.5em] text-ivoire focus:outline-none transition-colors ${
            pinError ? 'border-red-500' : 'border-ivoire/10 focus:border-or/40'
          }`} />
        {pinError && <p className="text-red-400 text-xs text-center mt-2">Code PIN incorrect</p>}
        <button onClick={handlePinSubmit}
          className="w-full mt-4 bg-or text-noir py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors">
          Accéder
        </button>
      </motion.div>
    </motion.div>
  );

  // Dashboard
  if (currentPage === 'dashboard') {
    return (
      <>
        <DashboardPage
          products={products} setProducts={setProducts}
          orders={orders} setOrders={setOrders}
          onExit={() => { setCurrentPage('home'); window.scrollTo(0, 0); }}
        />
        <AnimatePresence>{pinModal}</AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-noir">
      <Navigation currentPage={currentPage === 'product' ? 'catalogue' : currentPage} onNavigate={handleNavigate} />
      <AnimatePresence>{pinModal}</AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={currentPage + (selectedProduct || '')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          {currentPage === 'home' && (
            <>
              <HeroSection onNavigate={handleNavigate} />
              <CollectionsSection onNavigateCatalogue={handleNavigateCatalogue} />
              <FeaturedProducts onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} products={publicProducts} />
              <BrandStory />
              <OlfactiveNotes />
              <TestimonialSection />
              <CTASection onNavigate={handleNavigate} />
              <GallerySection />
              <EngagementsSection />
              <MarquesSection />
            </>
          )}
          {currentPage === 'catalogue' && (
            <CataloguePage onSelectProduct={handleSelectProduct} products={publicProducts} initialGender={catalogueGender} />
          )}
          {currentPage === 'product' && selectedProduct && (
            <ProductPage productId={selectedProduct} onBack={handleBackFromProduct}
              onSelectProduct={handleSelectProduct} products={publicProducts} onOrder={handleOrder} />
          )}
          {currentPage === 'quiz' && <QuizPage onSelectProduct={handleSelectProduct} products={publicProducts} />}
          {currentPage === 'journal' && <JournalPage />}
          {currentPage === 'contact' && <ContactPage />}
        </motion.div>
      </AnimatePresence>
      <Footer onNavigate={handleNavigate} onAdminAccess={() => setShowPinModal(true)} />
    </div>
  );
}
