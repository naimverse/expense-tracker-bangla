import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/contexts/LanguageContext";
import type { Category } from "@/types/expense";

interface AddItemFormProps {
  onAdd: (name: string, amount: number, categoryId?: string) => void;
  categories: Category[];
}

const AddItemForm = ({ onAdd, categories }: AddItemFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const { t } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && amount) {
      onAdd(name.trim(), parseFloat(amount), categoryId || undefined);
      setName("");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t("itemNamePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field flex-1"
        />
        <Input
          type="number"
          placeholder={t("amountPlaceholder")}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field w-24"
        />
      </div>
      <div className="flex gap-2">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="flex-1 input-field">
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
        <Button type="submit" size="icon" className="add-button shrink-0">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default AddItemForm;
