import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user || !user.subscription) {
    return null;
  }

  const { subscription } = user;
  const { plan, uploadsLeft, recordingTimeLeft } = subscription;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="px-4 py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">Plan:</span>
              <span className="text-sm text-gray-600 capitalize">
                {plan.planType}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Uploads left:</span>
                <span className="text-sm text-gray-900">{uploadsLeft}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Recording time:</span>
                <span className="text-sm text-gray-900">
                  {recordingTimeLeft}s
                </span>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                /* TODO: Implement settings */
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
            <button
              onClick={() => {
                /* TODO: Implement billing */
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
            >
              <CreditCard className="w-4 h-4 mr-3" />
              Billing
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
