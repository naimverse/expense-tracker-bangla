import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLang } from "@/contexts/LanguageContext";
import type { ExpenseItem as ExpenseItemType, Category } from "@/types/expense";

interface ExpenseItemProps {
  item: ExpenseItemType;
  category?: Category;
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, amount: number, categoryId?: string) => void;
}

const ExpenseItem = ({ item, category, categories, onDelete, onEdit }: ExpenseItemProps) => {
  const { t, fmtNum } = useLang();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(String(item.amount));
  const [categoryId, setCategoryId] = useState<string>(item.categoryId || "");

  const openEdit = () => {
    setName(item.name);
    setAmount(String(item.amount));
    setCategoryId(item.categoryId || "");
    setEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    onEdit(item.id, name.trim(), parseFloat(amount), categoryId || undefined);
    setEditOpen(false);
  };

  return (
    <>
      <div className="item-row group animate-slide-in">
        <div className="flex items-center gap-2 min-w-0">
          {category && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}
          <span className="text-foreground font-medium truncate">{item.name}</span>
          {category && (
            <span className="text-xs text-muted-foreground">({category.name})</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-primary font-semibold">{t("currency")}{fmtNum(item.amount)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={openEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editItemTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("itemNamePlaceholder")}
              className="input-field"
            />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("amountPlaceholder")}
              className="input-field"
            />
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="input-field">
                <SelectValue placeholder={t("pickCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" className="add-button">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDeleteItemDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(item.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseItem;
