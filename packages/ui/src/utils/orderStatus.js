export const ORDER_STATUS_META = {
  PROCESSING: { label: "PROCESSING", color: "var(--warning)", bg: "var(--warning-bg)" },
  CONFIRMED: { label: "CONFIRMED", color: "var(--info)", bg: "var(--info-bg)" },
  SHIPPED: { label: "SHIPPED", color: "var(--info)", bg: "var(--info-bg)" },
  DELIVERED: { label: "DELIVERED", color: "var(--success)", bg: "var(--success-bg)" },
  CANCELLED: { label: "CANCELLED", color: "var(--danger)", bg: "var(--danger-bg)" },
};

export const STOCK_STATUS_META = {
  IN_STOCK: { label: "IN STOCK", color: "var(--success)", bg: "var(--success-bg)" },
  OUT_OF_STOCK: { label: "OUT OF STOCK", color: "var(--danger)", bg: "var(--danger-bg)" },
};

export function stockStatusMeta(inStock) {
  return inStock ? STOCK_STATUS_META.IN_STOCK : STOCK_STATUS_META.OUT_OF_STOCK;
}
