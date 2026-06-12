import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit3, Trash2, Copy, ArrowLeft, Save, X,
  Package, AlertTriangle, Clock,
  ChevronDown, RotateCcw, Star, BarChart3, Grid3X3,
  List, Check, Tag, ShoppingBag, Phone, MapPin, User, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { type Product, type ProductStatus, type Note } from '../data/products';
import {
  saveProductFirebase, deleteProductFirebase,
  generateId, resetProductsFirebase
} from '../store/productStore';
import {
  type Order,
  updateOrderStatusAsync, deleteOrderAsync
} from '../store/orderStore';

interface DashboardPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  onExit: () => void;
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string; icon: typeof Package }> = {
  disponible: { label: 'Disponible', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30', icon: Check },
  promo: { label: 'En Promo', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30', icon: Tag },
  rupture: { label: 'Rupture de Stock', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', icon: AlertTriangle },
  bientot: { label: 'Bientôt Disponible', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30', icon: Clock },
};

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '', brand: '', subtitle: '', description: '', story: '',
  price: 0, image: '', gallery: [], gender: 'mixte',
  family: '', intensity: 3, longevity: '6-8 heures',
  season: 'Toutes saisons', moment: 'Jour & Soir',
  collection: 'Designer Homme', isNew: false, isExclusive: false,
  notes: [], volume: '100ml', status: 'disponible',
};

type ViewMode = 'grid' | 'list';
type Tab = 'products' | 'orders' | 'stats' | 'edit';

export default function DashboardPage({ products, setProducts, orders, setOrders, onExit }: DashboardPageProps) {
  const [tab, setTab] = useState<Tab>('products');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Notes editor state
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteType, setNewNoteType] = useState<'tete' | 'coeur' | 'fond'>('tete');

  // Orders state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const newOrdersCount = orders.filter(o => o.status === 'nouvelle').length;

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (orderSearch) {
      const s = orderSearch.toLowerCase();
      result = result.filter(o =>
        o.fullName.toLowerCase().includes(s) ||
        o.productName.toLowerCase().includes(s) ||
        o.productBrand.toLowerCase().includes(s) ||
        o.phone.includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.wilaya.toLowerCase().includes(s)
      );
    }
    if (orderFilter !== 'all') result = result.filter(o => o.status === orderFilter);
    return result;
  }, [orders, orderSearch, orderFilter]);

  const handleOrderStatus = async (id: string, status: 'confirmee' | 'annulee') => {
    await updateOrderStatusAsync(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(status === 'confirmee' ? 'Commande confirmée ✓' : 'Commande annulée');
    setViewingOrder(null);
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrderAsync(id);
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Commande supprimée');
    setViewingOrder(null);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
      );
    }
    if (filterStatus !== 'all') result = result.filter(p => (p.status || 'disponible') === filterStatus);
    if (filterGender !== 'all') result = result.filter(p => p.gender === filterGender);
    return result;
  }, [products, search, filterStatus, filterGender]);

  // Stats
  const stats = useMemo(() => {
    const total = products.length;
    const dispo = products.filter(p => (p.status || 'disponible') === 'disponible').length;
    const promo = products.filter(p => p.status === 'promo').length;
    const rupture = products.filter(p => p.status === 'rupture').length;
    const bientot = products.filter(p => p.status === 'bientot').length;
    const hommes = products.filter(p => p.gender === 'homme').length;
    const femmes = products.filter(p => p.gender === 'femme').length;
    const mixtes = products.filter(p => p.gender === 'mixte').length;
    const brands = new Set(products.map(p => p.brand)).size;
    const avgPrice = total > 0 ? Math.round(products.reduce((s, p) => s + p.price, 0) / total) : 0;
    return { total, dispo, promo, rupture, bientot, hommes, femmes, mixtes, brands, avgPrice };
  }, [products]);

  // ── HANDLERS ──
  const handleDelete = async (id: string) => {
    await deleteProductFirebase(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    showToast('Produit supprimé');
  };

  const handleDuplicate = async (id: string) => {
    const src = products.find(p => p.id === id);
    if (!src) return;
    const copy: Product = { ...src, id: generateId(src.name + '-copy'), name: src.name + ' (copie)' };
    await saveProductFirebase(copy);
    setProducts(prev => [...prev, copy]);
    showToast('Produit dupliqué');
  };

  const handleStatusChange = async (id: string, status: ProductStatus) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const updated = { ...product, status };
    await saveProductFirebase(updated);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    showToast(`Statut mis à jour : ${STATUS_CONFIG[status].label}`);
  };

  const handleStartCreate = () => {
    setEditingProduct({ ...EMPTY_PRODUCT, id: '' } as Product);
    setIsCreating(true);
    setTab('edit');
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct({ ...p, status: p.status || 'disponible' });
    setIsCreating(false);
    setTab('edit');
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.brand) {
      showToast('Nom et marque sont obligatoires');
      return;
    }

    if (isCreating) {
      const newProduct: Product = {
        ...editingProduct,
        id: generateId(editingProduct.name),
        status: editingProduct.status || 'disponible',
      };
      await saveProductFirebase(newProduct);
      setProducts(prev => [...prev, newProduct]);
    } else {
      await saveProductFirebase(editingProduct);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    }

    setEditingProduct(null);
    setTab('products');
    showToast(isCreating ? 'Produit ajouté avec succès' : 'Produit modifié avec succès');
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setTab('products');
  };

  const handleReset = async () => {
    const fresh = await resetProductsFirebase();
    setProducts(fresh);
    setShowResetConfirm(false);
    showToast('Catalogue réinitialisé');
  };

  const handleAddNote = () => {
    if (!editingProduct || !newNoteName.trim()) return;
    const note: Note = { name: newNoteName.trim(), type: newNoteType };
    setEditingProduct({ ...editingProduct, notes: [...editingProduct.notes, note] });
    setNewNoteName('');
  };

  const handleRemoveNote = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      notes: editingProduct.notes.filter((_, i) => i !== idx),
    });
  };

  const handleGalleryAdd = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      gallery: [...editingProduct.gallery, ''],
    });
  };

  const handleGalleryUpdate = (idx: number, url: string) => {
    if (!editingProduct) return;
    const g = [...editingProduct.gallery];
    g[idx] = url;
    setEditingProduct({ ...editingProduct, gallery: g });
  };

  const handleGalleryRemove = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      gallery: editingProduct.gallery.filter((_, i) => i !== idx),
    });
  };

  const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [key]: value });
  };

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-ivoire">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 right-4 z-[200] bg-or text-noir px-6 py-3 text-sm font-medium flex items-center gap-2 shadow-lg"
          >
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/90 z-[150] flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-noir-light border border-red-500/30 p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-playfair text-center mb-2">Confirmer la suppression</h3>
              <p className="text-ivoire/50 text-sm text-center mb-6">Cette action est irréversible. Le produit sera définitivement supprimé du catalogue.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 border border-ivoire/20 text-ivoire/60 text-sm hover:border-ivoire/40 transition-colors">Annuler</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2 bg-red-500/80 text-white text-sm hover:bg-red-500 transition-colors">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirm Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir/90 z-[150] flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-noir-light border border-amber-500/30 p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <RotateCcw size={32} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-playfair text-center mb-2">Réinitialiser le catalogue ?</h3>
              <p className="text-ivoire/50 text-sm text-center mb-6">Toutes vos modifications seront perdues. Le catalogue reviendra à son état initial.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2 border border-ivoire/20 text-ivoire/60 text-sm">Annuler</button>
                <button onClick={handleReset} className="flex-1 py-2 bg-amber-500/80 text-noir text-sm font-medium">Réinitialiser</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <div className="border-b border-ivoire/10 bg-noir/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-ivoire/40 hover:text-or transition-colors flex items-center gap-2 text-sm">
              <ArrowLeft size={16} /> Retour au site
            </button>
            <div className="hidden sm:block h-5 w-px bg-ivoire/10" />
            <h1 className="hidden sm:block font-playfair text-or text-sm tracking-wider">DASHBOARD ADMIN</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowResetConfirm(true)} className="px-3 py-1.5 text-xs border border-ivoire/10 text-ivoire/40 hover:text-amber-400 hover:border-amber-400/30 transition-colors flex items-center gap-1.5">
              <RotateCcw size={12} /> Reset
            </button>
            <span className="text-[10px] text-ivoire/20 hidden sm:block">{products.length} produits</span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="border-b border-ivoire/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex gap-0">
          {([
            { id: 'products' as Tab, label: 'Produits', icon: Package, badge: 0 },
            { id: 'orders' as Tab, label: 'Commandes', icon: ShoppingBag, badge: newOrdersCount },
            { id: 'stats' as Tab, label: 'Statistiques', icon: BarChart3, badge: 0 },
            ...(editingProduct ? [{ id: 'edit' as Tab, label: isCreating ? 'Nouveau' : 'Modifier', icon: Edit3, badge: 0 }] : []),
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 sm:px-6 py-3 text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors relative ${
                tab === t.id ? 'border-or text-or' : 'border-transparent text-ivoire/40 hover:text-ivoire/60'
              }`}
            >
              <t.icon size={14} /> <span className="hidden sm:inline">{t.label}</span>
              {t.badge > 0 && (
                <span className="absolute -top-0.5 right-0 sm:relative sm:top-auto sm:right-auto min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">

        {/* ════════════ TAB: PRODUCTS ════════════ */}
        {tab === 'products' && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivoire/30" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher par nom, marque ou ID..."
                  className="w-full bg-noir-light border border-ivoire/10 pl-10 pr-4 py-2.5 text-sm text-ivoire placeholder-ivoire/30 focus:outline-none focus:border-or/40"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="appearance-none bg-noir-light border border-ivoire/10 px-4 py-2.5 pr-8 text-xs text-ivoire/60 focus:outline-none focus:border-or/40 cursor-pointer">
                    <option value="all">Tous les statuts</option>
                    <option value="disponible">Disponible</option>
                    <option value="promo">En Promo</option>
                    <option value="rupture">Rupture</option>
                    <option value="bientot">Bientôt</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ivoire/30 pointer-events-none" />
                </div>

                <div className="relative">
                  <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
                    className="appearance-none bg-noir-light border border-ivoire/10 px-4 py-2.5 pr-8 text-xs text-ivoire/60 focus:outline-none focus:border-or/40 cursor-pointer">
                    <option value="all">Tous genres</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="mixte">Mixte</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-ivoire/30 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex border border-ivoire/10">
                  <button onClick={() => setViewMode('list')} className={`px-2.5 py-2 ${viewMode === 'list' ? 'bg-or/20 text-or' : 'text-ivoire/30'}`}><List size={14} /></button>
                  <button onClick={() => setViewMode('grid')} className={`px-2.5 py-2 ${viewMode === 'grid' ? 'bg-or/20 text-or' : 'text-ivoire/30'}`}><Grid3X3 size={14} /></button>
                </div>

                {/* Add button */}
                <button onClick={handleStartCreate}
                  className="bg-or text-noir px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-or-light transition-colors">
                  <Plus size={14} /> Ajouter
                </button>
              </div>
            </div>

            {/* Results info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-ivoire/30 text-xs">{filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}</p>
            </div>

            {/* ── LIST VIEW ── */}
            {viewMode === 'list' && (
              <div className="space-y-1">
                {/* Header */}
                <div className="hidden lg:grid grid-cols-[60px_1fr_120px_100px_100px_120px_140px] gap-3 px-4 py-2 text-[10px] text-ivoire/30 uppercase tracking-wider border-b border-ivoire/5">
                  <span>Image</span><span>Produit</span><span>Prix</span><span>Genre</span><span>Intensité</span><span>Statut</span><span>Actions</span>
                </div>
                {filtered.map(p => {
                  const st = STATUS_CONFIG[(p.status || 'disponible') as ProductStatus];
                  return (
                    <div key={p.id} className="group grid grid-cols-1 lg:grid-cols-[60px_1fr_120px_100px_100px_120px_140px] gap-3 items-center px-4 py-3 bg-noir-light/50 hover:bg-noir-light border border-transparent hover:border-ivoire/5 transition-all">
                      {/* Image */}
                      <div className="w-12 h-12 bg-noir-medium overflow-hidden shrink-0">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ivoire/20"><Package size={16} /></div>}
                      </div>
                      {/* Product */}
                      <div className="min-w-0">
                        <p className="text-ivoire text-sm font-medium truncate">{p.brand} — {p.name}</p>
                        <p className="text-ivoire/30 text-xs truncate">{p.volume} • {p.gender === 'homme' ? 'Homme' : p.gender === 'femme' ? 'Femme' : 'Unisexe'}</p>
                      </div>
                      {/* Price */}
                      <div>
                        <span className="text-or text-sm font-playfair">{p.price.toLocaleString('fr-DZ')}</span>
                        <span className="text-ivoire/20 text-[10px] ml-1">DA</span>
                        {p.status === 'promo' && p.originalPrice && (
                          <span className="text-ivoire/30 text-xs line-through ml-2">{p.originalPrice.toLocaleString('fr-DZ')}</span>
                        )}
                      </div>
                      {/* Gender */}
                      <span className={`text-xs px-2 py-0.5 border inline-block w-fit ${
                        p.gender === 'homme' ? 'border-blue-500/30 text-blue-400' :
                        p.gender === 'femme' ? 'border-pink-500/30 text-pink-400' :
                        'border-purple-500/30 text-purple-400'
                      }`}>
                        {p.gender === 'homme' ? '♂ Homme' : p.gender === 'femme' ? '♀ Femme' : '⚥ Mixte'}
                      </span>
                      {/* Intensity */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} className={i < p.intensity ? 'fill-or text-or' : 'text-ivoire/10'} />
                        ))}
                      </div>
                      {/* Status */}
                      <div className="relative">
                        <select
                          value={p.status || 'disponible'}
                          onChange={e => handleStatusChange(p.id, e.target.value as ProductStatus)}
                          className={`appearance-none text-[10px] uppercase tracking-wider px-2 py-1 border cursor-pointer bg-transparent focus:outline-none ${st.bg} ${st.color}`}
                        >
                          <option value="disponible" className="bg-noir text-ivoire">Disponible</option>
                          <option value="promo" className="bg-noir text-ivoire">En Promo</option>
                          <option value="rupture" className="bg-noir text-ivoire">Rupture</option>
                          <option value="bientot" className="bg-noir text-ivoire">Bientôt</option>
                        </select>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-1">
                        <button onClick={() => handleStartEdit(p)} className="p-1.5 text-ivoire/30 hover:text-or hover:bg-or/10 transition-colors" title="Modifier"><Edit3 size={14} /></button>
                        <button onClick={() => handleDuplicate(p.id)} className="p-1.5 text-ivoire/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Dupliquer"><Copy size={14} /></button>
                        <button onClick={() => setShowDeleteConfirm(p.id)} className="p-1.5 text-ivoire/30 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map(p => {
                  const st = STATUS_CONFIG[(p.status || 'disponible') as ProductStatus];
                  return (
                    <div key={p.id} className="bg-noir-light border border-ivoire/5 hover:border-or/20 transition-all group">
                      <div className="relative aspect-square bg-noir-medium overflow-hidden">
                        {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ivoire/15"><Package size={32} /></div>}
                        <div className={`absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 border ${st.bg} ${st.color}`}>{st.label}</div>
                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-noir/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => handleStartEdit(p)} className="p-2 bg-or text-noir hover:bg-or-light"><Edit3 size={14} /></button>
                          <button onClick={() => handleDuplicate(p.id)} className="p-2 bg-ivoire/10 text-ivoire hover:bg-ivoire/20"><Copy size={14} /></button>
                          <button onClick={() => setShowDeleteConfirm(p.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-or/50 text-[10px] uppercase tracking-wider">{p.brand}</p>
                        <p className="text-ivoire text-sm truncate">{p.name}</p>
                        <p className="text-or font-playfair text-sm mt-1">{p.price.toLocaleString('fr-DZ')} DA</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Package size={40} className="text-ivoire/10 mx-auto mb-4" />
                <p className="text-ivoire/30 text-sm">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* ════════════ TAB: STATS ════════════ */}
        {tab === 'stats' && (
          <div>
            <h2 className="font-playfair text-xl text-ivoire mb-6">Vue d'ensemble</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Produits', value: stats.total, icon: Package, color: 'text-or' },
                { label: 'Disponibles', value: stats.dispo, icon: Check, color: 'text-emerald-400' },
                { label: 'En Promo', value: stats.promo, icon: Tag, color: 'text-amber-400' },
                { label: 'Rupture', value: stats.rupture, icon: AlertTriangle, color: 'text-red-400' },
                { label: 'Bientôt', value: stats.bientot, icon: Clock, color: 'text-blue-400' },
              ].map((kpi, i) => (
                <div key={i} className="bg-noir-light border border-ivoire/5 p-5">
                  <kpi.icon size={18} className={`${kpi.color} mb-3`} />
                  <p className="font-playfair text-2xl text-ivoire">{kpi.value}</p>
                  <p className="text-ivoire/30 text-xs mt-1">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Detail Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* By Gender */}
              <div className="bg-noir-light border border-ivoire/5 p-6">
                <h3 className="text-or text-xs uppercase tracking-wider mb-4">Par Genre</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Homme', value: stats.hommes, pct: Math.round((stats.hommes / stats.total) * 100), color: 'bg-blue-500' },
                    { label: 'Femme', value: stats.femmes, pct: Math.round((stats.femmes / stats.total) * 100), color: 'bg-pink-500' },
                    { label: 'Mixte', value: stats.mixtes, pct: Math.round((stats.mixtes / stats.total) * 100), color: 'bg-purple-500' },
                  ].map((g, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ivoire/60">{g.label}</span>
                        <span className="text-ivoire/40">{g.value} ({g.pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-ivoire/5 rounded-full overflow-hidden">
                        <div className={`h-full ${g.color} rounded-full`} style={{ width: `${g.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Brands */}
              <div className="bg-noir-light border border-ivoire/5 p-6">
                <h3 className="text-or text-xs uppercase tracking-wider mb-4">Top Marques</h3>
                <div className="space-y-2">
                  {Object.entries(
                    products.reduce((acc: Record<string, number>, p) => {
                      acc[p.brand] = (acc[p.brand] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([brand, count], i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-ivoire/60">{brand}</span>
                        <span className="text-or text-xs">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Price & Info */}
              <div className="bg-noir-light border border-ivoire/5 p-6">
                <h3 className="text-or text-xs uppercase tracking-wider mb-4">Informations</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-ivoire/30 text-xs">Prix moyen</p>
                    <p className="text-ivoire font-playfair text-lg">{stats.avgPrice.toLocaleString('fr-DZ')} DA</p>
                  </div>
                  <div>
                    <p className="text-ivoire/30 text-xs">Nombre de marques</p>
                    <p className="text-ivoire font-playfair text-lg">{stats.brands}</p>
                  </div>
                  <div>
                    <p className="text-ivoire/30 text-xs">Nouveautés</p>
                    <p className="text-ivoire font-playfair text-lg">{products.filter(p => p.isNew).length}</p>
                  </div>
                  <div>
                    <p className="text-ivoire/30 text-xs">Exclusifs</p>
                    <p className="text-ivoire font-playfair text-lg">{products.filter(p => p.isExclusive).length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ TAB: ORDERS ════════════ */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl text-ivoire">
                Commandes
                {newOrdersCount > 0 && <span className="ml-3 inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-red-500 text-white text-xs font-bold px-2">{newOrdersCount} nouvelle{newOrdersCount > 1 ? 's' : ''}</span>}
              </h2>
            </div>

            {/* Orders toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivoire/30" />
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Rechercher par nom, téléphone, wilaya, produit..."
                  className="w-full bg-noir-light border border-ivoire/10 pl-10 pr-4 py-2.5 text-sm text-ivoire placeholder-ivoire/30 focus:outline-none focus:border-or/40" />
              </div>
              <div className="flex gap-2">
                {[
                  { v: 'all', l: 'Toutes', c: 'text-ivoire/50' },
                  { v: 'nouvelle', l: `Nouvelles (${orders.filter(o=>o.status==='nouvelle').length})`, c: 'text-red-400' },
                  { v: 'confirmee', l: 'Confirmées', c: 'text-emerald-400' },
                  { v: 'annulee', l: 'Annulées', c: 'text-ivoire/30' },
                ].map(f => (
                  <button key={f.v} onClick={() => setOrderFilter(f.v)}
                    className={`px-3 py-2 text-[10px] sm:text-xs uppercase tracking-wider border transition-colors ${
                      orderFilter === f.v ? 'border-or text-or' : `border-ivoire/10 ${f.c} hover:border-ivoire/20`
                    }`}>{f.l}</button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag size={40} className="text-ivoire/10 mx-auto mb-4" />
                <p className="text-ivoire/30 text-sm">{orders.length === 0 ? 'Aucune commande pour le moment' : 'Aucune commande trouvée'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredOrders.map(order => {
                  const isNew = order.status === 'nouvelle';
                  const isConfirmed = order.status === 'confirmee';
                  const isCancelled = order.status === 'annulee';
                  const date = new Date(order.createdAt);
                  const dateStr = date.toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={order.id}
                      className={`border p-4 sm:p-5 transition-all ${
                        isNew ? 'bg-red-500/5 border-red-500/20' :
                        isConfirmed ? 'bg-emerald-500/5 border-emerald-500/10' :
                        'bg-noir-light/50 border-ivoire/5 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Product mini */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-noir-medium overflow-hidden shrink-0">
                            {order.productImage ? <img src={order.productImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ivoire/20"><Package size={16} /></div>}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-ivoire/30 text-[10px] font-mono">{order.id}</span>
                              {isNew && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">Nouvelle</span>}
                              {isConfirmed && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 uppercase tracking-wider border border-emerald-500/30">Confirmée</span>}
                              {isCancelled && <span className="bg-ivoire/5 text-ivoire/30 text-[9px] px-1.5 py-0.5 uppercase tracking-wider border border-ivoire/10">Annulée</span>}
                            </div>
                            <p className="text-ivoire text-sm font-medium truncate">{order.productBrand} — {order.productName} {order.quantity > 1 ? `×${order.quantity}` : ''}</p>
                            <p className="text-or text-sm font-playfair">{order.totalPrice.toLocaleString('fr-DZ')} DA</p>
                          </div>
                        </div>

                        {/* Client info mini */}
                        <div className="flex flex-col sm:items-end gap-0.5 text-xs">
                          <span className="text-ivoire/70 flex items-center gap-1"><User size={11} /> {order.fullName}</span>
                          <span className="text-ivoire/40 flex items-center gap-1"><Phone size={11} /> {order.phone}</span>
                          <span className="text-ivoire/30 flex items-center gap-1"><MapPin size={11} /> {order.wilaya}</span>
                          <span className="text-ivoire/20 text-[10px] mt-1">{dateStr}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 sm:ml-4 shrink-0">
                          <button onClick={() => setViewingOrder(order)} className="p-2 text-ivoire/30 hover:text-or hover:bg-or/10 transition-colors" title="Voir"><Eye size={15} /></button>
                          {isNew && (
                            <>
                              <button onClick={() => handleOrderStatus(order.id, 'confirmee')} className="p-2 text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors" title="Confirmer"><CheckCircle size={15} /></button>
                              <button onClick={() => handleOrderStatus(order.id, 'annulee')} className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Annuler"><XCircle size={15} /></button>
                            </>
                          )}
                          {!isNew && (
                            <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-ivoire/20 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {viewingOrder && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-noir/90 z-[150] flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => setViewingOrder(null)}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-noir-light border border-or/20 max-w-lg w-full my-10 relative"
                onClick={e => e.stopPropagation()}>
                <button onClick={() => setViewingOrder(null)} className="absolute top-4 right-4 text-ivoire/30 hover:text-or"><X size={18} /></button>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-ivoire/30 text-xs font-mono">{viewingOrder.id}</span>
                    {viewingOrder.status === 'nouvelle' && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">Nouvelle</span>}
                    {viewingOrder.status === 'confirmee' && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 uppercase border border-emerald-500/30">Confirmée</span>}
                    {viewingOrder.status === 'annulee' && <span className="bg-ivoire/5 text-ivoire/30 text-[9px] px-1.5 py-0.5 uppercase border border-ivoire/10">Annulée</span>}
                  </div>
                  <p className="text-ivoire/20 text-[10px] mb-6">{new Date(viewingOrder.createdAt).toLocaleString('fr-DZ')}</p>

                  {/* Product */}
                  <div className="flex items-center gap-4 bg-noir/50 p-3 border border-ivoire/5 mb-6">
                    <img src={viewingOrder.productImage} alt="" className="w-16 h-16 object-cover" />
                    <div>
                      <p className="text-or/50 text-[9px] uppercase tracking-wider">{viewingOrder.productBrand}</p>
                      <p className="text-ivoire font-playfair">{viewingOrder.productName}</p>
                      <p className="text-ivoire/40 text-xs">Quantité : {viewingOrder.quantity}</p>
                      <p className="text-or font-playfair text-lg">{viewingOrder.totalPrice.toLocaleString('fr-DZ')} DA</p>
                    </div>
                  </div>

                  {/* Client */}
                  <h4 className="text-or text-[10px] uppercase tracking-wider mb-3">Informations client</h4>
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: User, label: 'Nom', value: viewingOrder.fullName },
                      { icon: Phone, label: 'Téléphone', value: viewingOrder.phone },
                      ...(viewingOrder.email ? [{ icon: Star, label: 'Email', value: viewingOrder.email }] : []),
                      { icon: MapPin, label: 'Wilaya', value: viewingOrder.wilaya },
                      { icon: MapPin, label: 'Commune', value: viewingOrder.commune },
                      { icon: MapPin, label: 'Adresse', value: viewingOrder.address },
                      ...(viewingOrder.notes ? [{ icon: Edit3, label: 'Remarques', value: viewingOrder.notes }] : []),
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <item.icon size={14} className="text-or/50 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-ivoire/30 text-[10px] uppercase">{item.label}</p>
                          <p className="text-ivoire">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  {viewingOrder.status === 'nouvelle' && (
                    <div className="flex gap-3">
                      <button onClick={() => handleOrderStatus(viewingOrder.id, 'confirmee')}
                        className="flex-1 py-3 bg-emerald-500/80 text-white text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors">
                        <CheckCircle size={14} /> Confirmer
                      </button>
                      <button onClick={() => handleOrderStatus(viewingOrder.id, 'annulee')}
                        className="flex-1 py-3 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors">
                        <XCircle size={14} /> Annuler
                      </button>
                    </div>
                  )}
                  {viewingOrder.status !== 'nouvelle' && (
                    <div className="flex gap-3">
                      <a href={`tel:${viewingOrder.phone}`}
                        className="flex-1 py-3 bg-or text-noir text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 hover:bg-or-light transition-colors">
                        <Phone size={14} /> Appeler le client
                      </a>
                      <button onClick={() => handleDeleteOrder(viewingOrder.id)}
                        className="px-4 py-3 border border-ivoire/10 text-ivoire/30 text-xs hover:text-red-400 hover:border-red-500/30 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════ TAB: EDIT / CREATE ════════════ */}
        {tab === 'edit' && editingProduct && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl text-ivoire">
                {isCreating ? 'Ajouter un produit' : `Modifier — ${editingProduct.brand} ${editingProduct.name}`}
              </h2>
              <div className="flex gap-2">
                <button onClick={handleCancel} className="px-4 py-2 border border-ivoire/10 text-ivoire/50 text-xs flex items-center gap-2 hover:border-ivoire/30 transition-colors">
                  <X size={14} /> Annuler
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-or text-noir text-xs font-medium flex items-center gap-2 hover:bg-or-light transition-colors">
                  <Save size={14} /> Enregistrer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Column 1: Main Info ── */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Informations principales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Marque *</label>
                      <input value={editingProduct.brand} onChange={e => updateField('brand', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40" placeholder="Ex: Dior" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Nom du parfum *</label>
                      <input value={editingProduct.name} onChange={e => updateField('name', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40" placeholder="Ex: Sauvage" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Sous-titre</label>
                      <input value={editingProduct.subtitle} onChange={e => updateField('subtitle', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40" placeholder="Ex: La force brute de la nature" />
                    </div>

                  </div>
                  <div className="mt-4">
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Description</label>
                    <textarea value={editingProduct.description} onChange={e => updateField('description', e.target.value)}
                      rows={3} className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40 resize-none" placeholder="Description du parfum..." />
                  </div>
                  <div className="mt-4">
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Histoire / Storytelling</label>
                    <textarea value={editingProduct.story} onChange={e => updateField('story', e.target.value)}
                      rows={2} className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40 resize-none" placeholder="L'histoire derrière ce parfum..." />
                  </div>
                </div>

                {/* Pricing & Status */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Prix & Disponibilité</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Prix (DA)</label>
                      <input type="number" value={editingProduct.price} onChange={e => updateField('price', Number(e.target.value))}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-or focus:outline-none focus:border-or/40" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Ancien prix (Promo)</label>
                      <input type="number" value={editingProduct.originalPrice || ''} onChange={e => updateField('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire/50 focus:outline-none focus:border-or/40" placeholder="Optionnel" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Volume</label>
                      <input value={editingProduct.volume} onChange={e => updateField('volume', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40" placeholder="Ex: 100ml" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Statut</label>
                      <select value={editingProduct.status || 'disponible'} onChange={e => updateField('status', e.target.value as ProductStatus)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40 cursor-pointer">
                        <option value="disponible">✅ Disponible</option>
                        <option value="promo">🏷️ En Promo</option>
                        <option value="rupture">🚫 Rupture de Stock</option>
                        <option value="bientot">⏳ Bientôt Disponible</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Images</h3>
                  <div>
                    <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Image principale (URL)</label>
                    <input value={editingProduct.image} onChange={e => updateField('image', e.target.value)}
                      className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40" placeholder="https://..." />
                  </div>
                  {editingProduct.image && (
                    <div className="mt-3 w-24 h-24 bg-noir overflow-hidden border border-ivoire/10">
                      <img src={editingProduct.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider">Galerie</label>
                      <button onClick={handleGalleryAdd} className="text-or text-[10px] flex items-center gap-1 hover:text-or-light"><Plus size={12} /> Ajouter</button>
                    </div>
                    <div className="space-y-2">
                      {editingProduct.gallery.map((url, i) => (
                        <div key={i} className="flex gap-2">
                          <input value={url} onChange={e => handleGalleryUpdate(i, e.target.value)}
                            className="flex-1 bg-noir border border-ivoire/10 px-3 py-1.5 text-xs text-ivoire focus:outline-none focus:border-or/40" placeholder="URL de l'image..." />
                          <button onClick={() => handleGalleryRemove(i)} className="text-red-400/50 hover:text-red-400"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes Olfactives */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Notes olfactives</h3>
                  {/* Existing notes */}
                  <div className="space-y-2 mb-4">
                    {['tete', 'coeur', 'fond'].map(type => {
                      const typeNotes = editingProduct.notes.filter(n => n.type === type);
                      if (typeNotes.length === 0) return null;
                      return (
                        <div key={type}>
                          <p className="text-ivoire/30 text-[10px] uppercase tracking-wider mb-1">
                            {type === 'tete' ? '🌿 Notes de Tête' : type === 'coeur' ? '🌸 Notes de Cœur' : '🪵 Notes de Fond'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {editingProduct.notes.map((n, i) => n.type === type ? (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-or/10 text-or/80 text-xs">
                                {n.name}
                                <button onClick={() => handleRemoveNote(i)} className="text-or/40 hover:text-red-400"><X size={10} /></button>
                              </span>
                            ) : null)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Add note */}
                  <div className="flex gap-2">
                    <input value={newNoteName} onChange={e => setNewNoteName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                      className="flex-1 bg-noir border border-ivoire/10 px-3 py-1.5 text-xs text-ivoire focus:outline-none focus:border-or/40" placeholder="Nom de la note..." />
                    <select value={newNoteType} onChange={e => setNewNoteType(e.target.value as 'tete' | 'coeur' | 'fond')}
                      className="bg-noir border border-ivoire/10 px-2 py-1.5 text-xs text-ivoire/60 focus:outline-none">
                      <option value="tete">Tête</option>
                      <option value="coeur">Cœur</option>
                      <option value="fond">Fond</option>
                    </select>
                    <button onClick={handleAddNote} className="px-3 py-1.5 bg-or/20 text-or text-xs hover:bg-or/30"><Plus size={12} /></button>
                  </div>
                </div>
              </div>

              {/* ── Column 2: Side panel ── */}
              <div className="space-y-6">
                {/* Preview */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Aperçu</h3>
                  <div className="aspect-[3/4] bg-noir-medium mb-4 overflow-hidden">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ivoire/10"><Package size={48} /></div>
                    )}
                  </div>
                  <p className="text-or/50 text-[10px] uppercase tracking-wider">{editingProduct.brand || 'Marque'}</p>
                  <p className="text-ivoire font-playfair text-lg">{editingProduct.name || 'Nom du parfum'}</p>
                  <p className="text-ivoire/40 text-xs italic">{editingProduct.subtitle}</p>
                  <p className="text-or font-playfair text-lg mt-2">{editingProduct.price ? editingProduct.price.toLocaleString('fr-DZ') + ' DA' : '—'}</p>
                </div>

                {/* Classification */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Classification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Genre</label>
                      <select value={editingProduct.gender} onChange={e => updateField('gender', e.target.value as Product['gender'])}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40">
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                        <option value="mixte">Mixte / Unisexe</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Intensité ({editingProduct.intensity}/5)</label>
                      <input type="range" min={1} max={5} value={editingProduct.intensity} onChange={e => updateField('intensity', Number(e.target.value))}
                        className="w-full accent-or" />
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Longévité</label>
                      <select value={editingProduct.longevity} onChange={e => updateField('longevity', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40">
                        <option>2-4 heures</option><option>4-6 heures</option><option>6-8 heures</option><option>8-10 heures</option><option>10-12 heures</option><option>12+ heures</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Saison</label>
                      <select value={editingProduct.season} onChange={e => updateField('season', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40">
                        <option>Toutes saisons</option><option>Printemps / Été</option><option>Automne / Hiver</option><option>Printemps</option><option>Été</option><option>Automne</option><option>Hiver</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-ivoire/30 text-[10px] uppercase tracking-wider block mb-1.5">Moment</label>
                      <select value={editingProduct.moment} onChange={e => updateField('moment', e.target.value)}
                        className="w-full bg-noir border border-ivoire/10 px-3 py-2 text-sm text-ivoire focus:outline-none focus:border-or/40">
                        <option>Jour & Soir</option><option>Journée</option><option>Soirée</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div className="bg-noir-light border border-ivoire/5 p-6">
                  <h3 className="text-or text-xs uppercase tracking-wider mb-4">Badges</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={editingProduct.isNew} onChange={e => updateField('isNew', e.target.checked)}
                        className="w-4 h-4 accent-or bg-noir border-ivoire/20" />
                      <span className="text-ivoire/60 text-sm group-hover:text-ivoire transition-colors">Nouveau</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={editingProduct.isExclusive} onChange={e => updateField('isExclusive', e.target.checked)}
                        className="w-4 h-4 accent-or bg-noir border-ivoire/20" />
                      <span className="text-ivoire/60 text-sm group-hover:text-ivoire transition-colors">Exclusif</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
