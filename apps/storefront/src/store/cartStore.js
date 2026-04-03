import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, quantity = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product.id === product.id && i.size === size,
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id && i.size === size
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { product, size, quantity }] });
        }
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.product.id === productId && i.size === size),
          ),
        });
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId && i.size === size
              ? { ...i, quantity }
              : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);

export default useCartStore;
