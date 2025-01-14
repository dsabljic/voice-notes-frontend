import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your purchase. You will be redirected to the dashboard
          shortly.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
