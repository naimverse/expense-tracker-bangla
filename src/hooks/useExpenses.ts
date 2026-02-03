import { useState, useEffect } from "react";
import type { DayExpense, ExpenseItem } from "@/types/expense";

const STORAGE_KEY = "bazar-expenses";

const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial sample data
const initialData: DayExpense[] = [
  {
    id: generateId(),
    date: "১.২.২৬",
    items: [{ id: generateId(), name: "ভাড়া", amount: 90 }],
  },
  {
    id: generateId(),
    date: "২.২.২৬",
    items: [
      { id: generateId(), name: "আলু", amount: 40 },
      { id: generateId(), name: "রসুন", amount: 50 },
      { id: generateId(), name: "পিঁয়াজ", amount: 100 },
      { id: generateId(), name: "আদা", amount: 100 },
      { id: generateId(), name: "সরিষার তেল", amount: 140 },
    ],
  },
  {
    id: generateId(),
    date: "৩.২.২৬",
    items: [
      { id: generateId(), name: "ভাড়া", amount: 90 },
      { id: generateId(), name: "কুল", amount: 30 },
      { id: generateId(), name: "বেগুন", amount: 50 },
    ],
  },
  {
    id: generateId(),
    date: "৪.২.২৬",
    items: [
      { id: generateId(), name: "ভাড়া", amount: 90 },
      { id: generateId(), name: "ডাল ভাজা", amount: 20 },
    ],
  },
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<DayExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addDate = (date: string) => {
    const newDay: DayExpense = {
      id: generateId(),
      date,
      items: [],
    };
    setExpenses((prev) => [newDay, ...prev]);
  };

  const deleteDate = (dayId: string) => {
    setExpenses((prev) => prev.filter((day) => day.id !== dayId));
  };

  const addItem = (dayId: string, name: string, amount: number) => {
    const newItem: ExpenseItem = {
      id: generateId(),
      name,
      amount,
    };
    setExpenses((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, items: [...day.items, newItem] } : day
      )
    );
  };

  const deleteItem = (dayId: string, itemId: string) => {
    setExpenses((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, items: day.items.filter((item) => item.id !== itemId) }
          : day
      )
    );
  };

  const grandTotal = expenses.reduce(
    (total, day) => total + day.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  return {
    expenses,
    grandTotal,
    addDate,
    deleteDate,
    addItem,
    deleteItem,
  };
};
