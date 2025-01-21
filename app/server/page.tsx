"use client";

import { Resident } from "@/types";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const GET_RESIDENTS = gql`
  query GetResidents {
    residents {
      id
      name
      roomNumber
      status
    }
  }
`;

export default function ResidentsPage() {
  const { data, loading, error } = useQuery(GET_RESIDENTS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading residents</div>;

  const residents = data?.residents || [];
  const filteredResidents = residents.filter((resident: Resident) =>
    statusFilter === "ALL" ? true : resident.status === statusFilter
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="ALL">All Residents</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredResidents.map((resident: Resident) => (
          <Link
            href={`/residents/${resident.id}`}
            key={resident.id}
            className="border p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{resident.name}</div>
            <div className="text-gray-600">Room: {resident.roomNumber}</div>
            <div
              className={`text-sm ${
                resident.status === "ACTIVE" ? "text-green-600" : "text-red-600"
              }`}
            >
              {resident.status}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
