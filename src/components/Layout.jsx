import { Outlet } from 'react-router-dom';
import DashboardNavbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}