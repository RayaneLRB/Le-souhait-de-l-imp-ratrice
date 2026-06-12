import { db, isFirebaseConfigured } from '../firebase';
import {
  collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, updateDoc,
  type Unsubscribe
} from 'firebase/firestore';

export type OrderStatus = 'nouvelle' | 'confirmee' | 'annulee';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
}

const COLLECTION = 'orders';
const LOCAL_KEY = 'si_orders';

export const WILAYAS = [
  "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna",
  "06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira",
  "11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou",
  "16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda",
  "21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine",
  "26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla",
  "31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arreridj","35 - Boumerdès",
  "36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
  "41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma",
  "46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane",
  "49 - El M'Ghair","50 - El Meniaa","51 - Ouled Djellal","52 - Bordj Badji Mokhtar",
  "53 - Béni Abbès","54 - Timimoun","55 - Touggourt","56 - Djanet",
  "57 - In Salah","58 - In Guezzam"
];

// ── FIREBASE MODE ──

export async function loadOrdersAsync(): Promise<Order[]> {
  if (!db) return loadOrdersLocal();
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const orders: Order[] = [];
    snap.forEach(d => orders.push(d.data() as Order));
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (e) {
    console.error('[Firebase] Load orders error:', e);
    return loadOrdersLocal();
  }
}

export function subscribeOrders(callback: (orders: Order[]) => void): Unsubscribe | null {
  if (!db) return null;
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    const orders: Order[] = [];
    snap.forEach(d => orders.push(d.data() as Order));
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(orders);
  }, (err) => {
    console.error('[Firebase] Subscribe orders error:', err);
  });
}

export async function addOrderAsync(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    status: 'nouvelle',
    createdAt: new Date().toISOString(),
  };

  if (!db) {
    addOrderLocal(newOrder);
    return newOrder;
  }

  try {
    await setDoc(doc(db, COLLECTION, newOrder.id), newOrder);
  } catch (e) {
    console.error('[Firebase] Add order error:', e);
    addOrderLocal(newOrder);
  }
  return newOrder;
}

export async function updateOrderStatusAsync(id: string, status: OrderStatus): Promise<void> {
  if (!db) { updateOrderStatusLocal(id, status); return; }
  try {
    await updateDoc(doc(db, COLLECTION, id), { status });
  } catch (e) {
    console.error('[Firebase] Update order error:', e);
    updateOrderStatusLocal(id, status);
  }
}

export async function deleteOrderAsync(id: string): Promise<void> {
  if (!db) { deleteOrderLocal(id); return; }
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (e) {
    console.error('[Firebase] Delete order error:', e);
    deleteOrderLocal(id);
  }
}

// ── LOCAL FALLBACK ──

function loadOrdersLocal(): Order[] {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error('Local orders load error', e); }
  return [];
}

function saveOrdersLocal(orders: Order[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(orders));
}

function addOrderLocal(order: Order) {
  const all = [order, ...loadOrdersLocal()];
  saveOrdersLocal(all);
}

function updateOrderStatusLocal(id: string, status: OrderStatus) {
  const all = loadOrdersLocal().map(o => o.id === id ? { ...o, status } : o);
  saveOrdersLocal(all);
}

function deleteOrderLocal(id: string) {
  const all = loadOrdersLocal().filter(o => o.id !== id);
  saveOrdersLocal(all);
}

export { isFirebaseConfigured };
