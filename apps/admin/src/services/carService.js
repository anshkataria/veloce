import api from "./api";

export const carService = {
  getAll: (params) => api.get("/cars", { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post("/cars", data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};
