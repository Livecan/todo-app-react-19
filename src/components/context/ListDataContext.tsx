"use client";

import { deleteItem, getItems, saveItem, updateItem } from "@/api/mongoClient";
import {
  PropsWithChildren,
  createContext,
  useActionState,
  useOptimistic,
} from "react";

interface TodoItem {
  id: string;
  name: string;
  dueDate: Date;
  completedDate?: Date;
}

type NewTodoItem = Omit<TodoItem, "id">;

export const ListDataContext = createContext<{
  list: TodoItem[];
  addItem: (newItem: NewTodoItem) => unknown;
  editItem: (id: string, patch: Partial<NewTodoItem>) => unknown;
  removeItem: (id: string) => unknown;
}>({ list: [], addItem: () => [], editItem: () => {}, removeItem: () => {} });

export default function ListDataContextProvider({
  list,
  children,
}: PropsWithChildren<{ list: TodoItem[] }>) {
  const [state, action, isPending] = useActionState(
    (_state: TodoItem[], action: () => TodoItem[] | Promise<TodoItem[]>) => {
      console.log("calling action");
      return action();
    },
    list
  );

  const [optimisticState, changeOptimistic] = useOptimistic(
    state,
    (state, update: (todoItems: TodoItem[]) => TodoItem[]) => {
      console.log("use optimistic");
      return update(state);
    }
  );

  return (
    <ListDataContext.Provider
      value={{
        list: optimisticState,
        addItem(newItem) {
          if (!newItem.name || !newItem.dueDate) {
            return;
          }
          changeOptimistic((items) => [
            ...items,
            {
              ...newItem,
              id: `${Math.floor(Math.random() * 100000)}`,
              name: `${newItem.name} (saving...)`,
            },
          ]);
          action(async () => {
            await saveItem(newItem);
            return getItems({ filter: { completed: false } });
          });
        },
        editItem(id, patch) {
          changeOptimistic((items) =>
            items.map((item) =>
              item.id !== id
                ? item
                : {
                    ...item,
                    ...patch,
                    name: `${patch.name ?? item.name} (saving...)`,
                  }
            )
          );
          action(async () => {
            await updateItem(id, patch);
            return getItems({ filter: { completed: false } });
          });
        },
        removeItem(id) {
          changeOptimistic((items) =>
            items.map((item) =>
              item.id === id
                ? { ...item, name: `${item.name} (removing)` }
                : item
            )
          );
          action(async () => {
            await deleteItem(id);
            return getItems({ filter: { completed: false } });
          });
        },
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
