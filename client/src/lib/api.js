// API base URL
const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ── SEATS ────────────────────────────────────────────────
export const seatsApi = {
  getAll: () => request("/seats"),
  getById: (id) => request(`/seats/${id}`),
  create: (data) => request("/seats", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/seats/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/seats/${id}`, { method: "DELETE" }),
  getByType: (type) => request(`/seats/type/${type}`),
};

// ── SCREENS ──────────────────────────────────────────────
export const screensApi = {
  getAll: () => request("/screens"),
  getById: (id) => request(`/screens/${id}`),
  create: (data) => request("/screens", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/screens/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/screens/${id}`, { method: "DELETE" }),
  getSeats: (id) => request(`/screens/${id}/seats`),
  getShows: (id) => request(`/screens/${id}/shows`),
  assignSeat: (screenNo, seatId) => request(`/screens/${screenNo}/seats/${seatId}`, { method: "POST" }),
  removeSeat: (screenNo, seatId) => request(`/screens/${screenNo}/seats/${seatId}`, { method: "DELETE" }),
};

// ── SHOWS ────────────────────────────────────────────────
export const showsApi = {
  getAll: () => request("/shows"),
  getById: (id) => request(`/shows/${id}`),
  create: (data) => request("/shows", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/shows/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/shows/${id}`, { method: "DELETE" }),
  getMovies: () => request("/shows/type/movies"),
  getDocumentaries: () => request("/shows/type/documentaries"),
  getLive: () => request("/shows/type/live"),
  getScreens: (id) => request(`/shows/${id}/screens`),
  assignScreen: (showId, screenNo) => request(`/shows/${showId}/screens/${screenNo}`, { method: "POST" }),
  removeScreen: (showId, screenNo) => request(`/shows/${showId}/screens/${screenNo}`, { method: "DELETE" }),
};

// ── CUSTOMERS ────────────────────────────────────────────
export const customersApi = {
  getAll: () => request("/customers"),
  getById: (id) => request(`/customers/${id}`),
  create: (data) => request("/customers", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/customers/${id}`, { method: "DELETE" }),
  getBookings: (id) => request(`/customers/${id}/bookings`),
  getReviews: (id) => request(`/customers/${id}/reviews`),
  getShows: (id) => request(`/customers/${id}/shows`),
};

// ── BOOKINGS ──────────────────────────────────────────────
export const bookingsApi = {
  getAll: () => request("/bookings"),
  getById: (id) => request(`/bookings/${id}`),
  create: (data) => request("/bookings", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/bookings/${id}`, { method: "DELETE" }),
  getByStatus: (status) => request(`/bookings/status/${status}`),
};

// ── REVIEWS ──────────────────────────────────────────────
export const reviewsApi = {
  getAll: () => request("/reviews"),
  getById: (id) => request(`/reviews/${id}`),
  create: (data) => request("/reviews", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/reviews/${id}`, { method: "DELETE" }),
  getStats: () => request("/reviews/stats/average"),
};
