import { useState, useEffect } from "react";
import BarcodeScanner from "./components/BarcodeScanner";
import { lookupProduct } from "./utils/lookupProduct";
import { addItem, getItems } from "./services/inventoryService";

function App() {
  const [product, setProduct] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [inventory, setInventory] = useState([]);

  // Load inventory from Firestore on startup
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const items = await getItems();
        setInventory(items);
      } catch (err) {
        console.error("Failed to load inventory:", err);
      }
    };

    loadInventory();
  }, []);

  // Handle barcode scan
  const handleScan = async (barcode) => {
    try {
      const result = await lookupProduct(barcode);
      setProduct({ ...result, barcode });
    } catch (err) {
      console.error("Lookup failed:", err);
    }
  };

  // Add item to Firestore + local state
  const addToInventory = async () => {
    if (!product || !expiry) return;

    const newItem = {
      name: product.name,
      brand: product.brand,
      barcode: product.barcode,
      expiry,
      createdAt: new Date().toISOString()
    };

    try {
      await addItem(newItem);

      // update UI immediately
      setInventory((prev) => [...prev, newItem]);

      setProduct(null);
      setExpiry("");
    } catch (err) {
      console.error("Failed to add item:", err);
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

          <br /><br />

          <button onClick={addToInventory}>
            Add to Inventory
          </button>
        </div>
      )}

      <hr />

      <h2>Inventory</h2>

      {inventory.length === 0 && <p>No items yet.</p>}

      {inventory.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <h3>{item.name}</h3>
          <p>{item.brand}</p>
          <p>Expires: {item.expiry}</p>
        </div>
      ))}
    </div>
  );
}

export default App;