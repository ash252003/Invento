import { Navigate } from "react-router-dom";

export default function PasswordResetRoutes({ children, step, requiredStep }) {
  if (step < requiredStep) {
    return <Navigate to="/" />;
  }
  return children;
}
