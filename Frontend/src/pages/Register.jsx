import { useState } from "react";
import { register } from "../services/authService";

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

    <div className="flex justify-center items-center h-screen">

      <div className="bg-white p-6 shadow rounded w-80">

        <h1 className="text-xl font-bold mb-4">
          Register
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
          onClick={handleRegister}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;