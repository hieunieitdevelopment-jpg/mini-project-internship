import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AddressDetail from "../pages/AddressDetail";
import Admin from "../pages/Admin";
import Support from "../pages/Support";
import Api from "../pages/Api";

function AppRouter() {
  return (
    <Routes>
 
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/address/:id" element={<AddressDetail />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/support" element={<Support />} />

      <Route path="/api" element={<Api />} />

    </Routes>
  );
}

export default AppRouter;