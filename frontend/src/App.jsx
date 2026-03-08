import { Routes, Route } from "react-router-dom";

// Layouts
import StorefrontLayout from "./layouts/StorefrontLayout";
import AdminLayout from "./layouts/AdminLayout";

// Storefront Pages
import Home from "./pages/storefront/Home";
import Login from "./pages/storefront/Login";
import Register from "./pages/storefront/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";

function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Login Route (No Sidebar Layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        {/* Placeholders for future routes */}
        <Route path="inventory" element={<div className="p-8">Inventory Management (Coming Soon)</div>} />
        <Route path="orders" element={<div className="p-8">Order Management (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-8">Admin Settings (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;
