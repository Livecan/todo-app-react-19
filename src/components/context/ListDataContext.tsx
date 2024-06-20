"use client";

import addToList from "@/actions/addToList";
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
}

type NewTodoItem = Omit<TodoItem, "id">;

export const ListDataContext = createContext<{
  list: TodoItem[];
  addItem: (newItem: NewTodoItem) => unknown;
}>({ list: [], addItem: () => [] });

export default function ListDataContextProvider({
  list,
  children,
}: PropsWithChildren<{ list: TodoItem[] }>) {
  const [state, action, isPending] = useActionState(addToList, list);

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // @todo Provide type instead of `any`
    (state, newItem: NewTodoItem) => {
      return [
        ...state,
        {
          ...newItem,
          id: `${Math.floor(Math.random() * 100000)}`,
          name: `${newItem.name} (saving...)`,
        },
      ];
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
          addOptimistic(newItem);
          action(newItem);
        },
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
