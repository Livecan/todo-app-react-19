"use client";

import addToList from "@/actions/addToList";
import { useActionState, useOptimistic, useState } from "react";

interface TodoListProps {
  lists: {
    name: string;
    id: string;
  }[];
}

export default function TodoList({ lists }: TodoListProps) {
  const [newName, setNewName] = useState<string>("");

  const [state, action, isPending] = useActionState(addToList, lists);

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (state, newTodoItem: any) => [
      ...state,
      {
        id: `${Math.floor(Math.random() * 100000)}`,
        name: `${newTodoItem.name} (saving...)`,
      },
    ]
  );

  return (
    <>
      <ul>
        {optimisticState.map((item: { id: string; name: string }) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <form
        action={() => {
          const newItem = {
            name: newName,
          };
          if (!newItem.name) {
            return;
          }
          addOptimistic(newItem);
          setNewName("");
          action(newItem);
        }}
      >
        <input
          name="name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        ></input>
        <button type="submit">Add another</button>
      </form>
    </>
  );
}
