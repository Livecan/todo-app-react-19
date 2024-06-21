"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { MongoClient, ObjectId } from "mongodb";

interface Item {
  name: string;
  dueDate: Date;
  completedDate?: Date;
  // @todo We don't want to receive this as param, but we want to pass it to mongodb and filter by it.
  userId?: string;
}

const db = await new MongoClient(process.env.MONGODB_CONNECTION_STRING!)
  .connect()
  .then((client) => client.db());

export async function getItems(options?: { filter?: { completed?: boolean } }) {
  const { user } = (await getSession()) ?? {};

  if (!user) {
    throw new Error("User must be logged in!");
  }

  return (
    await db
      .collection<Item>("items")
      .find(
        {
          userId: user.sub,
          completedDate: { $exists: options?.filter?.completed },
        },
        { sort: [["dueDate", "asc"]], limit: 25 }
      )
      .toArray()
  ).map((item) => {
    const { _id, ...rest } = item;
    return {
      id: item._id.toString(),
      ...rest,
    };
  });
}

export async function saveItem(newItem: Item) {
  const { user } = (await getSession()) ?? {};

  if (!user) {
    throw new Error("User must be logged in!");
  }

  return db
    .collection<Item>("items")
    .insertOne({ ...newItem, userId: user.sub });
}

export async function updateItem(id: string, patch: Partial<Item>) {
  const { user } = (await getSession()) ?? {};

  if (!user) {
    throw new Error("User must be logged in!");
  }

  return db
    .collection<Item>("items")
    .updateOne(
      { _id: { $eq: new ObjectId(id) }, userId: user.sub },
      { $set: patch }
    );
}

export async function deleteItem(id: string) {
  const { user } = (await getSession()) ?? {};

  if (!user) {
    throw new Error("User must be logged in!");
  }

  return db
    .collection<Item>("items")
    .deleteOne({ _id: { $eq: new ObjectId(id) }, userId: user.sub });
}
