import { React, useState } from "react";
import Bg from "../assets/bg-image.png";
import logo from "../assets/Final Logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginAs, setLoginAs] = useState("");

  const handleLogin = async () => {
    if (!email || !password || !loginAs) {
      Swal.fire("Each Field Is Mandatory");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
        user_type: loginAs,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.user_type === "admin") {
        navigate("/Admin");
      } else {
        navigate("/ManageProducts");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        Swal.fire("Error", err.response.data, "error");
      } else {
        Swal.fire("Error","Server error, please try again", "error");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>
      <div className="relative w-full overflow-hidden max-w-3xl bg-linear-to-r p-6 rounded-none grid grid-cols-1 md:grid-cols-2 md:w-screen md:rounded-lg">
        <div className="bg-linear-to-br from-blue-700 to-blue-500 p-12 text-white flex flex-col justify-center rounded-l-lg">
          <div className="flex items-center gap-3 mb-10">
            <img
              src={logo}
              alt="Invento Logo"
              className="h-12 brightness-0 invert"
            />
          </div>

          <p className="text-blue-100 text-lg md:mb-10">
            A smart, reliable Inventory Management system to manage products,
            stock, and billing — built for modern shopkeepers and growing
            businesses.
          </p>

          <div className="mt-12 md:pt-8 border-t border-blue-400/30">
            <p className="text-sm text-blue-200">
              Trusted by local retailers to simplify daily operations.
            </p>
          </div>
        </div>
        <div className="w-full bg-white max-w-xl p-6 content-center flex flex-col items-center rounded-r-lg">
          <img src={logo} alt="React Logo" className="w-32 h-11" />
          <div className="w-full flex justify-start pb-0.5 pt-5">
            <h1 className="text-2xl font-bold mb-6 text-cente">Sign In</h1>
          </div>

          <select
            className="w-full p-3 rounded-lg border transition mb-4"
            value={loginAs}
            onChange={(e) => setLoginAs(e.target.value)}
          >
            <option value="">Select User Type</option>
            <option value="user">User Account</option>
            <option value="admin">Administrator</option>
          </select>

          <input
            type="email"
            placeholder="Email Id"
            className="w-full p-3 mb-4 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h5 className="w-full text-blue-700 font-medium text-end p-2.5">
            <Link>Forgot Password?</Link>
          </h5>
          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            onClick={handleLogin}
          >
            Sign In
          </button>
          <h5 className="font-medium mb-6 text-center pt-2.5">
            New User?{" "}
            <Link
              className="text-blue-700 font-medium hover:text-blue-500"
              to="/SignUp"
            >
              Sign Up
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
}
