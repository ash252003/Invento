import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../assets/Final Logo.png";
import { Loader2 } from "lucide-react";

export default function ForgotForm({ setStep, setUserData }) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email || !userType) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("http://localhost:8080/api/forgotPassword", {
        email,
        user_type: userType,
      });

      setUserData({ email, user_type: userType });
      Swal.fire("Success", "OTP sent to email", "success");
      setStep(2);
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Server error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img src={logo} className="w-32 h-11" />
      <h1 className="text-2xl font-bold mb-6 w-full mt-6">Forgot Password</h1>

      <select
        className="w-full p-3 mb-4 border rounded-lg"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
      >
        <option value="">Select User Type</option>
        <option value="user">User Account</option>
        <option value="admin">Administrator</option>
      </select>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        onClick={handleSendOtp}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Sending...
          </>
        ) : (
          "Send OTP"
        )}
      </button>
    </>
  );
}
