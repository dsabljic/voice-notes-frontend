import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader } from "lucide-react";
import {
  getPlans,
  createCheckoutSession,
  createBillingPortalSession,
} from "../api/billing";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Billing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await getPlans();
      setPlans(fetchedPlans);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType) => {
    setProcessingPlan(planType);
    try {
      const { url } = await createCheckoutSession(planType);
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to create checkout session");
      setProcessingPlan(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await createBillingPortalSession();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to access billing portal");
    }
  };

  const currentPlan = user?.subscription?.plan?.planType || "free";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.planType;
          const canUpgrade = plan.planType !== "free" && !isCurrentPlan;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                isCurrentPlan ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {plan.planType}
                </h2>
                <p className="mt-4 text-gray-600">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-500">/month</span>
                  )}
                </p>

                <ul className="mt-6 space-y-4">
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {plan.maxUploads} uploads per month
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {Math.floor(plan.maxRecordingTime / 60)} minutes recording
                    time
                  </li>
                </ul>

                {isCurrentPlan ? (
                  <div className="mt-8">
                    <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100">
                      Current Plan
                    </span>
                    {plan.planType !== "free" && (
                      <button
                        onClick={handleManageBilling}
                        className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Manage Billing
                      </button>
                    )}
                  </div>
                ) : (
                  canUpgrade && (
                    <button
                      onClick={() => handleUpgrade(plan.planType)}
                      disabled={processingPlan === plan.planType}
                      className="mt-8 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processingPlan === plan.planType ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Upgrade
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
