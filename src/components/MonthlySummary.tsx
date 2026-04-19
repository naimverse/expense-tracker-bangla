import { TrendingUp, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import type { DayExpense } from "@/types/expense";

interface MonthlySummaryProps {
  expenses: DayExpense[];
  selectedMonth: string | null;
  onSelectMonth: (monthKey: string | null) => void;
}

export const parseDate = (dateStr: string): { month: number; year: string } | null => {
  const parts = dateStr.split(".");
  if (parts.length >= 2) {
    const bengaliToEnglish = (str: string) => {
      const bengaliNumerals = "০১২৩৪৫৬৭৮৯";
      return str.replace(/[০-৯]/g, (d) => bengaliNumerals.indexOf(d).toString());
    };

    const month = parseInt(bengaliToEnglish(parts[1])) - 1;
    const year = parts[2] ? bengaliToEnglish(parts[2]) : "26";

    if (month >= 0 && month < 12) {
      return { month, year };
    }
  }
  return null;
};

export const getMonthKey = (dateStr: string): string | null => {
  const parsed = parseDate(dateStr);
  return parsed ? `${parsed.month}-${parsed.year}` : null;
};

const MonthlySummary = ({ expenses, selectedMonth, onSelectMonth }: MonthlySummaryProps) => {
  const { t, fmtNum, monthName } = useLang();

  const monthlyData = expenses.reduce((acc, day) => {
    const parsed = parseDate(day.date);
    if (parsed) {
      const key = `${parsed.month}-${parsed.year}`;
      const dayTotal = day.items.reduce((sum, item) => sum + item.amount, 0);

      if (!acc[key]) {
        acc[key] = { key, month: parsed.month, year: parsed.year, total: 0, daysCount: 0 };
      }
      acc[key].total += dayTotal;
      acc[key].daysCount += 1;
    }
    return acc;
  }, {} as Record<string, { key: string; month: number; year: string; total: number; daysCount: number }>);

  const sortedMonths = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return b.year.localeCompare(a.year);
    return b.month - a.month;
  });

  if (sortedMonths.length === 0) return null;

  const maxTotal = Math.max(...sortedMonths.map((m) => m.total));

  return (
    <div className="date-card p-5 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-semibold text-foreground">{t("monthlyExpense")}</h2>
        </div>
        {selectedMonth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectMonth(null)}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <X className="h-4 w-4" />
            {t("clearFilter")}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {sortedMonths.map((data) => {
          const percentage = (data.total / maxTotal) * 100;
          const isSelected = selectedMonth === data.key;

          return (
            <div
              key={data.key}
              className={`animate-slide-in p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
              }`}
              onClick={() => onSelectMonth(isSelected ? null : data.key)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {monthName(data.month)} '{fmtNum(data.year)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({t("daysCount", { n: fmtNum(data.daysCount) })})
                  </span>
                </div>
                <span className="font-bold text-primary">{t("currency")}{fmtNum(data.total)}</span>
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
