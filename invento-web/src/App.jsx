import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Billing from "./pages/Billing";
import ManageProducs from "./pages/ManageProducts";
import Sales from "./pages/Sales";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/ManageProducts" element={<ProtectedRoute><ManageProducs /></ProtectedRoute>} />
        <Route exact path="/Billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route exact path="/Sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route exact path="/Admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
