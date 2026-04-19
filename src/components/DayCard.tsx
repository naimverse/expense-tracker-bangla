import { Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpenseItem from "./ExpenseItem";
import AddItemForm from "./AddItemForm";
import { useLang } from "@/contexts/LanguageContext";
import type { DayExpense, Category } from "@/types/expense";

interface DayCardProps {
  dayExpense: DayExpense;
  categories: Category[];
  onAddItem: (dayId: string, name: string, amount: number, categoryId?: string) => void;
  onDeleteItem: (dayId: string, itemId: string) => void;
  onDeleteDay: (dayId: string) => void;
}

const DayCard = ({ dayExpense, categories, onAddItem, onDeleteItem, onDeleteDay }: DayCardProps) => {
  const total = dayExpense.items.reduce((sum, item) => sum + item.amount, 0);
  const { t, fmtNum } = useLang();

  return (
    <div className="date-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{dayExpense.date}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="total-badge">
            {t("dayTotal")}: {t("currency")}{fmtNum(total)}
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
            category={categories.find((c) => c.id === item.categoryId)}
            onDelete={(itemId) => onDeleteItem(dayExpense.id, itemId)}
          />
        ))}
      </div>

      {dayExpense.items.length === 0 && (
        <p className="text-muted-foreground text-center py-4">{t("noItemsYet")}</p>
      )}

      <AddItemForm
        categories={categories}
        onAdd={(name, amount, categoryId) => onAddItem(dayExpense.id, name, amount, categoryId)}
      />
    </div>
  );
};

export default DayCard;
