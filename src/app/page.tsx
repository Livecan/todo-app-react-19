import { Suspense } from "react";
import { getItems } from "@/api/mongoClient";
import { getSession } from "@auth0/nextjs-auth0";
import Navigation from "@/components/Navigation";
import ListDataContextProvider from "@/components/context/ListDataContext";

async function Home() {
  const data = (await getSession().then((session) => session?.user))
    ? await getItems()
    : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ListDataContextProvider list={data}>
        <div className="max-w-sm">
          <Navigation />
        </div>
      </ListDataContextProvider>
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
