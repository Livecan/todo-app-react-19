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

export const ListDataContext = createContext<{
  list: TodoItem[];
  addItem: (
    newItem: Omit<TodoItem, "id">,
    optimisticAction?: () => unknown
  ) => unknown;
}>({ list: [], addItem: () => [] });

export default function ListDataContextProvider({
  list,
  children,
}: PropsWithChildren<{ list: TodoItem[] }>) {
  const [state, action, isPending] = useActionState(addToList, list);

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // @todo Provide type instead of `any`
    (state, { newItem, optimisticAction }) => {
      optimisticAction?.();
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
        addItem(newItem, optimisticAction) {
          if (!newItem.name || !newItem.dueDate) {
            return;
          }
          addOptimistic({ newItem, optimisticAction });
          action(newItem);
        },
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
