import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import type { ExpenseItem as ExpenseItemType, Category } from "@/types/expense";

interface ExpenseItemProps {
  item: ExpenseItemType;
  category?: Category;
  onDelete: (id: string) => void;
}

const ExpenseItem = ({ item, category, onDelete }: ExpenseItemProps) => {
  const { t, fmtNum } = useLang();
  return (
    <div className="item-row group animate-slide-in">
      <div className="flex items-center gap-2">
        {category && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: category.color }}
          />
        )}
        <span className="text-foreground font-medium">{item.name}</span>
        {category && (
          <span className="text-xs text-muted-foreground">({category.name})</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-primary font-semibold">{t("currency")}{fmtNum(item.amount)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExpenseItem;
