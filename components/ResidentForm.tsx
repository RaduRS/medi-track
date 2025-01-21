"use client";

import { useState } from "react";
import { Resident } from "@/types";

interface ResidentFormProps {
  initialData?: Resident;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ResidentForm({ initialData, onSubmit }: ResidentFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
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
          defaultValue={initialData?.roomNumber}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
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
