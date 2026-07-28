import api from "./api";

export const orderService = {
  create: (data) => api.post("/orders", data),
  createCheckoutSession: (id) => api.post(`/orders/${id}/checkout-session`),
  getMyOrders: () => api.get("/orders/my"),
};
