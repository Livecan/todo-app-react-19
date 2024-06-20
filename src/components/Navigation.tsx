"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";
import TodoList from "./TodoList";
import AddTodoItem from "./AddTodoItem";

const TABS = ["DUE", "DONE", "ADD"] as const;
type TabType = (typeof TABS)[number];

export default function Navigation() {
  const [selectedTab, setSelectedTab] = useState<TabType>(TABS[0]);

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as TabType)}
      className="w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-3">
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="DUE">
        <TodoList />
      </TabsContent>
      <TabsContent value="ADD">
        <AddTodoItem onAdded={() => setSelectedTab("DUE")} />
      </TabsContent>
    </Tabs>
  );
}
