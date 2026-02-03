export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

export interface DayExpense {
  id: string;
  date: string;
  items: ExpenseItem[];
}
