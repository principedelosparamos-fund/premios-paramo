// src/lib/getUserRole.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene el rol del usuario desde Firestore usando su UID.
 * @param uid UID del usuario autenticado.
 * @returns "admin", "jurado" o null si no se encuentra.
 */
export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, "jurados", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.rol || null;
    } else {
      if (import.meta.env.DEV) {
        console.error(`⚠️ Usuario con UID ${uid} no encontrado en la colección jurados.`);
      }
      return null;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("⚠️ Error al obtener el rol del usuario:", error);
    }
    return null;
  }
};
