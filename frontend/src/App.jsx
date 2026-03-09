import { Routes, Route } from "react-router-dom";

// Layouts
import StorefrontLayout from "./layouts/StorefrontLayout";
import AdminLayout from "./layouts/AdminLayout";

// Storefront Pages
import Home from "./pages/storefront/Home";
import Login from "./pages/storefront/Login";
import Register from "./pages/storefront/Register";
import ForgotPassword from "./pages/storefront/ForgotPassword";
import ResetPassword from "./pages/storefront/ResetPassword";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import Merchants from "./pages/admin/Merchants";
import AddMerchant from "./pages/admin/AddMerchant";
import EditMerchant from "./pages/admin/EditMerchant";

function App() {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Login Route (No Sidebar Layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="merchants" element={<Merchants />} />
        <Route path="merchants/add" element={<AddMerchant />} />
        <Route path="merchants/:id" element={<EditMerchant />} />
        {/* Placeholders for future routes */}
        <Route path="inventory" element={<div className="p-8">Inventory Management (Coming Soon)</div>} />
        <Route path="orders" element={<div className="p-8">Order Management (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-8">Admin Settings (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;
