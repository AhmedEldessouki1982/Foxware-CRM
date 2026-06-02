// Contacts API
import { useAuthStore } from "@/hooks/useAuthStore";
import type { Contact } from "@/interfaces/Contact";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const apiContacts = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
apiContacts.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // Access the token directly from the auth store
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// CRUD operations for contacts
export const getContacts = async (): Promise<Contact[]> => {
  const response = await apiContacts.get(`${API_BASE_URL}/contacts`);
  return response.data;
};

// Get a single contact by ID
export const createContact = async (
  contact: Omit<
    Contact,
    "id" | "status" | "createdAt" | "updatedAt" | "deletedAt"
  >,
): Promise<Contact> => {
  const response = await apiContacts.post(`${API_BASE_URL}/contacts`, contact);
  return response.data;
};

// Update an existing contact by ID
export const updateContact = async (
  id: string,
  contact: Omit<Contact, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<Contact> => {
  const response = await apiContacts.patch(
    `${API_BASE_URL}/contacts/${id}`,
    contact,
  );
  return response.data;
};

// Delete a contact by ID
export const deleteContact = async (id: string): Promise<void> => {
  await apiContacts.delete(`${API_BASE_URL}/contacts/${id}`);
};

export const contactsApi = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
