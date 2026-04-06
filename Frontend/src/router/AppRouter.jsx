import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AddressDetail from "../pages/AddressDetail";
import Admin from "../pages/Admin";
import Support from "../pages/Support";
import Api from "../pages/Api";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function AppRouter() {
  return (
    <Routes>
 
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/register" element={<Register />} />

      <Route path="/address/:id" element={<AddressDetail />} />

      <Route path="/profile" element={<Profile />} />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />

      <Route path="/support" element={<Support />} />

      <Route path="/api" element={<Api />} />

    </Routes>
  );
}

export default AppRouter;