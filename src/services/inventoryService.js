import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

const INVENTORY_COLLECTION = "inventory";

// Save item
export const addItem = async (item) => {
  await addDoc(collection(db, INVENTORY_COLLECTION), item);
};

// Get all items
export const getItems = async () => {
  const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};