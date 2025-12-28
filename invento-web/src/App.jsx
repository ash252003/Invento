import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Billing from "./pages/Billing";
import ManageProducs from "./pages/ManageProducts";
import Sales from "./pages/Sales";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import Verify from "./components/Verify";
import ResetPassword from "./components/ResetPasswordForm";
import ForgotForm from "./components/ForgotForm";
import ResetRoute from "./routes/PasswordResetRoutes";
import {useState} from 'react';

function App() {
  const [step, setStep] = useState(1);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route
          exact
          path="/ManageProducts"
          element={
            <ProtectedRoute>
              <ManageProducs />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/Billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/Sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/Admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/ForgotPassword"
          element={<ForgotPassword step={step} setStep={setStep} />}
        />
        <Route
          exact
          path="/ResetPassword"
          element={
            <ResetRoute step={step} requiredStep={3}>
              <ResetPassword />
            </ResetRoute>
          }
        />
        <Route exact path="/ForgotForm" element={<ForgotForm />} />
        <Route
          exact
          path="/Verify"
          element={
            <ResetRoute step={step} requiredStep={2}>
              <Verify />
            </ResetRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
