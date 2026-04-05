import api from "./api";

export const carService = {
  getAll: (params) => api.get("/cars", { params }),
  getById: (id) => api.get(`/cars/${id}`),
  getRelated: (id) => api.get(`/cars/${id}/related`),
};
