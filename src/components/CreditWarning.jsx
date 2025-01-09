import React from "react";
import { AlertCircle } from "lucide-react";

export default function CreditWarning({ type, remaining, total }) {
  const percentage = (remaining / total) * 100;
  const isLow = percentage <= 20;

  if (!isLow) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
        <div>
          <p className="text-sm text-yellow-700">
            {type === "uploads"
              ? `You have ${remaining} uploads left out of ${total}.`
              : `You have ${remaining} seconds of recording time left out of ${total}.`}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Consider upgrading your plan to get more credits.
          </p>
        </div>
      </div>
    </div>
  );
}
