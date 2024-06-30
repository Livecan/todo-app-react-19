"use client";
import { useContext } from "react";
import { ListDataContext } from "./context/ListDataContext";
import { Button } from "./ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CheckIcon, Trash2Icon } from "lucide-react";

export default function TodoList() {
  const { list, editItem, removeItem } = useContext(ListDataContext);

  return (
    <>
      <ul className="space-y-2">
        {list.map((item: { id: string; name: string; dueDate: Date }) => (
          <li key={item.id}>
            <Card>
              <CardHeader className="py-2">{item.name}</CardHeader>
              <CardContent className="py-2 justify-end">
                {item.dueDate?.toDateString?.()}
              </CardContent>
              <CardFooter className="p-2 justify-end space-x-2">
                <Button
                  onClick={() =>
                    editItem(item.id, { completedDate: new Date() })
                  }
                >
                  <CheckIcon />
                </Button>
                <Button onClick={() => removeItem(item.id)}>
                  <Trash2Icon />
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
