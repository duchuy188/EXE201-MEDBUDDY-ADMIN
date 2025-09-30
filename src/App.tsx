
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from "./pages/AdminDashboard";
import UsersManagement from "./pages/UserManager/UsersManagement";
// Dummy Medicines and Settings pages
const MedicinesPage = () => (
  <div className="space-y-6"><div className="card"><div className="card-header"><h2>Quản lý thuốc</h2><p>Theo dõi và quản lý kho thuốc trong hệ thống</p></div><div className="card-content"><p className="text-center text-muted-foreground py-8">Tính năng quản lý thuốc đang được phát triển...</p></div></div></div>
);
const SettingsPage = () => (
  <div className="space-y-6"><div className="card"><div className="card-header"><h2>Cấu hình hệ thống</h2><p>Quản lý các thiết lập chung của ứng dụng</p></div><div className="card-content"><p className="text-center text-muted-foreground py-8">Tính năng cấu hình đang được phát triển...</p></div></div></div>
);
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import AdminProfile from "./pages/AdminProfile";
import PacketManagement from "./pages/PacketManager/PacketManagement";
import ViewUser from "./pages/UserManager/ViewUser";
import EditUser from "./pages/UserManager/EditUser";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminDashboard />
          </RequireAuth>
        }>
          <Route index element={<div>{/* Overview tab */}{/* Rendered in AdminDashboard */}</div>} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="users/:id" element={<ViewUser />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="packets" element={<PacketManagement />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/admin/profile" element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminProfile />
          </RequireAuth>
        } />
        <Route path="/" element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminDashboard />
          </RequireAuth>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        limit={3}
      />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
