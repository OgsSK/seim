import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = {
  speakers: () => axios.get(`${API}/speakers`).then((r) => r.data),
  program: () => axios.get(`${API}/program`).then((r) => r.data),
  exhibitors: () => axios.get(`${API}/exhibitors`).then((r) => r.data),
  partners: () => axios.get(`${API}/partners`).then((r) => r.data),
  articles: () => axios.get(`${API}/articles`).then((r) => r.data),
  editions: () => axios.get(`${API}/editions`).then((r) => r.data),
  gallery: () => axios.get(`${API}/gallery`).then((r) => r.data),
  register: (data) => axios.post(`${API}/registrations`, data).then((r) => r.data),
  registration: (code) => axios.get(`${API}/registrations/${code}`).then((r) => r.data),
  contact: (data) => axios.post(`${API}/contacts`, data).then((r) => r.data),
};
