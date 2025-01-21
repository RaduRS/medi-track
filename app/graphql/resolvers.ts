import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type ResolverContext = {
  // Add context types if needed
};

type MutationCreateResidentArgs = {
  name: string;
  roomNumber: number;
  status: "ACTIVE" | "INACTIVE";
};

type MutationUpdateResidentArgs = {
  id: string;
  name?: string;
  roomNumber?: number;
  status?: "ACTIVE" | "INACTIVE";
};

const resolvers = {
  Query: {
    residents: async () => {
      const client = await clientPromise;
      const db = client.db("Medi-Track");
      const residents = await db
        .collection("residents")
        .aggregate([
          {
            $addFields: {
              statusOrder: {
                $cond: {
                  if: { $eq: ["$status", "ACTIVE"] },
                  then: 0,
                  else: 1,
                },
              },
            },
          },
          {
            $sort: {
              statusOrder: 1,
              name: 1,
            },
          },
        ])
        .toArray();

      return residents.map((resident) => ({
        ...resident,
        id: resident._id.toString(),
      }));
    },
    resident: async (_: unknown, { id }: { id: string }) => {
      const client = await clientPromise;
      const db = client.db("Medi-Track");
      const resident = await db
        .collection("residents")
        .findOne({ _id: new ObjectId(id) });

      if (!resident) return null;

      return {
        ...resident,
        id: resident._id.toString(),
        createdAt: resident.createdAt.toISOString(),
      };
    },
  },
  Mutation: {
    createResident: async (
      _: unknown,
      { name, roomNumber, status }: MutationCreateResidentArgs,
      _context: ResolverContext
    ) => {
      const client = await clientPromise;
      const db = client.db("Medi-Track");

      const result = await db.collection("residents").insertOne({
        name,
        roomNumber,
        status,
        createdAt: new Date(),
      });

      const resident = await db
        .collection("residents")
        .findOne({ _id: result.insertedId });

      if (!resident) {
        throw new Error("Failed to create resident");
      }

      return {
        ...resident,
        id: resident._id.toString(),
      };
    },
    deleteResident: async (_: unknown, { id }: { id: string }) => {
      const client = await clientPromise;
      const db = client.db("Medi-Track");

      const result = await db
        .collection("residents")
        .deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount === 1;
    },
    updateResident: async (
      _: unknown,
      { id, name, roomNumber, status }: MutationUpdateResidentArgs,
      _context: ResolverContext
    ) => {
      const client = await clientPromise;
      const db = client.db("Medi-Track");

      const updateData: {
        name?: string;
        roomNumber?: number;
        status?: string;
      } = {};
      if (name !== undefined) updateData.name = name;
      if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
      if (status !== undefined) updateData.status = status;

      const result = await db
        .collection("residents")
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: "after" }
        );

      if (!result) {
        throw new Error("Failed to update resident");
      }

      return {
        ...result,
        id: result._id.toString(),
      };
    },
  },
};

export default resolvers;
