import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carService } from "../services/carService";

const CATEGORIES = ["SUPERCARS", "SPORTSCARS", "LUXURY"];
const emptyForm = {
  name: "",
  brand: "",
  category: "SUPERCARS",
  price: "",
  originalPrice: "",
  stock: "",
  variants: "",
  imageUrl: "",
  isNew: false,
};

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
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-cars"],
    queryFn: () => carService.getAll({ size: 100 }).then((r) => r.data.content),
  });

  const cars = data ?? [];

  const createMutation = useMutation({
    mutationFn: (data) => carService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
      setShowModal(false);
    },
    onError: (err) =>
      setFormError(err.response?.data?.error || "Failed to create car"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => carService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
      setShowModal(false);
    },
    onError: (err) =>
      setFormError(err.response?.data?.error || "Failed to update car"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => carService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-cars"]);
      setDeleteId(null);
    },
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (car) => {
    setEditing(car.id);
    setForm({
      name: car.name,
      brand: car.brand,
      category: car.category,
      price: car.price,
      originalPrice: car.originalPrice ?? "",
      stock: car.stock,
      variants: car.variants ?? "",
      imageUrl: car.imageUrl ?? "",
      isNew: car.isNew ?? false,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.brand || !form.price) {
      setFormError("Name, brand and price are required");
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock) || 0,
    };
    if (editing) updateMutation.mutate({ id: editing, data: payload });
    else createMutation.mutate(payload);
  };

  const STATUS = (inStock) =>
    inStock
      ? { color: "var(--success)", bg: "var(--success-bg)", label: "In Stock" }
      : {
          color: "var(--danger)",
          bg: "var(--danger-bg)",
          label: "Out of Stock",
        };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
            {cars.length} total vehicles
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
          <Plus size={14} /> Add Car
        </button>
      </div>

      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          Loading...
        </div>
      )}

      {isError && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "var(--danger)",
            fontSize: "13px",
          }}
        >
          Failed to load cars. Is the backend running?
        </div>
      )}

      {!isLoading && !isError && (
        <div style={card}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {[
                    "Name",
                    "Brand",
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
                {cars.map((car, i) => {
                  const s = STATUS(car.inStock);
                  return (
                    <tr
                      key={car.id}
                      style={{
                        borderBottom:
                          i < cars.length - 1
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
                          maxWidth: "180px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {car.name}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {car.brand}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {car.category?.toLowerCase()}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        ₹{Number(car.price).toLocaleString("en-IN")}
                      </td>
                      <td
                        style={{
                          padding: "13px 20px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {car.stock}
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
                            onClick={() => openEdit(car)}
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
                            onClick={() => setDeleteId(car.id)}
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
      )}

      {/* Add / Edit Modal */}
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
              maxWidth: "520px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxHeight: "90vh",
              overflowY: "auto",
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
                {editing ? "Edit Car" : "Add Car"}
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

            {formError && (
              <div
                style={{
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  fontSize: "13px",
                  padding: "10px 14px",
                  borderRadius: "9px",
                }}
              >
                {formError}
              </div>
            )}

            {/* Two column grid for fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                { label: "Car Name", key: "name", type: "text", col: 2 },
                { label: "Brand", key: "brand", type: "text", col: 1 },
                { label: "Price (₹)", key: "price", type: "number", col: 1 },
                {
                  label: "Original Price",
                  key: "originalPrice",
                  type: "number",
                  col: 1,
                },
                { label: "Stock", key: "stock", type: "number", col: 1 },
                {
                  label: "Variants (comma separated)",
                  key: "variants",
                  type: "text",
                  col: 2,
                },
                { label: "Image URL", key: "imageUrl", type: "text", col: 2 },
              ].map((f) => (
                <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "5px",
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Category dropdown */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "5px",
                  }}
                >
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is New toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "20px",
                }}
              >
                <input
                  type="checkbox"
                  id="isNew"
                  checked={form.isNew}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isNew: e.target.checked }))
                  }
                  style={{ width: "14px", height: "14px", cursor: "pointer" }}
                />
                <label
                  htmlFor="isNew"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Mark as New
                </label>
              </div>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

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
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "9px",
                  border: "none",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "var(--font-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving ? (
                  <RefreshCw
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Check size={14} />
                )}
                {editing ? "Save Changes" : "Add Car"}
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
              Delete car?
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
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
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
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
