import reactLogo from "../assets/react.svg";
import Bg from "../assets/bg-image.png";
import logo from "../assets/Final Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const status = 1;
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !phone || !confirmPass) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    } else if (password != confirmPass) {
      Swal.fire("Error", "Password & Confirm Password Must Be Same", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/register", {
        email: email,
        password: password,
        phone: phone,
        status: status,
      });
      navigate("/");
    } catch (err) {
      Swal.fire("Error", "Something Went Wrong! Please Try Later", "error");
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

        <div className="w-full max-w-xl bg-white p-6 rounded-r-lg shadow content-center grid grid-cols-1 md:grid-cols-1">
          <div className="w-full flex justify-center">
            <img src={logo} alt="React Logo" className="w-32 h-11" />
          </div>
          <div className="w-full flex justify-start pb-0.5 pt-5">
            <h1 className="text-2xl font-bold mb-6 text-cente">Sign Up</h1>
          </div>
          
          <input
            type="email"
            placeholder="Email Id"
            className="w-full p-3 mb-4 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full p-3 mb-4 border rounded-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 mb-4 border rounded-lg"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            onClick={handleRegister}
          >
            Sign Up
          </button>
          <div className="flex justify-center items-center w-full">
            <p className="">Already Have An Account?</p>
            <Link
              to="/"
              className="text-blue-800 font-bold p-2 hover:text-blue-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
