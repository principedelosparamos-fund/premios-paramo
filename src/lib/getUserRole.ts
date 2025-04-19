// lib/getUserRole.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserRole(uid: string) {
  const userRef = doc(db, "jurados", uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data().rol; // 'admin' o 'jurado'
  } else {
    throw new Error("No se encontró rol para este usuario.");
  }
}
