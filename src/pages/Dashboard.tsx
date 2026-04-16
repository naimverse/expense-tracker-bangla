import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, PieChart, BarChart3 } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useExpenses } from "@/hooks/useExpenses";
import { parseDate } from "@/components/MonthlySummary";
import type { Category } from "@/types/expense";

const bengaliMonths = [
  "জানু", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন",
  "জুলাই", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"
];

const Dashboard = () => {
  const { expenses, categories } = useExpenses();

  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    categories.forEach((c) => { map[c.id] = c; });
    return map;
  }, [categories]);

  // Category-wise total
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((day) => {
      day.items.forEach((item) => {
        const catId = item.categoryId || "uncategorized";
        totals[catId] = (totals[catId] || 0) + item.amount;
      });
    });

    return Object.entries(totals).map(([catId, total]) => ({
      name: categoryMap[catId]?.name || "অশ্রেণিভুক্ত",
      value: total,
      color: categoryMap[catId]?.color || "hsl(0, 0%, 60%)",
    })).sort((a, b) => b.value - a.value);
  }, [expenses, categoryMap]);

  // Month-wise total
  const monthlyData = useMemo(() => {
    const totals: Record<string, { month: number; year: string; total: number }> = {};
    expenses.forEach((day) => {
      const parsed = parseDate(day.date);
      if (parsed) {
        const key = `${parsed.month}-${parsed.year}`;
        if (!totals[key]) totals[key] = { month: parsed.month, year: parsed.year, total: 0 };
        totals[key].total += day.items.reduce((s, i) => s + i.amount, 0);
      }
    });
    return Object.values(totals)
      .sort((a, b) => a.year.localeCompare(b.year) || a.month - b.month)
      .map((d) => ({
        name: `${bengaliMonths[d.month]} '${d.year}`,
        total: d.total,
      }));
  }, [expenses]);

  // Month + Category breakdown
  const monthCategoryData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    expenses.forEach((day) => {
      const parsed = parseDate(day.date);
      if (parsed) {
        const monthKey = `${bengaliMonths[parsed.month]} '${parsed.year}`;
        if (!data[monthKey]) data[monthKey] = {};
        day.items.forEach((item) => {
          const catName = categoryMap[item.categoryId || ""]?.name || "অশ্রেণিভুক্ত";
          data[monthKey][catName] = (data[monthKey][catName] || 0) + item.amount;
        });
      }
    });
    return Object.entries(data).map(([month, cats]) => ({
      name: month,
      ...cats,
    }));
  }, [expenses, categoryMap]);

  const allCatNames = useMemo(() => {
    const names = new Set<string>();
    monthCategoryData.forEach((d) => {
      Object.keys(d).forEach((k) => {
        if (k !== "name") names.add(k);
      });
    });
    return Array.from(names);
  }, [monthCategoryData]);

  const catColors = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => { map[c.name] = c.color; });
    map["অশ্রেণিভুক্ত"] = "hsl(0, 0%, 60%)";
    return map;
  }, [categories]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">ড্যাশবোর্ড</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Category Pie Chart */}
        <div className="date-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">ক্যাটাগরি অনুযায়ী খরচ</h2>
          </div>
          {categoryData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ৳${value}`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `৳${value}`} />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {categoryData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-foreground">{d.name}</span>
                    <span className="text-muted-foreground">৳{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">কোনো ডাটা নেই</p>
          )}
        </div>

        {/* Monthly Bar Chart */}
        <div className="date-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">মাস অনুযায়ী খরচ</h2>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `৳${value}`} />
                <Bar dataKey="total" fill="hsl(28, 85%, 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">কোনো ডাটা নেই</p>
          )}
        </div>

        {/* Month + Category Stacked Bar */}
        <div className="date-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">মাস ও ক্যাটাগরি ভিত্তিক</h2>
          </div>
          {monthCategoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthCategoryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => `৳${value}`} />
                  <Legend />
                  {allCatNames.map((catName) => (
                    <Bar
                      key={catName}
                      dataKey={catName}
                      stackId="a"
                      fill={catColors[catName] || "hsl(0, 0%, 60%)"}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">কোনো ডাটা নেই</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
