import { Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpenseItem from "./ExpenseItem";
import AddItemForm from "./AddItemForm";
import type { DayExpense } from "@/types/expense";

interface DayCardProps {
  dayExpense: DayExpense;
  onAddItem: (dayId: string, name: string, amount: number) => void;
  onDeleteItem: (dayId: string, itemId: string) => void;
  onDeleteDay: (dayId: string) => void;
}

const DayCard = ({ dayExpense, onAddItem, onDeleteItem, onDeleteDay }: DayCardProps) => {
  const total = dayExpense.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="date-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{dayExpense.date}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="total-badge">
            মোট: ৳{total}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDeleteDay(dayExpense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {dayExpense.items.map((item) => (
          <ExpenseItem
            key={item.id}
            item={item}
            onDelete={(itemId) => onDeleteItem(dayExpense.id, itemId)}
          />
        ))}
      </div>

      {dayExpense.items.length === 0 && (
        <p className="text-muted-foreground text-center py-4">এখনো কোনো আইটেম যোগ হয়নি</p>
      )}

      <AddItemForm onAdd={(name, amount) => onAddItem(dayExpense.id, name, amount)} />
    </div>
  );
};

export default DayCard;
