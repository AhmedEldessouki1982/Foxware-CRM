// src/pages/features/table/Table.tsx
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Contact, ContactStatus } from "@/interfaces/Contact";

type Props = {
  data: Contact[];
  isPending?: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
};

// Define status colors for badges
const STATUS_COLORS: Record<ContactStatus, string> = {
  NEW: "bg-blue-500/20 text-blue-200 border border-blue-500/30",
  IN_PROGRESS: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
  CUSTOMER: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
  CLOSED: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
};

const STATUS_CYCLE: (ContactStatus | null)[] = [
  null,
  "NEW",
  "IN_PROGRESS",
  "CUSTOMER",
  "CLOSED",
];

const PAGE_SIZE = 10;

export default function ContactsTable({
  data,
  isPending = false,
  currentPage,
  setCurrentPage,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContactStatus | null>(null);
  const [filterIndex, setFilterIndex] = useState(0);

  const currentPageNum = parseInt(currentPage, 10) || 1;

  const cycleFilter = () => {
    const next = (filterIndex + 1) % STATUS_CYCLE.length;
    setFilterIndex(next);
    setFilterStatus(STATUS_CYCLE[next]);
  };

  const filtered = data.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.jobTitle?.toLowerCase().includes(q);
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginated = filtered.slice(
    (currentPageNum - 1) * PAGE_SIZE,
    currentPageNum * PAGE_SIZE,
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="w-full p-4">
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Contacts
              </h2>
              <p className="text-blue-300 text-sm mt-0.5">
                {filtered.length} of {data.length} contacts
                {filterStatus && (
                  <span className="ml-2 text-amber-300">
                    · filtered by {filterStatus}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest py-4 pl-8">
                Name
              </TableHead>
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                Email
              </TableHead>
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                Company
              </TableHead>
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                Job Title
              </TableHead>
              <TableHead
                className="text-blue-300 font-semibold uppercase text-xs tracking-widest cursor-pointer select-none"
                onClick={cycleFilter}
              >
                <span className="flex items-center gap-2">
                  <FilterIcon className="w-3 h-3" />
                  Status {filterStatus ? `(${filterStatus})` : "(All)"}
                </span>
              </TableHead>
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                Last Contacted
              </TableHead>
              <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest pr-8 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-blue-300"
                >
                  Loading contacts...
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-blue-300"
                >
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((contact) => (
                <TableRow
                  key={contact.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  className="transition-all duration-150 hover:bg-white/5 group"
                >
                  {/* Name + avatar */}
                  <TableCell className="py-4 pl-8">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        }}
                      >
                        {contact.firstName[0]}
                        {contact.lastName[0]}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {contact.firstName} {contact.lastName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-blue-200 text-sm">
                    {contact.email}
                  </TableCell>

                  <TableCell className="text-blue-200 text-sm">
                    {contact.company}
                  </TableCell>

                  <TableCell className="text-blue-200 text-sm">
                    {contact.jobTitle}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[contact.status]}`}
                    >
                      {contact.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-blue-300 text-sm">
                    {new Date(contact.lastContacted).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-8">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-all"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(contact)}
                        className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-all"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(contact)}
                        className="p-1.5 rounded-lg text-blue-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <SearchIcon size={16} className="text-blue-400 shrink-0" />
          <Input
            type="search"
            placeholder="Search by name, email, company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage("1");
            }}
            className="bg-transparent border-none shadow-none focus-visible:ring-0 text-blue-100 placeholder:text-blue-400/50 text-sm"
          />
          <span className="text-blue-400 text-xs shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Pagination */}
      <div className="pt-4 flex items-center justify-center gap-4">
        <Button
          disabled={currentPageNum <= 1 || isPending}
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(String(currentPageNum - 1))}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>

        <span className="text-blue-200 text-sm">
          Page {currentPageNum} of {totalPages || 1}
        </span>

        <Button
          disabled={currentPageNum >= totalPages || isPending}
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(String(currentPageNum + 1))}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
