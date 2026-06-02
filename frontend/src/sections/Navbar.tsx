import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"sign-in" | "register">(
    "sign-in",
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
            <span className="text-white">CRM</span>
          </div>
          <span className="font-bold text-lg text-zinc-50">CustomerFlow</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
          >
            FAQ
          </a>
        </div>

        {/* CTA and Mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            className="hidden md:block text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => {
              setAuthDialogTab("sign-in");
              setIsAuthDialogOpen(true);
            }}
          >
            Sign in
          </button>
          <button
            className="text-sm font-medium px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-400 transition-colors duration-200"
            onClick={() => {
              setAuthDialogTab("register");
              setIsAuthDialogOpen(true);
            }}
          >
            Get started
          </button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-zinc-400" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-zinc-950/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-6">
          <nav className="space-y-4">
            <a
              href="#features"
              className="text-lg font-medium text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-lg font-medium text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
            >
              FAQ
            </a>
          </nav>
          <div className="space-y-4">
            <button
              className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
              onClick={() => {
                setAuthDialogTab("sign-in");
                setIsAuthDialogOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              Sign in
            </button>
            <button
              className="text-sm font-medium px-4 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-400 transition-colors duration-200"
              onClick={() => {
                setAuthDialogTab("register");
                setIsAuthDialogOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {/* Auth Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        defaultTab={authDialogTab}
      />
    </header>
  );
}
