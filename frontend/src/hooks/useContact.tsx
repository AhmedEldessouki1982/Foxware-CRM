// src/hooks/useContact.tsx
import type { Contact } from "@/interfaces/Contact";

import { useAuth } from "./useAuth";
import { contactsApi } from "@/api/contacts";

export const useContact = () => {
  const { token } = useAuth();

  const isAuthenticated = !!token;

  // Create a new contact
  const createContact = async (
    contact: Omit<
      Contact,
      "id" | "status" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ): Promise<Contact> => {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    return contactsApi.createContact(contact);
  };

  // Get all contacts
  const getContacts = async (): Promise<Contact[]> => {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    return contactsApi.getContacts();
  };

  //Delete a contact
  const deleteContact = async (id: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    return contactsApi.deleteContact(id);
  };

  //Update a contact
  const updateContact = async (
    id: string,
    contact: Contact,
  ): Promise<Contact> => {
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }

    return contactsApi.updateContact(id, contact);
  };

  return {
    createContact,
    getContacts,
    deleteContact,
    updateContact,
  };
};
