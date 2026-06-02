import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { navItems } from "./navigation";
import { NavLink } from "react-router-dom";

const HeaderBar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
      className="h-16 w-full flex justify-between items-center px-6 sticky top-0 z-10 shadow-lg"
    >
      {/* left — app identity */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{
            background: "rgba(59,130,246,0.3)",
            border: "1px solid rgba(59,130,246,0.5)",
          }}
        >
          C
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-white font-semibold text-sm tracking-wide">
            Dashboard
          </span>
          <span className="text-blue-300 text-xs opacity-70">CRM Platform</span>
        </div>
      </div>

      {/* center — navigation */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* right — actions */}
      <div className="flex items-center gap-2">
        {/* user info */}
        {user && (
          <span className="text-blue-200 text-sm mr-2 hidden sm:block">
            {user.email}
          </span>
        )}
        {/* divider */}
        <div className="w-px h-5 bg-white/30" />
        {/* profile button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-blue-200 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:block cursor-pointer">Profile</span>
        </button>

        {/* divider */}
        <div className="w-px h-5 bg-white/30" />

        {/* sign out button */}
        <button
          onClick={handleSignout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-blue-200 text-sm transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block cursor-pointer">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
