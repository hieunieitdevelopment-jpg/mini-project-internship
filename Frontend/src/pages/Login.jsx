import { useState } from "react";
import { login } from "../services/authService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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

    <div className="flex justify-center items-center h-screen">

      <div className="bg-white p-6 shadow rounded w-80">

        <h1 className="text-xl font-bold mb-4">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;