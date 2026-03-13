import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AddressDetail from "../pages/AddressDetail";

function AppRouter() {
  return (
    <Routes>
 
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/address/:id" element={<AddressDetail />} />

    </Routes>
  );
}

export default AppRouter;