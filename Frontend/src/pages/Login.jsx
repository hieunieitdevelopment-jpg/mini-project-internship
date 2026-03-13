import { useState } from "react";
import { login } from "../services/authService";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (email === "admin@gmail.com" && password === "123456") {
      alert("Đăng nhập admin thành công");
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

    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-teal-400 to-green-300 flex flex-col justify-center items-center text-white p-10">

        <h1 className="text-4xl font-bold mb-6 text-center">
          Tra cứu địa chỉ hành chính
        </h1>

        <p className="text-lg text-center mb-10 max-w-md">
          Hệ thống giúp tra cứu và chuyển đổi địa chỉ hành chính 
          cũ và mới nhanh chóng, chính xác.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3213/3213071.png"
          alt="rocket"
          className="w-64 opacity-90"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gray-900 flex justify-center items-center">

        <div className="w-96">

          <h2 className="text-3xl font-bold text-white mb-8">
            Đăng nhập
          </h2>

          <div className="mb-4">

            <label className="text-gray-400 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Nhập email"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="mb-6">

            <label className="text-gray-400 text-sm">
              Mật khẩu
            </label>

            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full p-3 mt-1 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-teal-400"
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Đăng nhập
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-teal-400 hover:underline">
              Đăng ký
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Login;