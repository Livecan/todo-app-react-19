"use server";
import { getItems, saveItem } from "@/api/mongoClient";

export default async function addToList(
  _originalState: unknown,
  payload: { name: string }
) {
  await saveItem({ ...payload, dueDate: new Date() });
  return getItems();
}
