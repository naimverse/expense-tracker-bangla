import { useState, useEffect } from "react";
import type { DayExpense, ExpenseItem, Category } from "@/types/expense";

const STORAGE_KEY = "bazar-expenses";
const CATEGORY_KEY = "bazar-categories";

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultCategories: Category[] = [
  { id: "cat-1", name: "পরিবহন", color: "hsl(28, 85%, 55%)" },
  { id: "cat-2", name: "সবজি", color: "hsl(145, 45%, 42%)" },
  { id: "cat-3", name: "মশলা", color: "hsl(0, 84%, 60%)" },
  { id: "cat-4", name: "তেল/ঘি", color: "hsl(45, 80%, 50%)" },
  { id: "cat-5", name: "ফল", color: "hsl(280, 60%, 55%)" },
  { id: "cat-6", name: "অন্যান্য", color: "hsl(200, 50%, 50%)" },
];

const initialData: DayExpense[] = [
  {
    id: generateId(),
    date: "১.২.২৬",
    items: [{ id: generateId(), name: "ভাড়া", amount: 90, categoryId: "cat-1" }],
  },
  {
    id: generateId(),
    date: "২.২.২৬",
    items: [
      { id: generateId(), name: "আলু", amount: 40, categoryId: "cat-2" },
      { id: generateId(), name: "রসুন", amount: 50, categoryId: "cat-3" },
      { id: generateId(), name: "পিঁয়াজ", amount: 100, categoryId: "cat-3" },
      { id: generateId(), name: "আদা", amount: 100, categoryId: "cat-3" },
      { id: generateId(), name: "সরিষার তেল", amount: 140, categoryId: "cat-4" },
    ],
  },
  {
    id: generateId(),
    date: "৩.২.২৬",
    items: [
      { id: generateId(), name: "ভাড়া", amount: 90, categoryId: "cat-1" },
      { id: generateId(), name: "কুল", amount: 30, categoryId: "cat-5" },
      { id: generateId(), name: "বেগুন", amount: 50, categoryId: "cat-2" },
    ],
  },
  {
    id: generateId(),
    date: "৪.২.২৬",
    items: [
      { id: generateId(), name: "ভাড়া", amount: 90, categoryId: "cat-1" },
      { id: generateId(), name: "ডাল ভাজা", amount: 20, categoryId: "cat-6" },
    ],
  },
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<DayExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(CATEGORY_KEY);
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  }, [categories]);

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

  const addItem = (dayId: string, name: string, amount: number, categoryId?: string) => {
    const newItem: ExpenseItem = {
      id: generateId(),
      name,
      amount,
      categoryId,
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

  const addCategory = (name: string) => {
    const hue = Math.floor(Math.random() * 360);
    const newCat: Category = {
      id: generateId(),
      name,
      color: `hsl(${hue}, 60%, 50%)`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const grandTotal = expenses.reduce(
    (total, day) => total + day.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  return {
    expenses,
    categories,
    grandTotal,
    addDate,
    deleteDate,
    addItem,
    deleteItem,
    addCategory,
    deleteCategory,
  };
};
