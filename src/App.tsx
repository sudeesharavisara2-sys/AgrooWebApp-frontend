import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { AdminRoute, ProtectedRoute } from './components/layout/RouteGuards';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
import Profile from './pages/auth/Profile';

import ProductList from './pages/products/ProductList';
import ProductDetail from './pages/products/ProductDetail';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import MyProducts from './pages/products/MyProducts';

import MachineList from './pages/machines/MachineList';
import MachineDetail from './pages/machines/MachineDetail';
import MachineCreate from './pages/machines/MachineCreate';
import MachineEdit from './pages/machines/MachineEdit';
import MyMachines from './pages/machines/MyMachines';

import PostsList from './pages/posts/PostsList';
import PostDetail from './pages/posts/PostDetail';
import CreatePost from './pages/posts/CreatePost';

import Groups from './pages/chat/Groups';
import ChatRoom from './pages/chat/ChatRoom';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPrices from './pages/admin/AdminPrices';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminLogs from './pages/admin/AdminLogs';

const App: React.FC = () => (
  <Routes>
    <Route element={<MainLayout />}>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/machines" element={<MachineList />} />
      <Route path="/machines/:id" element={<MachineDetail />} />
      <Route path="/posts" element={<PostsList mode="all" />} />
      <Route path="/posts/:id" element={<PostDetail />} />

      {/* Authenticated (REGISTERED_USER) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/products/new" element={<ProductCreate />} />
        <Route path="/products/:id/edit" element={<ProductEdit />} />
        <Route path="/my-products" element={<MyProducts />} />

        <Route path="/machines/new" element={<MachineCreate />} />
        <Route path="/machines/:id/edit" element={<MachineEdit />} />
        <Route path="/my-machines" element={<MyMachines />} />

        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="/feed" element={<PostsList mode="feed" />} />

        <Route path="/chat" element={<Groups />} />
        <Route path="/chat/:groupId" element={<ChatRoom />} />
      </Route>

      {/* Admin only */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="prices" element={<AdminPrices />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>
);

export default App;
