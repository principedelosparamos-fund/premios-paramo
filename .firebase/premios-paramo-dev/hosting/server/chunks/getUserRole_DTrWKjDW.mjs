import { doc, getDoc } from 'firebase/firestore';
import { d as db } from './Layout_DFdrdMO9.mjs';

async function getUserRole(uid) {
  const userRef = doc(db, "jurados", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data().rol;
  } else {
    throw new Error("No se encontró rol para este usuario.");
  }
}

export { getUserRole as g };
