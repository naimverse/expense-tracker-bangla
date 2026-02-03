import Header from "@/components/Header";
import DayCard from "@/components/DayCard";
import AddDateForm from "@/components/AddDateForm";
import MonthlySummary from "@/components/MonthlySummary";
import { useExpenses } from "@/hooks/useExpenses";

const Index = () => {
  const { expenses, grandTotal, addDate, deleteDate, addItem, deleteItem } = useExpenses();

  return (
    <div className="min-h-screen bg-background">
      <Header grandTotal={grandTotal} />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <AddDateForm onAdd={addDate} />
        
        <MonthlySummary expenses={expenses} />
        
        <div className="space-y-4">
          {expenses.map((dayExpense) => (
            <DayCard
              key={dayExpense.id}
              dayExpense={dayExpense}
              onAddItem={addItem}
              onDeleteItem={deleteItem}
              onDeleteDay={deleteDate}
            />
          ))}
        </div>

        {expenses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">কোনো খরচ নেই</p>
            <p className="text-muted-foreground">উপরে তারিখ যোগ করে শুরু করুন</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
