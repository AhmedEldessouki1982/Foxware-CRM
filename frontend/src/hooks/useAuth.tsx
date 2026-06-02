// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import authClientApi from "@/api/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const { token, user, setAuth, logout: clearAuth } = useAuthStore();

  // Determine if the user is authenticated based on the presence of a token
  const isAuthenticated = !!token;

  // Login function that calls the API and updates the auth store
  const login = async (email: string, password: string) => {
    const response = await authClientApi.login(email, password);
    setAuth(response.accessToken, {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
    navigate("/");
  };

  // Register function that calls the API and updates the auth store
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const response = await authClientApi.register(
      email,
      password,
      firstName,
      lastName,
    );
    setAuth(response.accessToken, {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
    });
    navigate("/");
  };

  // Logout function that clears the auth store and redirects to login page
  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return { token, user, isAuthenticated, login, register, logout };
};
