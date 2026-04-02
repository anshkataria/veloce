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

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
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
      const newProduct = {
        id: Date.now(),
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        inStock: Number(form.stock) > 0,
      };
      setProducts((ps) => [newProduct, ...ps]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-1">
            {products.length} total products
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
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
                    className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        product.inStock
                          ? "bg-green-50 text-green-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            {[
              { label: "Product Name", key: "name", type: "text" },
              { label: "Price (₹)", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field.key]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              >
                {["suits", "sets", "dupattas"].map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={15} />
                {editing ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Delete Product?
            </h2>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors"
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
