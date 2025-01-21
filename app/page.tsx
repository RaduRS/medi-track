import { Suspense } from "react";
import { Residents } from "./server/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Link
            href="/residents/new"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Resident
          </Link>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Residents />
        </Suspense>
      </div>
    </div>
  );
}
