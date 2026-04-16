import { useState } from "react";
import Header from "@/components/Header";
import DayCard from "@/components/DayCard";
import AddDateForm from "@/components/AddDateForm";
import MonthlySummary, { getMonthKey } from "@/components/MonthlySummary";
import CategoryManager from "@/components/CategoryManager";
import { useExpenses } from "@/hooks/useExpenses";

const Index = () => {
  const { expenses, categories, grandTotal, addDate, deleteDate, addItem, deleteItem, addCategory, deleteCategory } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredExpenses = selectedMonth
    ? expenses.filter((day) => getMonthKey(day.date) === selectedMonth)
    : expenses;

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
            {filteredExpenses.length} দিনের খরচ দেখাচ্ছে
          </p>
        )}
        
        <div className="space-y-4">
          {filteredExpenses.map((dayExpense) => (
            <DayCard
              key={dayExpense.id}
              dayExpense={dayExpense}
              categories={categories}
              onAddItem={addItem}
              onDeleteItem={deleteItem}
              onDeleteDay={deleteDate}
            />
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {selectedMonth ? "এই মাসে কোনো খরচ নেই" : "কোনো খরচ নেই"}
            </p>
            <p className="text-muted-foreground">উপরে তারিখ যোগ করে শুরু করুন</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
