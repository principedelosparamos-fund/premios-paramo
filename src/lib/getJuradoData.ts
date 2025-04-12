import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getJuradoData(email: string) {
  const ref = doc(db, 'jurados', email);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data(); // { nombre, categorias }
  } else {
    return null;
  }
}
