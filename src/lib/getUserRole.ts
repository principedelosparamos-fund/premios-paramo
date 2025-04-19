import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Ajusta el path si es necesario

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const userDoc = doc(db, 'jurados', uid);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      console.error('⚠️ No existe usuario en Firestore.');
      return null;
    }

    const userData = userSnap.data();
    const rol = userData?.rol || null;

    if (rol !== 'admin' && rol !== 'jurado') {
      console.error('⚠️ Rol inválido:', rol);
      return null;
    }

    return rol;

  } catch (error) {
    console.error('❌ Error obteniendo rol:', error);
    return null;
  }
}
