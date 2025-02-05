"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Resident } from "@/types";

interface ResidentFormProps {
  initialData?: Resident;
  onSubmit: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export function ResidentForm({ initialData, onSubmit }: ResidentFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // Add status to formData based on checkbox
      formData.set(
        "status",
        formData.get("statusCheckbox") ? "ACTIVE" : "INACTIVE"
      );
      const result = await onSubmit(formData);

      if (result?.success) {
        router.push("/");
        router.refresh();
      } else {
        throw new Error(result?.error || "Failed to save resident");
      }
    } catch (error) {
      console.error("Failed to save resident:", error);
      alert("Failed to save resident. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          disabled={loading}
          defaultValue={initialData?.name}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="roomNumber" className="block text-sm font-medium">
          Room Number
        </label>
        <input
          type="number"
          id="roomNumber"
          name="roomNumber"
          required
          disabled={loading}
          defaultValue={initialData?.roomNumber}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex items-center space-x-2 border rounded-md p-3">
        <input
          type="checkbox"
          id="statusCheckbox"
          name="statusCheckbox"
          defaultChecked={initialData?.status === "ACTIVE"}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="statusCheckbox"
          className="text-sm font-medium text-gray-700"
        >
          Active Resident
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Resident"
          : "Add Resident"}
      </button>
    </form>
  );
}
