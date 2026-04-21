import { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import type {
  DayExpense,
  ExpenseItem,
  Category,
  CategoryBudget,
  IncomeEntry,
  MonthIncome,
} from "@/types/expense";

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultCategories: Omit<Category, "id">[] = [
  { name: "পরিবহন", color: "hsl(28, 85%, 55%)" },
  { name: "সবজি", color: "hsl(145, 45%, 42%)" },
  { name: "মশলা", color: "hsl(0, 84%, 60%)" },
  { name: "তেল/ঘি", color: "hsl(45, 80%, 50%)" },
  { name: "ফল", color: "hsl(280, 60%, 55%)" },
  { name: "অন্যান্য", color: "hsl(200, 50%, 50%)" },
];

export const useExpenses = () => {
  const { user } = useAuth();
  const { activeOwnerUid, isOwner } = useWorkspace();
  const ownerUid = activeOwnerUid || user?.uid || null;

  const [expenses, setExpenses] = useState<DayExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [incomes, setIncomes] = useState<MonthIncome[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to expenses
  useEffect(() => {
    if (!ownerUid) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const expensesRef = collection(db, "users", ownerUid, "expenses");
    const q = query(expensesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data: DayExpense[] = snap.docs.map((d) => {
        const raw = d.data() as { date: string; items?: ExpenseItem[] };
        return {
          id: d.id,
          date: raw.date,
          items: raw.items || [],
        };
      });
      setExpenses(data);
      setLoading(false);
    });

    return () => unsub();
  }, [ownerUid]);

  // Categories
  useEffect(() => {
    if (!ownerUid) {
      setCategories([]);
      return;
    }

    const catsRef = collection(db, "users", ownerUid, "categories");

    const unsub = onSnapshot(catsRef, async (snap) => {
      if (snap.empty && isOwner) {
        const batch = writeBatch(db);
        defaultCategories.forEach((c) => {
          const id = generateId();
          batch.set(doc(catsRef, id), c);
        });
        await batch.commit();
        return;
      }
      const data: Category[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, "id">),
      }));
      setCategories(data);
    });

    return () => unsub();
  }, [ownerUid, isOwner]);

  // Budgets (per month, per category)
  useEffect(() => {
    if (!ownerUid) {
      setBudgets([]);
      return;
    }
    const ref = collection(db, "users", ownerUid, "budgets");
    const unsub = onSnapshot(ref, (snap) => {
      const data: CategoryBudget[] = snap.docs.map((d) => {
        const raw = d.data() as Omit<CategoryBudget, "id">;
        return { id: d.id, ...raw };
      });
      setBudgets(data);
    });
    return () => unsub();
  }, [ownerUid]);

  // Incomes (per month doc, with entries[] inside)
  useEffect(() => {
    if (!ownerUid) {
      setIncomes([]);
      return;
    }
    const ref = collection(db, "users", ownerUid, "incomes");
    const unsub = onSnapshot(ref, (snap) => {
      const data: MonthIncome[] = snap.docs.map((d) => {
        const raw = d.data() as { entries?: IncomeEntry[] };
        return { monthKey: d.id, entries: raw.entries || [] };
      });
      setIncomes(data);
    });
    return () => unsub();
  }, [ownerUid]);

  const addDate = async (date: string) => {
    if (!ownerUid) return;
    const id = generateId();
    await setDoc(doc(db, "users", ownerUid, "expenses", id), {
      date,
      items: [],
      createdAt: Date.now(),
    });
  };

  const deleteDate = async (dayId: string) => {
    if (!ownerUid) return;
    await deleteDoc(doc(db, "users", ownerUid, "expenses", dayId));
  };

  const addItem = async (
    dayId: string,
    name: string,
    amount: number,
    categoryId?: string
  ) => {
    if (!ownerUid) return;
    const day = expenses.find((d) => d.id === dayId);
    if (!day) return;
    const newItem: ExpenseItem = { id: generateId(), name, amount, categoryId };
    await setDoc(
      doc(db, "users", ownerUid, "expenses", dayId),
      { items: [...day.items, newItem] },
      { merge: true }
    );
  };

  const editItem = async (
    dayId: string,
    itemId: string,
    name: string,
    amount: number,
    categoryId?: string
  ) => {
    if (!ownerUid) return;
    const day = expenses.find((d) => d.id === dayId);
    if (!day) return;
    await setDoc(
      doc(db, "users", ownerUid, "expenses", dayId),
      {
        items: day.items.map((i) =>
          i.id === itemId ? { ...i, name, amount, categoryId } : i
        ),
      },
      { merge: true }
    );
  };

  const deleteItem = async (dayId: string, itemId: string) => {
    if (!ownerUid) return;
    const day = expenses.find((d) => d.id === dayId);
    if (!day) return;
    await setDoc(
      doc(db, "users", ownerUid, "expenses", dayId),
      { items: day.items.filter((i) => i.id !== itemId) },
      { merge: true }
    );
  };

  const addCategory = async (name: string) => {
    if (!ownerUid) return;
    const hue = Math.floor(Math.random() * 360);
    const id = generateId();
    const newCat: Category = { id, name, color: `hsl(${hue}, 60%, 50%)` };
    await setDoc(doc(db, "users", ownerUid, "categories", id), {
      name: newCat.name,
      color: newCat.color,
    });
    return newCat;
  };

  const deleteCategory = async (catId: string) => {
    if (!ownerUid) return;
    await deleteDoc(doc(db, "users", ownerUid, "categories", catId));
  };

  // ---- Budgets ----
  const setBudget = async (monthKey: string, categoryId: string, amount: number) => {
    if (!ownerUid) return;
    const id = `${monthKey}_${categoryId}`;
    if (!amount || amount <= 0) {
      await deleteDoc(doc(db, "users", ownerUid, "budgets", id));
      return;
    }
    await setDoc(doc(db, "users", ownerUid, "budgets", id), {
      monthKey,
      categoryId,
      amount,
    });
  };

  const clearBudget = async (monthKey: string, categoryId: string) => {
    if (!ownerUid) return;
    const id = `${monthKey}_${categoryId}`;
    await deleteDoc(doc(db, "users", ownerUid, "budgets", id));
  };

  // ---- Incomes ----
  const getMonthIncome = (monthKey: string): IncomeEntry[] =>
    incomes.find((i) => i.monthKey === monthKey)?.entries || [];

  const addIncome = async (monthKey: string, source: string, amount: number) => {
    if (!ownerUid) return;
    const current = getMonthIncome(monthKey);
    const next: IncomeEntry[] = [
      ...current,
      { id: generateId(), source, amount },
    ];
    await setDoc(
      doc(db, "users", ownerUid, "incomes", monthKey),
      { entries: next },
      { merge: true }
    );
  };

  const deleteIncome = async (monthKey: string, entryId: string) => {
    if (!ownerUid) return;
    const current = getMonthIncome(monthKey);
    const next = current.filter((e) => e.id !== entryId);
    await setDoc(
      doc(db, "users", ownerUid, "incomes", monthKey),
      { entries: next },
      { merge: true }
    );
  };

  const grandTotal = expenses.reduce(
    (total, day) => total + day.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  return {
    expenses,
    categories,
    budgets,
    incomes,
    grandTotal,
    loading,
    addDate,
    deleteDate,
    addItem,
    editItem,
    deleteItem,
    addCategory,
    deleteCategory,
    setBudget,
    clearBudget,
    getMonthIncome,
    addIncome,
    deleteIncome,
  };
};
