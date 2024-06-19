import { Suspense } from "react";
import TodoList from "@/components/TodoList";
import { getItems } from "@/api/mongoClient";

async function Home() {
  const data = await getItems();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TodoList lists={data} />
    </main>
  );
}

export default function HomeWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <Home />
    </Suspense>
  );
}
