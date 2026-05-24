import {
  collection, addDoc, getDocs, getDoc,
  doc, updateDoc, query, orderBy, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from './orders';

const COLLECTION = 'orders';

export async function createFirestoreOrder(order: Omit<Order, 'id'>): Promise<Order> {
  const ref  = await addDoc(collection(db, COLLECTION), {
    ...order,
    createdAt: order.createdAt ?? new Date().toISOString(),
  });
  return { ...order, id: ref.id } as Order;
}

export async function getFirestoreOrders(): Promise<Order[]> {
  const q    = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Order);
}

export async function getFirestoreOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { ...snap.data(), id: snap.id } as Order;
}

export async function updateFirestoreOrder(id: string, updates: Partial<Order>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDoc(doc(db, COLLECTION, id), updates as any);
}
