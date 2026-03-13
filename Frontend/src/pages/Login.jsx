import { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

  // fake admin account
  if (email === "admin@gmail.com" && password === "123456") {

    alert("Đăng nhập admin thành công");

    console.log({
      user: "admin",
      role: "ADMIN"
    });

    return;
  }

  try {

    const res = await login({
      email,
      password
    });

    console.log(res.data);

    alert("Đăng nhập thành công");

  } catch (error) {

    alert("Đăng nhập thất bại");

  }

};
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-2xl font-bold text-center mb-6">
          Đăng nhập
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg transition"
        >
          Đăng nhập
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;