"use client";
import { useContext } from "react";
import { ListDataContext } from "./context/ListDataContext";
import { Button } from "./ui/Button";

export default function TodoList() {
  const { list, editItem, removeItem } = useContext(ListDataContext);

  return (
    <>
      <ul>
        {list.map((item: { id: string; name: string; dueDate: Date }) => (
          <li key={item.id}>
            {item.name} - {item.dueDate?.toDateString?.()}
            <Button
              onClick={() => editItem(item.id, { completedDate: new Date() })}
            >
              Complete
            </Button>
            <Button onClick={() => removeItem(item.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </>
  );
}
