import axios from "axios";
import { useAuthStore } from "@/hooks/useAuthStore";

const API_BASE_URL = "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // Access the token directly from the auth store
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

//Register a new user
const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const response = await apiClient.post("/auth/register", {
    email,
    password,
    firstName,
    lastName,
  });
  return response.data;
};

//Login an existing user
const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

const authClientApi = {
  register,
  login,
};

export default authClientApi;
