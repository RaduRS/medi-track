"use client";

import { ResidentForm } from "@/app/components/ResidentForm";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { use } from "react";

const GET_RESIDENT = gql`
  query GetResident($id: ID!) {
    resident(id: $id) {
      id
      name
      roomNumber
      status
    }
  }
`;

const UPDATE_RESIDENT = gql`
  mutation UpdateResident(
    $id: ID!
    $name: String!
    $roomNumber: Int!
    $status: ResidentStatus!
  ) {
    updateResident(
      id: $id
      name: $name
      roomNumber: $roomNumber
      status: $status
    ) {
      id
      name
      roomNumber
      status
    }
  }
`;

export default function EditResidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading } = useQuery(GET_RESIDENT, {
    variables: { id },
  });

  const [updateResident] = useMutation(UPDATE_RESIDENT, {
    onCompleted: () => {
      router.push(`/residents/${id}`);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (!data?.resident) return <div>Resident not found</div>;

  async function handleSubmit(formData: FormData) {
    try {
      const result = await updateResident({
        variables: {
          id,
          name: formData.get("name") as string,
          roomNumber: parseInt(formData.get("roomNumber") as string),
          status: formData.get("status"),
        },
      });

      if (result.data?.updateResident) {
        return { success: true };
      } else {
        return { success: false, error: "Failed to update resident" };
      }
    } catch (error) {
      console.error("Error updating resident:", error);
      return { success: false, error: "Failed to update resident" };
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Resident</h1>
      <ResidentForm initialData={data.resident} onSubmit={handleSubmit} />
    </div>
  );
}
