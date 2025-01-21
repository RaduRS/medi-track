import { Resident } from "@/types";
import { getResidents } from "@/app/actions/residents";

export default async function ResidentsPage() {
  const residents = await getResidents();

  return (
    <div className="w-full">
      <div className="grid gap-4">
        {residents.map((resident: Resident) => (
          <div key={resident.id} className="border p-4 rounded-lg">
            <div className="font-medium">{resident.name}</div>
            <div className="text-gray-600">Room: {resident.roomNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
