import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "notes",
        element: <Notes />,
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
