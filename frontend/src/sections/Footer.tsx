export function Footer() {
  return (
    <footer className="bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-zinc-400">
          {/* Logo and tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                <span className="text-white">CRM</span>
              </div>
              <span className="font-bold text-lg text-zinc-50">CustomerFlow</span>
            </div>
            <p className="text-sm">
              The intelligent CRM platform that helps growing businesses manage customer relationships, automate workflows, and drive revenue growth.
            </p>
          </div>

          {/* Product links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-50 mb-2">Product</h3>
            <a href="#features" className="hover:text-zinc-300 transition-colors duration-200">
              Features
            </a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors duration-200">
              Pricing
            </a>
            <a href="#faq" className="hover:text-zinc-300 transition-colors duration-200">
              FAQ
            </a>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-50 mb-2">Company</h3>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              About us
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              Blog
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              Careers
            </a>
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-zinc-50 mb-2">Legal</h3>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors duration-200">
              Security
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          © {(new Date()).getFullYear()} CustomerFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}