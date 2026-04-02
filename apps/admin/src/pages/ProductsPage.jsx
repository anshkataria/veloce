import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Ivory Chanderi Suit",
    category: "suits",
    price: 3499,
    stock: 12,
    inStock: true,
  },
  {
    id: 2,
    name: "Rose Silk Kurta Set",
    category: "sets",
    price: 5299,
    stock: 8,
    inStock: true,
  },
  {
    id: 3,
    name: "Sage Green Anarkali",
    category: "suits",
    price: 4799,
    stock: 5,
    inStock: true,
  },
  {
    id: 4,
    name: "Midnight Blue Sharara",
    category: "sets",
    price: 6299,
    stock: 0,
    inStock: false,
  },
  {
    id: 5,
    name: "Blush Pink Dupatta",
    category: "dupattas",
    price: 1299,
    stock: 20,
    inStock: true,
  },
  {
    id: 6,
    name: "Terracotta Cotton Set",
    category: "sets",
    price: 2999,
    stock: 7,
    inStock: true,
  },
];

const emptyForm = { name: "", category: "suits", price: "", stock: "" };

const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  overflow: "hidden",
};

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontSize: "13px",
  outline: "none",
  fontFamily: "var(--font-main)",
};

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      setProducts((ps) =>
        ps.map((p) =>
          p.id === editing
            ? {
                ...p,
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                inStock: Number(form.stock) > 0,
              }
            : p,
        ),
      );
    } else {
      setProducts((ps) => [
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          inStock: Number(form.stock) > 0,
        },
        ...ps,
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const STATUS = (inStock) =>
    inStock
      ? { color: "var(--success)", bg: "var(--success-bg)", label: "In Stock" }
      : {
          color: "var(--danger)",
          bg: "var(--danger-bg)",
          label: "Out of Stock",
        };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Products
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginTop: "2px",
            }}
          >
            {products.length} total products
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 16px",
            borderRadius: "9px",
            background: "var(--accent)",
            color: "var(--accent-fg)",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-main)",
          }}
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Name",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const s = STATUS(p.inStock);
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom:
                        i < products.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    <td
                      style={{
                        padding: "13px 20px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {p.name}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        textTransform: "capitalize",
                      }}
                    >
                      {p.category}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </td>
                    <td
                      style={{
                        padding: "13px 20px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {p.stock}
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          color: s.color,
                          background: s.bg,
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          onClick={() => openEdit(p)}
                          style={{
                            padding: "5px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          style={{
                            padding: "5px",
                            borderRadius: "6px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {[
              { label: "Product Name", key: "name", type: "text" },
              { label: "Price (₹)", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "6px",
                  }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
            ))}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                style={inputStyle}
              >
                {["suits", "sets", "dupattas"].map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "var(--font-main)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Check size={14} /> {editing ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "360px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Delete product?
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "var(--font-main)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-main)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
