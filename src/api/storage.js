import { storage, db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export const uploadBusinessImage = async (businessId, file) => {
  if (!file || !businessId) return null;

  try {
    const storageRef = ref(storage, `businesses/${businessId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Actualiza el array de imágenes en Firestore
    await updateDoc(doc(db, "businesses", businessId), {
      images: arrayUnion(downloadURL),
    });

    return downloadURL;
  } catch (err) {
    console.error("Error subiendo imagen:", err);
    return null;
  }
};
