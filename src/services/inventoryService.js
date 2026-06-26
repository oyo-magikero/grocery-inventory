import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

const INVENTORY_COLLECTION = "inventory";

// ➕ Add item
export const addItem = async (item) => {
  await addDoc(collection(db, INVENTORY_COLLECTION), item);
};

// 📥 Get all items
export const getItems = async () => {
  const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🗑 Delete item (NEW)
export const deleteItem = async (id) => {
  await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
};