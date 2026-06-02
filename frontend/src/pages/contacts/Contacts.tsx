import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Loader2,
  Phone,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  UserCircle,
  FileText,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContactsTable from "@/pages/features/table/ContactsTable";
import type { Contact } from "@/interfaces/Contact";
import { useContact } from "@/hooks/useContact";
import { contactsApi } from "@/api/contacts";

// Define status options
const STATUS_OPTIONS = ["NEW", "IN_PROGRESS", "CUSTOMER", "CLOSED"] as const;
type ContactStatus = (typeof STATUS_OPTIONS)[number];

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  status?: ContactStatus;
}

const EMPTY_FORM: ContactForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  status: "NEW",
};

function Contacts() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const { getContacts, createContact } = useContact();

  // Fetch contacts using React Query
  const { data: contacts = [], isPending } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      try {
        return await getContacts();
      } catch (err) {
        toast.error(
          `Failed to load contacts - ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        return [];
      }
    },
  });
  // Mutation for creating a contact
  const createMutation = useMutation({
    mutationFn: (payload: ContactForm) => createContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact created successfully");
      handleCloseDialog();
    },
    onError: (err) => {
      toast.error(
        ` Failed to create contact - ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ContactForm>;
    }) => contactsApi.updateContact(id, payload as Partial<Contact>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact updated successfully");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Failed to update contact");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactsApi.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingContact(null);
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingContact(null);
    setForm(EMPTY_FORM);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingContact(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      jobTitle: contact.jobTitle || "",
      status: (contact.status as ContactStatus) || "NEW",
      notes: contact.notes || "",
    });
    setDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((contact: Contact) => {
    setDeletingContact(contact);
    setDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingContact) {
        updateMutation.mutate({ id: editingContact.id, payload: form });
      } else {
        createMutation.mutate(form);
      }
    },
    [editingContact, form, createMutation, updateMutation],
  );

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0a1628 0%, #0f1f3a 50%, #0a1628 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Contacts
              </h1>
              <p className="text-blue-300 text-sm mt-0.5">
                Manage your CRM contacts and leads
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ContactsTable
            data={contacts}
            isPending={isPending}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </motion.div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-2xl"
          style={{
            background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-blue-400" />
              {editingContact ? "Edit Contact" : "New Contact"}
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              {editingContact
                ? "Update the contact details below."
                : "Fill in the details to add a new contact to your CRM."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="details" className="mt-4">
              <TabsList
                className="w-full justify-start gap-0 bg-transparent border-b border-white/10 rounded-none p-0 h-auto"
                style={{ background: "transparent" }}
              >
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 text-blue-300 data-[state=active]:text-white px-4 py-2.5"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-blue-400 text-blue-300 data-[state=active]:text-white px-4 py-2.5"
                >
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-blue-200 text-sm"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-200 text-sm">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-blue-200 text-sm flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-blue-200 text-sm flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="text-blue-200 text-sm flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="jobTitle"
                      className="text-blue-200 text-sm flex items-center gap-1.5"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      value={form.jobTitle || ""}
                      onChange={(e) =>
                        setForm({ ...form, jobTitle: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-blue-200 text-sm flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Status
                  </Label>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, status: s as ContactStatus })
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          form.status === s
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                            : "bg-white/5 text-blue-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-blue-200 text-sm flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={form.notes || ""}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={6}
                    className="w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400 focus-visible:outline-none focus-visible:ring-2 px-3 py-2 text-sm resize-none transition-all duration-200"
                    placeholder="Add any notes about this contact..."
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-8 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isMutating}
                className="border-white/20 text-blue-200 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isMutating}
                className="bg-blue-500 hover:bg-blue-400 text-white min-w-30"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingContact ? "Updating..." : "Creating..."}
                  </>
                ) : editingContact ? (
                  "Update Contact"
                ) : (
                  "Create Contact"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{
            background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Contact
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {deletingContact?.firstName} {deletingContact?.lastName}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletingContact(null);
              }}
              disabled={deleteMutation.isPending}
              className="border-white/20 text-blue-200 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deletingContact) {
                  deleteMutation.mutate(deletingContact.id);
                }
              }}
              className="bg-red-500 hover:bg-red-400 text-white min-w-30"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default Contacts;
