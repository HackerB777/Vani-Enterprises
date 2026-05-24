import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface AdminConfig {
  adminMobile:     string;
  developerMobile: string;
}

export async function adminLogin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  return firebaseSignOut(auth);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not logged in');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

export async function getAdminConfig(): Promise<AdminConfig> {
  const snap = await getDoc(doc(db, 'admin_config', 'main'));
  if (!snap.exists()) return { adminMobile: '', developerMobile: '' };
  return snap.data() as AdminConfig;
}

export async function saveAdminConfig(data: Partial<AdminConfig>) {
  await setDoc(doc(db, 'admin_config', 'main'), data, { merge: true });
}
