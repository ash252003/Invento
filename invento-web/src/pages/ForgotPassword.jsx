import { useState } from "react";
import ForgotForm from "../components/ForgotForm";
import Verify from "../components/Verify";
import ResetPassword from "../components/ResetPasswordForm";
import Bg from "../assets/bg-image.png";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    email: "",
    user_type: "",
  });
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url(${Bg})` }}
      ></div>
      <div className="relative w-full max-w-md bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        {step === 1 && (
          <ForgotForm setStep={setStep} setUserData={setUserData} />
        )}

        {step === 2 && <Verify userData={userData} setStep={setStep} />}

        {step === 3 && <ResetPassword userData={userData} />}
      </div>
    </div>
  );
}
