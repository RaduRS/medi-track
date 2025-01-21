"use server";

import { Resident } from "@/types";
import clientPromise from "@/lib/mongodb";

export async function createResident(
  data: Pick<Resident, "name" | "roomNumber">
) {
  try {
    const client = await clientPromise;
    const db = client.db("Medi-Track");

    const result = await db.collection("residents").insertOne({
      ...data,
      createdAt: new Date(),
    });

    if (!result.insertedId) {
      throw new Error("Failed to create resident");
    }

    return { success: true, id: result.insertedId };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create resident");
  }
}

export async function getResidents() {
  try {
    const client = await clientPromise;
    const db = client.db("Medi-Track");

    const residents = await db
      .collection("residents")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return residents.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      roomNumber: doc.roomNumber,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch residents");
  }
}
