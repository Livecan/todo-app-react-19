"use client";
import { useContext } from "react";
import { ListDataContext } from "./context/ListDataContext";

export default function TodoList() {
  const { list } = useContext(ListDataContext);

  return (
    <>
      <ul>
        {list.map((item: { id: string; name: string; dueDate: Date }) => (
          <li key={item.id}>
            {item.name} - {item.dueDate?.toDateString?.()}
          </li>
        ))}
      </ul>
    </>
  );
}
