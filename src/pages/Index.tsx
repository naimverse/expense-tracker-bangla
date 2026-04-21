import { useState } from "react";
import Header from "@/components/Header";
import DayCard from "@/components/DayCard";
import AddDateForm from "@/components/AddDateForm";
import MonthlySummary, { getMonthKey } from "@/components/MonthlySummary";
import CategoryManager from "@/components/CategoryManager";
import { useExpenses } from "@/hooks/useExpenses";
import { useLang } from "@/contexts/LanguageContext";

const Index = () => {
  const { expenses, categories, grandTotal, addDate, deleteDate, addItem, editItem, deleteItem, addCategory, deleteCategory } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { t, fmtNum } = useLang();

  const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
  const dateSortKey = (dateStr: string) => {
    const parts = bnToEn(dateStr).split(".").map((p) => parseInt(p));
    if (parts.length < 2 || parts.some(isNaN)) return 0;
    const [day, month, year = 0] = parts;
    return year * 10000 + month * 100 + day;
  };

  const filteredExpenses = (selectedMonth
    ? expenses.filter((day) => getMonthKey(day.date) === selectedMonth)
    : expenses
  )
    .slice()
    .sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));

  const filteredTotal = filteredExpenses.reduce(
    (total, day) => total + day.items.reduce((sum, item) => sum + item.amount, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header grandTotal={selectedMonth ? filteredTotal : grandTotal} />

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <AddDateForm onAdd={addDate} />

        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onDelete={deleteCategory}
        />

        <MonthlySummary
          expenses={expenses}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />

        {selectedMonth && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {t("showingDays", { n: fmtNum(filteredExpenses.length) })}
          </p>
        )}

        <div className="space-y-4">
          {filteredExpenses.map((dayExpense) => (
            <DayCard
              key={dayExpense.id}
              dayExpense={dayExpense}
              categories={categories}
              onAddItem={addItem}
              onEditItem={editItem}
              onDeleteItem={deleteItem}
              onDeleteDay={deleteDate}
            />
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {selectedMonth ? t("noExpensesMonth") : t("noExpenses")}
            </p>
            <p className="text-muted-foreground">{t("addDateToStart")}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
