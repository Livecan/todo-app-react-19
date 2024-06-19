import { Suspense } from "react";
import TodoList from "@/components/TodoList";
import { getItems } from "@/api/mongoClient";
import { getSession } from "@auth0/nextjs-auth0";

async function Home() {
  const data = (await getSession().then((session) => session?.user))
    ? await getItems()
    : [];

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
