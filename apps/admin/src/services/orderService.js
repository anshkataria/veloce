import api from "./api";

export const orderService = {
  getAll: () => api.get("/orders"),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};
