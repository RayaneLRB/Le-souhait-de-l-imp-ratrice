import { db, isFirebaseConfigured } from '../firebase';
import {
  collection, doc, getDocs, setDoc, deleteDoc, onSnapshot,
  type Unsubscribe
} from 'firebase/firestore';
import { products as defaultProducts, type Product } from '../data/products';

const COLLECTION = 'products';
const LOCAL_KEY = 'si_products';
const INIT_KEY = 'si_products_initialized';
const ADMIN_PIN = '1909';

export function getAdminPin() { return ADMIN_PIN; }

function ensureStatus(p: Product): Product {
  return { ...p, status: p.status || 'disponible' };
}

// ── FIREBASE MODE ──

async function firebaseInitIfNeeded() {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    if (snap.empty) {
      // First time: upload all default products to Firestore
      const batch = defaultProducts.map(p =>
        setDoc(doc(db!, COLLECTION, p.id), ensureStatus(p))
      );
      await Promise.all(batch);
      console.log(`[Firebase] Initialized ${defaultProducts.length} products`);
    }
  } catch (e) {
    console.error('[Firebase] Init error:', e);
  }
}

export async function loadProductsAsync(): Promise<Product[]> {
  if (!db) return loadProductsLocal();

  await firebaseInitIfNeeded();

  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const products: Product[] = [];
    snap.forEach(d => products.push(ensureStatus(d.data() as Product)));
    return products;
  } catch (e) {
    console.error('[Firebase] Load error, falling back to local:', e);
    return loadProductsLocal();
  }
}

export function subscribeProducts(callback: (products: Product[]) => void): Unsubscribe | null {
  if (!db) return null;
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    const products: Product[] = [];
    snap.forEach(d => products.push(ensureStatus(d.data() as Product)));
    callback(products);
  }, (err) => {
    console.error('[Firebase] Subscribe error:', err);
  });
}

export async function saveProductFirebase(product: Product): Promise<void> {
  if (!db) { saveProductLocal(product); return; }
  try {
    await setDoc(doc(db, COLLECTION, product.id), ensureStatus(product));
  } catch (e) {
    console.error('[Firebase] Save error:', e);
    saveProductLocal(product);
  }
}

export async function deleteProductFirebase(id: string): Promise<void> {
  if (!db) { deleteProductLocal(id); return; }
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (e) {
    console.error('[Firebase] Delete error:', e);
    deleteProductLocal(id);
  }
}

export async function resetProductsFirebase(): Promise<Product[]> {
  if (!db) return resetProductsLocal();
  try {
    // Delete all existing
    const snap = await getDocs(collection(db, COLLECTION));
    const deletes = snap.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletes);
    // Re-upload defaults
    const uploads = defaultProducts.map(p =>
      setDoc(doc(db!, COLLECTION, p.id), ensureStatus(p))
    );
    await Promise.all(uploads);
    return defaultProducts.map(ensureStatus);
  } catch (e) {
    console.error('[Firebase] Reset error:', e);
    return resetProductsLocal();
  }
}

// ── LOCAL FALLBACK MODE ──

function loadProductsLocal(): Product[] {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) return (JSON.parse(stored) as Product[]).map(ensureStatus);
  } catch (e) { console.error('Local load error', e); }

  // First time: seed localStorage
  if (!localStorage.getItem(INIT_KEY)) {
    const seeded = defaultProducts.map(ensureStatus);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(seeded));
    localStorage.setItem(INIT_KEY, '1');
    return seeded;
  }
  return defaultProducts.map(ensureStatus);
}

function saveAllLocal(products: Product[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(products));
}

function saveProductLocal(product: Product) {
  const all = loadProductsLocal();
  const idx = all.findIndex(p => p.id === product.id);
  if (idx >= 0) all[idx] = ensureStatus(product);
  else all.push(ensureStatus(product));
  saveAllLocal(all);
}

function deleteProductLocal(id: string) {
  const all = loadProductsLocal().filter(p => p.id !== id);
  saveAllLocal(all);
}

function resetProductsLocal(): Product[] {
  const fresh = defaultProducts.map(ensureStatus);
  saveAllLocal(fresh);
  return fresh;
}

// ── UTILITY ──

export function generateId(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

export { isFirebaseConfigured };
