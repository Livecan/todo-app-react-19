"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { MongoClient } from "mongodb";

interface Item {
  name: string;
  dueDate: Date;
  completed?: boolean;
  // @todo We don't want to receive this as param, but we want to pass it to mongodb and filter by it.
  userId?: string;
}

const db = await new MongoClient(process.env.MONGODB_CONNECTION_STRING!)
  .connect()
  .then((client) => client.db());

export async function getItems() {
  const { user } = (await getSession()) ?? {};

  if (!user) {
    throw new Error("User must be logged in!");
  }

  return (
    await db
      .collection<Item>("items")
      .find({ userId: user.sub }, { sort: [["dueDate", "asc"]], limit: 25 })
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
