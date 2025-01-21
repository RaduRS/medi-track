import { Resident } from "@/types";
import { getResidents } from "@/app/actions/residents";

export async function Residents() {
  const residents = await getResidents();

  return (
    <div className="w-full">
      {residents.map((resident: Resident) => (
        <div key={resident.id} className="border p-4 mb-2 rounded-lg">
          <div className="font-medium">{resident.name}</div>
          <div className="text-gray-600">Room: {resident.roomNumber}</div>
        </div>
      ))}
    </div>
  );
}
