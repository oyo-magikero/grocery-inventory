import { useState, useEffect } from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import { lookupProduct } from "./utils/lookupProduct";
import { addItem } from "./services/inventoryService";

import { db } from "./firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { deleteItem } from "./services/inventoryService";

function App() {
  const [product, setProduct] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [inventory, setInventory] = useState([]);

  // 🔥 REAL-TIME FIRESTORE SYNC (IMPORTANT UPGRADE)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInventory(items);
    });

    return () => unsub();
  }, []);

  // 📷 Barcode scan
  const handleScan = async (barcode) => {
    try {
      const result = await lookupProduct(barcode);
      setProduct({ ...result, barcode });
    } catch (err) {
      console.error("Lookup failed:", err);
    }
  };

  // ➕ Add to Firestore
  const addToInventory = async () => {
    if (!product || !expiry) return;

    const newItem = {
      name: product.name,
      brand: product.brand,
      barcode: product.barcode,
      expiry,
      createdAt: new Date().toISOString(),
    };

    try {
      await addItem(newItem);

      setProduct(null);
      setExpiry("");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };
// delete
  const handleDelete = async (id) => {
  try {
    await deleteItem(id);
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Grocery Inventory</h1>

      <BarcodeScanner onScan={handleScan} />

      {product && (
        <div style={{ marginTop: "20px" }}>
          <h2>{product.name}</h2>
          <p>{product.brand}</p>

          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />

          <br />
          <br />

          <button onClick={addToInventory}>
            Add to Inventory
          </button>
        </div>
      )}

      <hr />

      <h2>Inventory</h2>

      {inventory.length === 0 && <p>No items yet.</p>}

      {inventory.map((item) => (
  <div key={item.id} style={{ marginBottom: "10px" }}>
    <h3>{item.name}</h3>
    <p>{item.brand}</p>
    <p>Expires: {item.expiry}</p>

    <button
      onClick={() => handleDelete(item.id)}
      style={{
        marginTop: "5px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer"
      }}
    >
      Delete
    </button>
  </div>
))}
    </div>
  );
}

export default App;