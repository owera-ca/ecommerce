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
import Users from "./pages/admin/Users";
import EditUser from "./pages/admin/EditUser";
import Addresses from "./pages/admin/Addresses";
import EditAddress from "./pages/admin/EditAddress";
import Countries from "./pages/admin/Countries";
import EditCountry from "./pages/admin/EditCountry";
import Provinces from "./pages/admin/Provinces";
import EditProvince from "./pages/admin/EditProvince";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EditEmailTemplate from "./pages/admin/EditEmailTemplate";
import SentEmails from "./pages/admin/SentEmails";

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

        {/* Users */}
        <Route path="users" element={<Users />} />
        <Route path="users/add" element={<EditUser />} />
        <Route path="users/:id" element={<EditUser />} />

        {/* Addresses */}
        <Route path="addresses" element={<Addresses />} />
        <Route path="addresses/add" element={<EditAddress />} />
        <Route path="addresses/:id" element={<EditAddress />} />

        {/* Countries */}
        <Route path="countries" element={<Countries />} />
        <Route path="countries/add" element={<EditCountry />} />
        <Route path="countries/:id" element={<EditCountry />} />

        {/* Provinces */}
        <Route path="provinces" element={<Provinces />} />
        <Route path="provinces/add" element={<EditProvince />} />
        <Route path="provinces/:id" element={<EditProvince />} />

        {/* Placeholders for future routes */}
        <Route path="inventory" element={<div className="p-8">Inventory Management (Coming Soon)</div>} />
        <Route path="orders" element={<div className="p-8">Order Management (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-8">Admin Settings (Coming Soon)</div>} />

        {/* Email Templates */}
        <Route path="email-templates" element={<EmailTemplates />} />
        <Route path="email-templates/add" element={<EditEmailTemplate />} />
        <Route path="email-templates/:id" element={<EditEmailTemplate />} />

        {/* Sent Emails */}
        <Route path="sent-emails" element={<SentEmails />} />
      </Route>
    </Routes>
  );
}

export default App;
