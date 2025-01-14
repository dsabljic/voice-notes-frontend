import axios from "axios";

const API_URL = "http://localhost:3000";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getPlans = async () => {
  const response = await axios.get(`${API_URL}/plans`, getAuthHeader());
  return response.data.plans;
};

export const createCheckoutSession = async (planType) => {
  const response = await axios.post(
    `${API_URL}/payment/create-checkout-session`,
    { planType },
    getAuthHeader()
  );
  return response.data;
};

export const createBillingPortalSession = async () => {
  const response = await axios.post(
    `${API_URL}/payment/billing-portal`,
    {},
    getAuthHeader()
  );
  return response.data;
};
