import { useState } from "react";
import { Tags, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LanguageContext";
import type { Category } from "@/types/expense";

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
}

const CategoryManager = ({ categories, onAdd, onDelete }: CategoryManagerProps) => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t, fmtNum } = useLang();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  return (
    <div className="date-card p-5 mb-6 animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left"
      >
        <Tags className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">{t("categoriesTitle")}</h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {t("categoriesCount", { n: fmtNum(categories.length) })}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder={t("newCategoryPlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field flex-1"
            />
            <Button type="submit" size="icon" className="add-button shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
