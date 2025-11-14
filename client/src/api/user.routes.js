import { axiosNoAuth } from "../axios/axiosNoAuth";
import { axiosAuth } from "../axios/axiosAuth";

export const registerUser = async (userData) => {
  try {
    const response = await axiosNoAuth.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return error.response?.data;
  }
};

export const getProfile = async (id) => {
  try {
    const response = await axiosAuth.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return error.response?.data;
  }
};