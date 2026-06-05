import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  XCircle,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  User,
  Calendar,
  ChevronDown,
  ArrowUpDown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DealStage =
  | "LEAD"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

interface Deal {
  id: string;
  name: string;
  contact: string;
  company: string;
  value: number;
  stage: DealStage;
  expectedCloseDate: string;
  createdAt: string;
}

interface DealForm {
  name: string;
  value: string;
  contact: string;
  company: string;
  stage: DealStage;
  expectedCloseDate: string;
}

const STAGES: DealStage[] = [
  "LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const STAGE_COLORS: Record<DealStage, string> = {
  LEAD: "bg-blue-500/20 text-blue-200 border border-blue-500/30",
  QUALIFIED: "bg-purple-500/20 text-purple-200 border border-purple-500/30",
  PROPOSAL: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
  NEGOTIATION: "bg-orange-500/20 text-orange-200 border border-orange-500/30",
  WON: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
  LOST: "bg-red-500/20 text-red-200 border border-red-500/30",
};

const EMPTY_FORM: DealForm = {
  name: "",
  value: "",
  contact: "",
  company: "",
  stage: "LEAD",
  expectedCloseDate: "",
};

const PAGE_SIZE = 8;

const mockDeals: Deal[] = [
  {
    id: "1",
    name: "Enterprise CRM License",
    contact: "Sarah Chen",
    company: "Acme Corp",
    value: 120000,
    stage: "NEGOTIATION",
    expectedCloseDate: "2026-07-15",
    createdAt: "2026-05-01",
  },
  {
    id: "2",
    name: "Cloud Migration Package",
    contact: "James Wilson",
    company: "TechStart Inc",
    value: 85000,
    stage: "PROPOSAL",
    expectedCloseDate: "2026-08-01",
    createdAt: "2026-05-10",
  },
  {
    id: "3",
    name: "AI Analytics Platform",
    contact: "Maria Garcia",
    company: "DataFlow Systems",
    value: 200000,
    stage: "QUALIFIED",
    expectedCloseDate: "2026-09-01",
    createdAt: "2026-04-20",
  },
  {
    id: "4",
    name: "Security Audit Suite",
    contact: "Alex Turner",
    company: "SafeNet Ltd",
    value: 45000,
    stage: "LEAD",
    expectedCloseDate: "2026-06-30",
    createdAt: "2026-05-25",
  },
  {
    id: "5",
    name: "Managed IT Services",
    contact: "Emily Davis",
    company: "GlobalTech Corp",
    value: 150000,
    stage: "WON",
    expectedCloseDate: "2026-06-01",
    createdAt: "2026-03-15",
  },
  {
    id: "6",
    name: "DevOps Toolchain",
    contact: "Michael Brown",
    company: "CloudNine Inc",
    value: 95000,
    stage: "NEGOTIATION",
    expectedCloseDate: "2026-07-30",
    createdAt: "2026-05-05",
  },
  {
    id: "7",
    name: "Data Center Upgrade",
    contact: "Lisa Anderson",
    company: "MegaStore Inc",
    value: 250000,
    stage: "QUALIFIED",
    expectedCloseDate: "2026-10-01",
    createdAt: "2026-04-10",
  },
  {
    id: "8",
    name: "SaaS Integration Hub",
    contact: "David Lee",
    company: "ConnectAll Corp",
    value: 75000,
    stage: "PROPOSAL",
    expectedCloseDate: "2026-08-15",
    createdAt: "2026-05-18",
  },
  {
    id: "9",
    name: "Compliance Package",
    contact: "Rachel Kim",
    company: "RegGuard LLC",
    value: 60000,
    stage: "LOST",
    expectedCloseDate: "2026-05-01",
    createdAt: "2026-02-20",
  },
  {
    id: "10",
    name: "Mobile App Suite",
    contact: "Tom Harris",
    company: "AppVentures Co",
    value: 110000,
    stage: "WON",
    expectedCloseDate: "2026-06-15",
    createdAt: "2026-03-25",
  },
  {
    id: "11",
    name: "Custom ERP Solution",
    contact: "Anna Kowalski",
    company: "ManuPro Ltd",
    value: 180000,
    stage: "LEAD",
    expectedCloseDate: "2026-11-01",
    createdAt: "2026-05-28",
  },
  {
    id: "12",
    name: "Network Infrastructure",
    contact: "Chris Evans",
    company: "NetConnect Inc",
    value: 90000,
    stage: "PROPOSAL",
    expectedCloseDate: "2026-09-15",
    createdAt: "2026-05-12",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

function KpiCard({
  title,
  value,
  icon: Icon,
  delay,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 cursor-default"
      style={{
        background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))",
          border: "1px solid rgba(59,130,246,0.3)",
        }}
      >
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="min-w-0">
        <p className="text-blue-300 text-xs font-medium uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-white text-xl font-bold mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

function Deals() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState("1");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState<DealForm>(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<DealStage | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const { data: deals = [], isPending } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return mockDeals;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: DealForm) => {
      await new Promise((r) => setTimeout(r, 300));
      const newDeal: Deal = {
        id: String(Date.now()),
        name: payload.name,
        contact: payload.contact,
        company: payload.company,
        value: Number(payload.value),
        stage: payload.stage,
        expectedCloseDate: payload.expectedCloseDate,
        createdAt: new Date().toISOString().split("T")[0],
      };
      mockDeals.push(newDeal);
      return newDeal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal created successfully");
      handleCloseDialog();
    },
    onError: (err) => {
      toast.error(
        `Failed to create deal - ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: DealForm }) => {
      await new Promise((r) => setTimeout(r, 300));
      const idx = mockDeals.findIndex((d) => d.id === id);
      if (idx !== -1) {
        mockDeals[idx] = {
          ...mockDeals[idx],
          name: payload.name,
          contact: payload.contact,
          company: payload.company,
          value: Number(payload.value),
          stage: payload.stage,
          expectedCloseDate: payload.expectedCloseDate,
        };
      }
      return mockDeals[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal updated successfully");
      handleCloseDialog();
    },
    onError: (err) => {
      toast.error(
        `Failed to update deal - ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      const idx = mockDeals.findIndex((d) => d.id === id);
      if (idx !== -1) mockDeals.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingDeal(null);
    },
    onError: (err) => {
      toast.error(
        `Failed to delete deal - ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingDeal(null);
    setForm(EMPTY_FORM);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingDeal(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      name: deal.name,
      value: String(deal.value),
      contact: deal.contact,
      company: deal.company,
      stage: deal.stage,
      expectedCloseDate: deal.expectedCloseDate,
    });
    setDialogOpen(true);
  }, []);

  const handleOpenDelete = useCallback((deal: Deal) => {
    setDeletingDeal(deal);
    setDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingDeal) {
        updateMutation.mutate({ id: editingDeal.id, payload: form });
      } else {
        createMutation.mutate(form);
      }
    },
    [editingDeal, form, createMutation, updateMutation],
  );

  const isMutating = createMutation.isPending || updateMutation.isPending;

  const kpiData = useMemo(() => {
    const totalPipeline = deals.reduce((sum, d) => sum + d.value, 0);
    const openDeals = deals.filter(
      (d) => d.stage !== "WON" && d.stage !== "LOST",
    ).length;
    const wonDeals = deals.filter((d) => d.stage === "WON").length;
    const lostDeals = deals.filter((d) => d.stage === "LOST").length;
    return {
      totalPipeline: formatCurrency(totalPipeline),
      openDeals: String(openDeals),
      wonDeals: String(wonDeals),
      lostDeals: String(lostDeals),
    };
  }, [deals]);

  const currentPageNum = parseInt(currentPage, 10) || 1;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return deals
      .filter((d) => {
        const matchesSearch =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.contact.toLowerCase().includes(q) ||
          d.company.toLowerCase().includes(q);
        const matchesStage = !stageFilter || d.stage === stageFilter;
        return matchesSearch && matchesStage;
      })
      .sort((a, b) => (sortAsc ? a.value - b.value : b.value - a.value));
  }, [deals, searchQuery, stageFilter, sortAsc]);

  const paginated = filtered.slice(
    (currentPageNum - 1) * PAGE_SIZE,
    currentPageNum * PAGE_SIZE,
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const stageFilterOptions: (DealStage | null)[] = [null, ...STAGES];

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
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Deals
              </h1>
              <p className="text-blue-300 text-sm mt-0.5">
                Manage sales opportunities and pipeline
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            title="Total Pipeline Value"
            value={kpiData.totalPipeline}
            icon={DollarSign}
            delay={0.08}
          />
          <KpiCard
            title="Open Deals"
            value={kpiData.openDeals}
            icon={TrendingUp}
            delay={0.12}
          />
          <KpiCard
            title="Won Deals"
            value={kpiData.wonDeals}
            icon={Award}
            delay={0.16}
          />
          <KpiCard
            title="Lost Deals"
            value={kpiData.lostDeals}
            icon={XCircle}
            delay={0.2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="px-8 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">
                    All Deals
                  </h2>
                  <p className="text-blue-300 text-sm mt-0.5">
                    {filtered.length} of {deals.length} deals
                    {stageFilter && (
                      <span className="ml-2 text-amber-300">
                        · filtered by {stageFilter}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest py-4 pl-8">
                    Deal Name
                  </TableHead>
                  <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                    Contact
                  </TableHead>
                  <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                    Company
                  </TableHead>
                  <TableHead
                    className="text-blue-300 font-semibold uppercase text-xs tracking-widest cursor-pointer select-none"
                    onClick={() => setSortAsc(!sortAsc)}
                  >
                    <span className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3 h-3" />
                      Value {sortAsc ? "(low)" : "(high)"}
                    </span>
                  </TableHead>
                  <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                    <span
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                      onClick={() => {
                        const currentIdx =
                          stageFilterOptions.indexOf(stageFilter);
                        const nextIdx =
                          (currentIdx + 1) % stageFilterOptions.length;
                        setStageFilter(stageFilterOptions[nextIdx]);
                        setCurrentPage("1");
                      }}
                    >
                      Stage
                      {stageFilter ? ` (${stageFilter})` : " (All)"}
                    </span>
                  </TableHead>
                  <TableHead className="text-blue-300 font-semibold uppercase text-xs tracking-widest">
                    Expected Close
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
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading deals...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-blue-300"
                    >
                      No deals found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((deal, index) => (
                    <TableRow
                      key={deal.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                      className="transition-all duration-150 hover:bg-white/5 group"
                    >
                      <TableCell className="py-4 pl-8">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                            }}
                          >
                            {deal.name.charAt(0)}
                          </div>
                          <span className="text-white font-medium text-sm">
                            {deal.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-200 text-sm">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {deal.contact}
                        </div>
                      </TableCell>
                      <TableCell className="text-blue-200 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {deal.company}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        <span className="text-emerald-300">
                          {formatCurrency(deal.value)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${STAGE_COLORS[deal.stage]}`}
                        >
                          {deal.stage}
                        </span>
                      </TableCell>
                      <TableCell className="text-blue-200 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {new Date(deal.expectedCloseDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="pr-8">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(deal)}
                            className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(deal)}
                            className="p-1.5 rounded-lg text-blue-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <Search className="w-4 h-4 text-blue-400 shrink-0" />
              <Input
                type="search"
                placeholder="Search by name, contact, company..."
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

          <div className="pt-4 flex items-center justify-center gap-4">
            <Button
              disabled={currentPageNum <= 1 || isPending}
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(String(currentPageNum - 1))}
              className="border-white/20 text-blue-200 hover:bg-white/10 bg-transparent"
            >
              Previous
            </Button>
            <span className="text-blue-200 text-sm">
              Page {currentPageNum} of {totalPages || 1}
            </span>
            <Button
              disabled={currentPageNum >= totalPages || isPending}
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(String(currentPageNum + 1))}
              className="border-white/20 text-blue-200 hover:bg-white/10 bg-transparent"
            >
              Next
            </Button>
          </div>
        </motion.div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-lg"
          style={{
            background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              {editingDeal ? "Edit Deal" : "New Deal"}
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              {editingDeal
                ? "Update the deal details below."
                : "Fill in the details to add a new deal."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-200 text-sm">
                Deal Name
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                placeholder="e.g. Enterprise CRM License"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="value"
                className="text-blue-200 text-sm flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Deal Value
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                placeholder="e.g. 50000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="contact"
                  className="text-blue-200 text-sm flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Contact
                </Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-blue-400/50 focus-visible:ring-blue-400"
                  placeholder="Contact name"
                />
              </div>
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
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="stage"
                  className="text-blue-200 text-sm flex items-center gap-1.5"
                >
                  Stage
                </Label>
                <div className="relative">
                  <select
                    id="stage"
                    value={form.stage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stage: e.target.value as DealStage,
                      })
                    }
                    className="w-full appearance-none rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus-visible:ring-blue-400 focus-visible:outline-none focus-visible:ring-2 transition-all duration-200"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s} className="bg-[#0f2744]">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="expectedCloseDate"
                  className="text-blue-200 text-sm flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Expected Close
                </Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={form.expectedCloseDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expectedCloseDate: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-400 [color-scheme:dark]"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-white/10">
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
                    {editingDeal ? "Updating..." : "Creating..."}
                  </>
                ) : editingDeal ? (
                  "Update Deal"
                ) : (
                  "Create Deal"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              Delete Deal
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {deletingDeal?.name}
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
                setDeletingDeal(null);
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
                if (deletingDeal) {
                  deleteMutation.mutate(deletingDeal.id);
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

export default Deals;
