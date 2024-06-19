import { MongoClient } from "mongodb";

interface Item {
  name: string;
  dueDate: Date;
  completed?: boolean;
}

const db = await new MongoClient(process.env.MONGODB_CONNECTION_STRING!)
  .connect()
  .then((client) => client.db());

export async function getItems() {
  return (
    await db
      .collection<Item>("items")
      .find({}, { sort: [["dueDate", "asc"]], limit: 25 })
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
  return db.collection<Item>("items").insertOne(newItem);
}
