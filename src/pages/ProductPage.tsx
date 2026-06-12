import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Droplets, Clock, Sun, Sparkles, X, ShoppingBag, Check, ChevronDown } from 'lucide-react';
import { type Product } from '../data/products';
import { type Order, WILAYAS } from '../store/orderStore';

interface ProductPageProps {
  productId: string;
  onBack: () => void;
  onSelectProduct: (id: string) => void;
  products: Product[];
  onOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
}

export default function ProductPage({ productId, onBack, onSelectProduct, products, onOrder }: ProductPageProps) {
  const product = products.find(p => p.id === productId);
  const [activeImage, setActiveImage] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    wilaya: '', commune: '', address: '', notes: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  if (!product) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-ivoire/40 font-cormorant text-xl italic">Parfum introuvable</p>
          <button onClick={onBack} className="text-or text-sm mt-4 hover:text-or-light">Retour au catalogue</button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = () => {
    const errors: Record<string, boolean> = {};
    if (!form.fullName.trim()) errors.fullName = true;
    if (!form.phone.trim()) errors.phone = true;
    if (!form.wilaya) errors.wilaya = true;
    if (!form.commune.trim()) errors.commune = true;
    if (!form.address.trim()) errors.address = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onOrder({
      productId: product.id,
      productName: product.name,
      productBrand: product.brand,
      productImage: product.image,
      productPrice: product.price,
      quantity,
      totalPrice: product.price * quantity,
      ...form,
    });

    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowOrderForm(false);
      setForm({ fullName: '', phone: '', email: '', wilaya: '', commune: '', address: '', notes: '' });
      setQuantity(1);
      setFormErrors({});
    }, 3500);
  };

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) setFormErrors(prev => ({ ...prev, [key]: false }));
  };

  const headNotes = product.notes.filter(n => n.type === 'tete');
  const heartNotes = product.notes.filter(n => n.type === 'coeur');
  const baseNotes = product.notes.filter(n => n.type === 'fond');
  const relatedProducts = products.filter(p => p.id !== product.id && (p.brand === product.brand || p.gender === product.gender)).slice(0, 3);
  const isOutOfStock = product.status === 'rupture';

  return (
    <div className="min-h-screen bg-noir pt-20 sm:pt-24">

      {/* ══════ ORDER FORM MODAL ══════ */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/95 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => !orderSuccess && setShowOrderForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="bg-noir-light border border-or/20 max-w-lg w-full my-8 sm:my-16 relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Success overlay */}
              <AnimatePresence>
                {orderSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 bg-noir-light flex flex-col items-center justify-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6"
                    >
                      <Check size={28} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="font-playfair text-xl text-ivoire mb-2">Commande envoyée !</h3>
                    <p className="text-ivoire/50 text-sm text-center">Nous vous contacterons très rapidement pour confirmer votre commande.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close */}
              <button onClick={() => setShowOrderForm(false)} className="absolute top-4 right-4 text-ivoire/30 hover:text-or z-20"><X size={20} /></button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <ShoppingBag size={24} className="text-or mx-auto mb-3" />
                  <h3 className="font-playfair text-xl text-ivoire">Commander</h3>
                  <p className="text-ivoire/40 text-xs mt-1">Remplissez vos informations pour passer commande</p>
                </div>

                {/* Product summary */}
                <div className="flex items-center gap-4 bg-noir/50 p-3 mb-6 border border-ivoire/5">
                  <img src={product.image} alt="" className="w-14 h-14 object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-or/60 text-[9px] uppercase tracking-wider">{product.brand}</p>
                    <p className="text-ivoire text-sm font-playfair truncate">{product.name}</p>
                    <p className="text-or text-sm font-playfair">{product.price.toLocaleString('fr-DZ')} DA</p>
                  </div>
                  {/* Quantity */}
                  <div className="flex items-center border border-ivoire/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 text-ivoire/40 hover:text-or text-sm">−</button>
                    <span className="px-3 py-1 text-ivoire text-sm border-x border-ivoire/10">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 text-ivoire/40 hover:text-or text-sm">+</button>
                  </div>
                </div>

                {/* Total */}
                {quantity > 1 && (
                  <div className="flex justify-between items-baseline mb-4 px-1">
                    <span className="text-ivoire/40 text-xs">Total ({quantity} articles)</span>
                    <span className="text-or font-playfair text-lg">{(product.price * quantity).toLocaleString('fr-DZ')} DA</span>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Nom complet *</label>
                    <input value={form.fullName} onChange={e => updateForm('fullName', e.target.value)}
                      className={`w-full bg-noir border px-4 py-2.5 text-sm text-ivoire focus:outline-none transition-colors ${formErrors.fullName ? 'border-red-500' : 'border-ivoire/10 focus:border-or/40'}`}
                      placeholder="Votre nom et prénom" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Numéro de téléphone *</label>
                    <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} type="tel"
                      className={`w-full bg-noir border px-4 py-2.5 text-sm text-ivoire focus:outline-none transition-colors ${formErrors.phone ? 'border-red-500' : 'border-ivoire/10 focus:border-or/40'}`}
                      placeholder="07XX XX XX XX" />
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Email <span className="text-ivoire/15">(optionnel)</span></label>
                    <input value={form.email} onChange={e => updateForm('email', e.target.value)} type="email"
                      className="w-full bg-noir border border-ivoire/10 px-4 py-2.5 text-sm text-ivoire focus:outline-none focus:border-or/40"
                      placeholder="votre@email.com" />
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Wilaya *</label>
                    <div className="relative">
                      <select value={form.wilaya} onChange={e => updateForm('wilaya', e.target.value)}
                        className={`w-full appearance-none bg-noir border px-4 py-2.5 text-sm focus:outline-none transition-colors cursor-pointer ${formErrors.wilaya ? 'border-red-500 text-ivoire' : 'border-ivoire/10 focus:border-or/40'} ${form.wilaya ? 'text-ivoire' : 'text-ivoire/30'}`}>
                        <option value="">Sélectionnez votre wilaya</option>
                        {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivoire/20 pointer-events-none" />
                    </div>
                  </div>

                  {/* Commune */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Commune *</label>
                    <input value={form.commune} onChange={e => updateForm('commune', e.target.value)}
                      className={`w-full bg-noir border px-4 py-2.5 text-sm text-ivoire focus:outline-none transition-colors ${formErrors.commune ? 'border-red-500' : 'border-ivoire/10 focus:border-or/40'}`}
                      placeholder="Votre commune" />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Adresse de livraison *</label>
                    <textarea value={form.address} onChange={e => updateForm('address', e.target.value)} rows={2}
                      className={`w-full bg-noir border px-4 py-2.5 text-sm text-ivoire focus:outline-none resize-none transition-colors ${formErrors.address ? 'border-red-500' : 'border-ivoire/10 focus:border-or/40'}`}
                      placeholder="Adresse complète..." />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Remarques <span className="text-ivoire/15">(optionnel)</span></label>
                    <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} rows={2}
                      className="w-full bg-noir border border-ivoire/10 px-4 py-2.5 text-sm text-ivoire focus:outline-none focus:border-or/40 resize-none"
                      placeholder="Instructions spéciales, taille préférée..." />
                  </div>
                </div>

                {/* Submit */}
                <button onClick={handleSubmitOrder}
                  className="w-full mt-6 bg-or text-noir py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-or-light transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={14} />
                  Confirmer la commande — {(product.price * quantity).toLocaleString('fr-DZ')} DA
                </button>

                <p className="text-ivoire/20 text-[10px] text-center mt-4">
                  Paiement à la livraison • Livraison partout en Algérie
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-ivoire/40 text-sm hover:text-or transition-colors">
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="relative aspect-[3/4] overflow-hidden bg-noir-medium mb-4">
              <img src={product.gallery[activeImage] || product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/20 via-transparent to-transparent" />
              {product.isExclusive && (
                <div className="absolute top-4 left-4">
                  <span className="bg-noir/70 text-or text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 border border-or/30 backdrop-blur-sm">Édition Exclusive</span>
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-noir/50 flex items-center justify-center">
                  <span className="bg-red-500/90 text-white text-xs tracking-[0.15em] uppercase px-6 py-2 font-medium">Rupture de stock</span>
                </div>
              )}
            </div>
            {product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 overflow-hidden transition-all duration-300 ${activeImage === i ? 'ring-1 ring-or' : 'opacity-50 hover:opacity-80'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:py-8">
            <span className="text-or/50 text-[10px] tracking-[0.3em] uppercase">{product.brand}</span>
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-ivoire mt-3 mb-2">{product.name}</h1>
            <p className="font-cormorant text-xl text-ivoire/50 italic mb-4">{product.subtitle}</p>

            {/* Status badges */}
            <div className="flex gap-2 mb-6">
              {product.status === 'promo' && (
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] tracking-wider uppercase px-3 py-1">En Promo</span>
              )}
              {isOutOfStock && (
                <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] tracking-wider uppercase px-3 py-1">Rupture de Stock</span>
              )}
              {product.status === 'bientot' && (
                <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] tracking-wider uppercase px-3 py-1">Bientôt Disponible</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-playfair text-2xl sm:text-3xl text-or">{product.price.toLocaleString('fr-DZ')}</span>
              <span className="text-ivoire/30 text-sm">DA — {product.volume}</span>
              {product.status === 'promo' && product.originalPrice && (
                <span className="text-ivoire/30 text-base line-through">{product.originalPrice.toLocaleString('fr-DZ')} DA</span>
              )}
            </div>

            {/* Intensity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-ivoire/40 text-xs uppercase tracking-wider">Intensité</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < product.intensity ? 'fill-or text-or' : 'text-ivoire/15'} />
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-ivoire/60 text-sm sm:text-base leading-relaxed mb-8">{product.description}</p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Droplets, label: 'Famille', value: product.family },
                { icon: Clock, label: 'Longévité', value: product.longevity },
                { icon: Sun, label: 'Saison', value: product.season },
                { icon: Sparkles, label: 'Moment', value: product.moment },
              ].map((info, i) => (
                <div key={i} className="bg-noir-light border border-ivoire/5 p-4">
                  <info.icon size={14} className="text-or mb-2" />
                  <p className="text-ivoire/30 text-[10px] tracking-wider uppercase">{info.label}</p>
                  <p className="text-ivoire/80 text-sm mt-1">{info.value}</p>
                </div>
              ))}
            </div>

            {/* CTA — Order button */}
            <button
              onClick={() => !isOutOfStock && setShowOrderForm(true)}
              disabled={isOutOfStock}
              className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-ivoire/10 text-ivoire/30 cursor-not-allowed'
                  : 'bg-or text-noir hover:bg-or-light'
              }`}
            >
              <ShoppingBag size={16} />
              {isOutOfStock ? 'Indisponible' : 'Commander maintenant'}
            </button>
            <p className="text-ivoire/20 text-[10px] text-center mt-3">Paiement à la livraison • Livraison 58 wilayas</p>
          </motion.div>
        </div>

        {/* Olfactive Pyramid */}
        {(headNotes.length > 0 || heartNotes.length > 0 || baseNotes.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-16 sm:mt-24">
            <div className="text-center mb-12">
              <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">Pyramide Olfactive</span>
              <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mt-3">Carte des <span className="italic text-gradient-gold">Notes</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { notes: headNotes, label: 'Notes de Tête', sub: 'Première impression', emoji: '🌿' },
                { notes: heartNotes, label: 'Notes de Cœur', sub: "L'âme du parfum", emoji: '🌸' },
                { notes: baseNotes, label: 'Notes de Fond', sub: 'Le sillage', emoji: '🪵' },
              ].map((section, i) => section.notes.length > 0 && (
                <div key={i} className={`bg-noir-light border p-6 sm:p-8 text-center ${i === 1 ? 'border-or/15' : 'border-ivoire/5'}`}>
                  {i === 1 && <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-or to-transparent" />}
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center ${i === 1 ? 'from-or/30 to-or/10' : 'from-or/20 to-or/5'}`}>
                    <span className="text-lg">{section.emoji}</span>
                  </div>
                  <h3 className="font-playfair text-or text-base mb-1">{section.label}</h3>
                  <p className="text-ivoire/30 text-[10px] tracking-wider uppercase mb-4">{section.sub}</p>
                  <div className="space-y-2">
                    {section.notes.map((note, j) => (
                      <span key={j} className={`inline-block px-3 py-1 text-xs mr-2 mb-1 ${i === 1 ? 'bg-or/15 text-or' : 'bg-or/10 text-or/80'}`}>{note.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Story */}
        {product.story && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-16 sm:mt-24 max-w-3xl mx-auto text-center">
            <span className="text-or/60 text-[10px] tracking-[0.4em] uppercase">L'inspiration</span>
            <h2 className="font-playfair text-2xl sm:text-3xl text-ivoire mt-3 mb-8">
              L'histoire derrière <span className="italic text-gradient-gold">{product.name}</span>
            </h2>
            <div className="bg-glass-light p-8 sm:p-12">
              <p className="font-cormorant text-lg sm:text-xl text-ivoire/70 italic leading-relaxed">"{product.story}"</p>
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-2xl text-ivoire">Vous aimerez <span className="italic text-gradient-gold">aussi</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <div key={p.id} className="group cursor-pointer" onClick={() => { onSelectProduct(p.id); window.scrollTo(0, 0); }}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-noir-medium">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
                  </div>
                  <p className="text-or/40 text-[10px] uppercase tracking-wider">{p.brand}</p>
                  <h3 className="font-playfair text-ivoire group-hover:text-or transition-colors">{p.name}</h3>
                  <p className="text-or text-sm mt-1">{p.price.toLocaleString('fr-DZ')} DA</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
