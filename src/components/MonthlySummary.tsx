import { TrendingUp, Calendar } from "lucide-react";
import type { DayExpense } from "@/types/expense";

interface MonthlySummaryProps {
  expenses: DayExpense[];
}

const bengaliMonths = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const parseDate = (dateStr: string): { month: number; year: string } | null => {
  // Parse dates like "১.২.২৬" or "1.2.26"
  const parts = dateStr.split(".");
  if (parts.length >= 2) {
    // Convert Bengali numerals to English
    const bengaliToEnglish = (str: string) => {
      const bengaliNumerals = "০১২৩৪৫৬৭৮৯";
      return str.replace(/[০-৯]/g, (d) => bengaliNumerals.indexOf(d).toString());
    };
    
    const month = parseInt(bengaliToEnglish(parts[1])) - 1; // 0-indexed
    const year = parts[2] ? bengaliToEnglish(parts[2]) : "26";
    
    if (month >= 0 && month < 12) {
      return { month, year };
    }
  }
  return null;
};

const MonthlySummary = ({ expenses }: MonthlySummaryProps) => {
  // Group expenses by month
  const monthlyData = expenses.reduce((acc, day) => {
    const parsed = parseDate(day.date);
    if (parsed) {
      const key = `${parsed.month}-${parsed.year}`;
      const dayTotal = day.items.reduce((sum, item) => sum + item.amount, 0);
      
      if (!acc[key]) {
        acc[key] = {
          month: parsed.month,
          year: parsed.year,
          total: 0,
          daysCount: 0,
        };
      }
      acc[key].total += dayTotal;
      acc[key].daysCount += 1;
    }
    return acc;
  }, {} as Record<string, { month: number; year: string; total: number; daysCount: number }>);

  const sortedMonths = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return b.year.localeCompare(a.year);
    return b.month - a.month;
  });

  if (sortedMonths.length === 0) {
    return null;
  }

  const maxTotal = Math.max(...sortedMonths.map((m) => m.total));

  return (
    <div className="date-card p-5 mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-secondary" />
        <h2 className="text-lg font-semibold text-foreground">মাসিক খরচ</h2>
      </div>

      <div className="space-y-3">
        {sortedMonths.map((data) => {
          const percentage = (data.total / maxTotal) * 100;
          return (
            <div key={`${data.month}-${data.year}`} className="animate-slide-in">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {bengaliMonths[data.month]} '{data.year}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({data.daysCount} দিন)
                  </span>
                </div>
                <span className="font-bold text-primary">৳{data.total}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlySummary;
