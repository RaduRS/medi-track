import { ResidentForm } from "@/components/ResidentForm";
import { createResident } from "@/app/actions/residents";
import { redirect } from "next/navigation";

export default function NewResidentPage() {
  async function handleSubmit(formData: FormData) {
    "use server";

    await createResident({
      name: formData.get("name") as string,
      roomNumber: Number(formData.get("roomNumber")),
    });

    redirect("/");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Resident</h1>
      <ResidentForm onSubmit={handleSubmit} />
    </div>
  );
}
