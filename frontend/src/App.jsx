
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: description,
            price: Number(price),
            quantity: Number(quantity),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to add product");
      }

      setMessage("Product added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");

      await fetchProducts();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const totalProducts = products.length;

  const lowStock = products.filter(
    (product) => product.quantity <= 5
  ).length;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>StockFlow</h2>
        <p>Dashboard</p>
        <p>Products</p>
        <p>Categories</p>
        <p>Reports</p>
      </aside>

      <main className="main-content">
        <h1>Inventory Dashboard</h1>
        <p>Welcome to StockFlow!</p>

        <div className="cards">
          <div className="card">
            <h3>Total Products</h3>
            <h2>{totalProducts}</h2>
          </div>

          <div className="card">
            <h3>Low Stock</h3>
            <h2>{lowStock}</h2>
          </div>

          <div className="card">
            <h3>Inventory Value</h3>
            <h2>₹{inventoryValue.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <section className="products">
          <h2>Add New Product</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Quantity"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <button type="submit">Add Product</button>
          </form>

          {message && <p>{message}</p>}
        </section>

        <section className="products">
          <h2>Product List</h2>

          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}

          {!loading && products.map((product) => (
            <div className="product-item" key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ₹{product.price.toLocaleString("en-IN")}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
