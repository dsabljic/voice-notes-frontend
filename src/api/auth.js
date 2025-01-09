import axios from "axios";

const API_URL = "http://localhost:3000";

export const signup = async (data) => {
  const response = await axios.put(`${API_URL}/auth/signup`, data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
