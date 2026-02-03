import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExpenseItem as ExpenseItemType } from "@/types/expense";

interface ExpenseItemProps {
  item: ExpenseItemType;
  onDelete: (id: string) => void;
}

const ExpenseItem = ({ item, onDelete }: ExpenseItemProps) => {
  return (
    <div className="item-row group animate-slide-in">
      <span className="text-foreground font-medium">{item.name}</span>
      <div className="flex items-center gap-3">
        <span className="text-primary font-semibold">৳{item.amount}</span>
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
