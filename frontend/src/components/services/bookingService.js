import api from "./api";

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);
  return response.data;
};

export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

export const getBookingsByEvent = async (eventId) => {
  const response = await api.get(`/bookings/event/${eventId}`);
  return response.data;
};

export const verifyQR = async (qrCodeId) => {
  const response = await api.post("/bookings/verify-qr", { qrCodeId });
  return response.data;
};

export const deleteBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};
