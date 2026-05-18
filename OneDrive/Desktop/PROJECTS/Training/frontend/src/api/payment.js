import api from "./axios";


// =====================================================
// ✅ CREATE PAYMENT
// =====================================================

export const createPayment = async (
  payload
) => {

  const response =
    await api.post(
      "/payment/create",
      payload
    );

  return response;
};


// =====================================================
// ✅ COMPLETE PAYMENT
// =====================================================

export const pay = async (
  payload
) => {

  const response =
    await api.post(
      "/payment/pay",
      payload
    );

  return response;
};


// =====================================================
// ✅ REFUND PAYMENT
// =====================================================

export const refund = async (
  paymentId
) => {

  const response =
    await api.post(
      `/payment/refund/${paymentId}`
    );

  return response;
};