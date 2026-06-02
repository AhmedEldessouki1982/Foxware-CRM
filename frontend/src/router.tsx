import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import ProtectedLayout from "./pages/ProtectedLayout";
import Contacts from "./pages/contacts/Contacts";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes — no auth required */}
        <Route path="/" element={<Home />} />

        {/* protected routes — auth required */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          {/* add more protected pages here */}
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
