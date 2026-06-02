export interface ContactsResponseDto {
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  source: string | null;
  assignedToId: string | null;
  deletedAt: Date | null;
}
