import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Auth from "./pages/Auth";
import Billing from "./pages/Billing";
import PaymentSuccess from "./pages/PaymentSuccess";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="billing" element={<Billing />} />
      </Route>
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
