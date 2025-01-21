"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

const GET_RESIDENT = gql`
  query GetResident($id: ID!) {
    resident(id: $id) {
      id
      name
      roomNumber
      status
      createdAt
    }
  }
`;

const DELETE_RESIDENT = gql`
  mutation DeleteResident($id: ID!) {
    deleteResident(id: $id)
  }
`;

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export default function ResidentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_RESIDENT, {
    variables: { id },
  });

  const [deleteResident] = useMutation(DELETE_RESIDENT, {
    onCompleted: () => {
      router.push("/");
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading resident</div>;

  const resident = data?.resident;
  if (!resident) return <div>Resident not found</div>;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      await deleteResident({
        variables: { id },
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resident Details</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Back
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <div className="text-lg">{resident.name}</div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Room Number</label>
            <div className="text-lg">{resident.roomNumber}</div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Created At</label>
            <div className="text-lg">{formatDate(resident.createdAt)}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link
            href={`/residents/${id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
