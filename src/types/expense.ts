export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  categoryId?: string;
}

export interface DayExpense {
  id: string;
  date: string;
  items: ExpenseItem[];
}
