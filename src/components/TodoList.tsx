"use client";

import addToList from "@/actions/addToList";
import { useActionState, useOptimistic, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Calendar } from "./ui/Calendar";
import { Input } from "./ui/Input";

interface TodoListProps {
  lists: {
    name: string;
    dueDate: Date;
    id: string;
  }[];
}

export default function TodoList({ lists }: TodoListProps) {
  const [newName, setNewName] = useState<string>("");

  const [dueDate, setDueDate] = useState<Date>(new Date());

  const [state, action, isPending] = useActionState(addToList, lists);

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // @todo Provide type instead of `any`
    (state, newTodoItem: any) => [
      ...state,
      {
        ...newTodoItem,
        id: `${Math.floor(Math.random() * 100000)}`,
        name: `${newTodoItem.name} (saving...)`,
      },
    ]
  );

  return (
    <>
      <ul>
        {optimisticState.map(
          (item: { id: string; name: string; dueDate: Date }) => (
            <li key={item.id}>
              {item.name} - {item.dueDate?.toDateString?.()}
            </li>
          )
        )}
      </ul>
      <form
        action={() => {
          const newItem = {
            name: newName,
            dueDate,
          };
          if (!newItem.name || !newItem.dueDate) {
            return;
          }
          addOptimistic(newItem);
          setNewName("");
          action(newItem);
        }}
      >
        <Input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
            <Select
              onValueChange={(value) =>
                setDueDate(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => setDueDate(date ?? new Date())}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit">Add another</Button>
      </form>
    </>
  );
}
