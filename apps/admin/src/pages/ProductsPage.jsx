import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carService } from "../services/carService";
import { formatPrice, StatusBadge, Pagination, stockStatusMeta } from "@veloce/ui";

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

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-cars", page],
    queryFn: () => carService.getAll({ page, size: PAGE_SIZE }).then((r) => r.data),
  });

  const cars = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const invalidateCars = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-cars"] });

  const createMutation = useMutation({
    mutationFn: (data) => carService.create(data),
    onSuccess: () => {
      invalidateCars();
      setShowModal(false);
    },
    onError: (err) =>
      setFormError(err.response?.data?.error || "Failed to create car"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => carService.update(id, data),
    onSuccess: () => {
      invalidateCars();
      setShowModal(false);
    },
    onError: (err) =>
      setFormError(err.response?.data?.error || "Failed to update car"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => carService.delete(id),
    onSuccess: () => {
      invalidateCars();
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

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[var(--ink-muted)] uppercase">
            Private Inventory
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-wide text-[var(--ink)]">
            Products
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            {totalElements} total vehicles in the collection.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="luxury-btn flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-wide"
        >
          <Plus size={16} /> Add Car
        </button>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-sm text-[var(--ink-muted)]">
          Loading inventory...
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-sm text-[var(--danger)]">
          Failed to load inventory. Is the backend running?
        </div>
      )}

      {!isLoading && !isError && (
        <div className="soft-card overflow-hidden bg-[var(--surface)] border-[var(--veloce-border)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--veloce-line)] bg-[var(--stone)]/20">
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
                      className="px-8 py-4 text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.map((car, i) => {
                  const s = stockStatusMeta(car.inStock);
                  return (
                    <tr
                      key={car.id}
                      className={`transition-colors hover:bg-[var(--stone)]/30 ${
                        i < cars.length - 1
                          ? "border-b border-[var(--veloce-line)]"
                          : ""
                      }`}
                    >
                      <td className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap px-8 py-5 text-sm font-semibold tracking-wide text-[var(--ink)]">
                        {car.name}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[var(--ink-muted)]">
                        {car.brand}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium tracking-wide uppercase text-[var(--ink-muted)]">
                        {car.category}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold tracking-wide text-[var(--ink)]">
                        {formatPrice(car.price)}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[var(--ink-muted)]">
                        {car.stock}
                      </td>
                      <td className="px-8 py-5">
                        <StatusBadge meta={s} />
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(car)}
                            aria-label={`Edit ${car.name}`}
                            className="rounded-lg p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--stone)] hover:text-[var(--ink)]"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(car.id)}
                            aria-label={`Delete ${car.name}`}
                            className="rounded-lg p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[var(--veloce-line)]">
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col gap-6 overflow-y-auto rounded-2xl border border-[var(--veloce-border)] bg-[var(--surface)] p-8 shadow-[var(--veloce-shadow)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-[var(--ink)]">
                {editing ? "Edit Car" : "Add Car"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--stone)] hover:text-[var(--ink)]"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl bg-[var(--danger-bg)] px-4 py-3 text-sm font-medium text-[var(--danger)]">
                {formError}
              </div>
            )}

            {/* Two column grid for fields */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Car Name", key: "name", type: "text", col: 2 },
                { label: "Brand", key: "brand", type: "text", col: 1 },
                { label: "Price (USD)", key: "price", type: "number", col: 1 },
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
                <div
                  key={f.key}
                  className={f.col === 2 ? "col-span-2" : "col-span-1"}
                >
                  <label htmlFor={f.key} className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-[var(--veloce-border)] bg-[var(--stone)]/20 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none transition-colors focus:border-[var(--oxblood)]"
                  />
                </div>
              ))}

              {/* Category dropdown */}
              <div className="col-span-1">
                <label htmlFor="category" className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--ink-muted)] uppercase">
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[var(--veloce-border)] bg-[var(--stone)]/20 px-4 py-3 text-sm font-medium text-[var(--ink)] outline-none transition-colors focus:border-[var(--oxblood)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Is New toggle */}
              <div className="col-span-1 flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={form.isNew}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isNew: e.target.checked }))
                  }
                  className="h-5 w-5 cursor-pointer accent-[var(--oxblood)]"
                />
                <label
                  htmlFor="isNew"
                  className="cursor-pointer text-sm font-semibold tracking-wide text-[var(--ink-muted)]"
                >
                  MARK AS NEW
                </label>
              </div>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="h-44 w-full rounded-xl border border-[var(--veloce-border)] object-cover shadow-sm"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-[var(--veloce-border)] bg-[var(--surface)] py-3.5 text-sm font-semibold tracking-wide text-[var(--ink-muted)] transition-colors hover:bg-[var(--stone)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="luxury-btn flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold tracking-wide disabled:opacity-70"
              >
                {isSaving ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {editing ? "Save Changes" : "Add Car"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/40 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-[400px] flex-col gap-4 rounded-2xl border border-[var(--veloce-border)] bg-[var(--surface)] p-8 shadow-[var(--veloce-shadow)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Delete car?
            </h2>
            <p className="text-sm text-[var(--ink-muted)]">
              This action cannot be undone. Are you sure you want to remove this vehicle from the collection?
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-[var(--veloce-border)] py-3 text-sm font-semibold tracking-wide text-[var(--ink-muted)] transition-colors hover:bg-[var(--stone)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-xl bg-[var(--danger)] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[var(--danger)]/80 disabled:opacity-70"
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
