"use client";

import { ResidentForm } from "@/app/components/ResidentForm";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

const CREATE_RESIDENT = gql`
  mutation CreateResident(
    $name: String!
    $roomNumber: Int!
    $status: ResidentStatus!
  ) {
    createResident(name: $name, roomNumber: $roomNumber, status: $status) {
      id
      name
      roomNumber
      status
    }
  }
`;

const GET_RESIDENTS = gql`
  query GetResidents {
    residents {
      id
      name
      roomNumber
    }
  }
`;

export default function NewResidentPage() {
  const router = useRouter();
  const [createResident] = useMutation(CREATE_RESIDENT, {
    refetchQueries: [{ query: GET_RESIDENTS }],
    awaitRefetchQueries: true,
  });

  async function handleSubmit(formData: FormData) {
    try {
      const result = await createResident({
        variables: {
          name: formData.get("name") as string,
          roomNumber: parseInt(formData.get("roomNumber") as string),
          status: formData.get("status"),
        },
      });

      if (result.data?.createResident) {
        router.push("/");
        return { success: true };
      } else {
        return { success: false, error: "Failed to create resident" };
      }
    } catch (error) {
      console.error("Error creating resident:", error);
      return { success: false, error: "Failed to create resident" };
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Resident</h1>
      <ResidentForm onSubmit={handleSubmit} />
    </div>
  );
}
