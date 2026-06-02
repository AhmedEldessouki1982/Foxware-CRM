// src/interfaces/Contact.ts

export type ContactStatus = "NEW" | "IN_PROGRESS" | "CUSTOMER" | "CLOSED";

export interface Contact {
  id: string;

  firstName: string;
  lastName: string;

  email: string | null;
  phone: string | null;

  company: string | null;

  jobTitle: string | null;

  status: ContactStatus;

  createdAt: string;
  updatedAt: string;

  deletedAt: string | null;
}
