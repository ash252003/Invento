import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../assets/Final Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ResetPasswordForm({ userData }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!pass || !confirmPass) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }

    if (pass !== confirmPass) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put("http://localhost:8080/api/resetPassword", {
        email: userData.email,
        userType: userData.user_type,
        password: pass,
      });

      Swal.fire("Success", "Password reset successful", "success");
      navigate("/");
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Server error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img src={logo} className="w-32 h-11" />
      <h1 className="text-2xl font-bold mb-6 w-full mt-6">Reset Password</h1>

      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 mb-4 border rounded-lg"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-3 mb-4 border rounded-lg"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        onClick={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Reseting...
          </>
        ) : (
          "Reset"
        )}
      </button>
    </>
  );
}
