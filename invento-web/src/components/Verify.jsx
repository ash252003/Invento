import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../assets/Final Logo.png";
import { Loader2 } from "lucide-react";

export default function Verify({ userData, setStep }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Swal.fire("Error", "OTP required", "error");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post("http://localhost:8080/api/verifyOtp", {
        email: userData.email,
        userType: userData.user_type,
        otp,
      });

      Swal.fire("Success", "OTP verified", "success");
      setStep(3);

    } catch (err) {
      Swal.fire("Error", err.response?.data || "Invalid OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img src={logo} className="w-32 h-11" />
      <h1 className="text-2xl font-bold mb-6 w-full mt-6">Verify OTP</h1>

      <input
        type="text"
        placeholder="Enter OTP"
        className="w-full p-3 mb-4 border rounded-lg"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        onClick={handleVerifyOtp}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Verifying...
          </>
        ) : (
          "Verify"
        )}
      </button>
    </>
  );
}
