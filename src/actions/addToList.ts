"use server";
import { getItems, saveItem } from "@/api/mongoClient";

export default async function addToList(
  _originalState: unknown,
  payload: { name: string; dueDate: Date }
) {
  await saveItem(payload);
  return getItems();
}
