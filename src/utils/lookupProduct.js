export async function lookupProduct(barcode) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    const data = await response.json();

    if (data.status === 1) {
      return {
        name: data.product.product_name || "Unknown Product",
        brand: data.product.brands || "",
        image: data.product.image_front_url || "",
      };
    } else {
      return {
        name: "Product not found",
        brand: "",
        image: "",
      };
    }
  } catch (error) {
    console.error("Lookup failed:", error);
    return {
      name: "Error loading product",
      brand: "",
      image: "",
    };
  }
}