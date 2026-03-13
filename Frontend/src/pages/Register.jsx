import { useState } from "react";
import { register } from "../services/authService";
import { Link } from "react-router-dom";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const res = await register({
        email,
        password
      });

      alert("Đăng ký thành công");

    } catch (error) {

      alert("Đăng ký thất bại");

    }

  };

  return (

    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-teal-400 to-green-300 flex flex-col justify-center items-center text-white p-10">

        <h1 className="text-4xl font-bold mb-6 text-center">
          Tạo tài khoản mới
        </h1>

        <p className="text-lg text-center mb-10 max-w-md">
          Đăng ký để sử dụng hệ thống tra cứu địa chỉ hành chính 
          và chuyển đổi địa chỉ cũ sang mới một cách nhanh chóng.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
          alt="register"
          className="w-64 opacity-90"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gray-900 flex justify-center items-center">

        <div className="w-96">

          <h2 className="text-3xl font-bold text-white mb-8">
            Đăng ký
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
            onClick={handleRegister}
            className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-lg transition"
          >
            Đăng ký
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-teal-400 hover:underline">
              Đăng nhập
            </Link>
          </p>

        </div>

      </div>

    </div>

  );
}

export default Register;