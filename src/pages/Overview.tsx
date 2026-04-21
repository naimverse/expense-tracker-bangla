import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useExpenses } from "@/hooks/useExpenses";
import { parseDate } from "@/components/MonthlySummary";
import { useLang } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const Overview = () => {
  const {
    expenses,
    categories,
    budgets,
    incomes,
    setBudget,
    addIncome,
    deleteIncome,
  } = useExpenses();
  const { t, fmtNum, monthName } = useLang();

  // Build available months from expenses + incomes + budgets
  const monthOptions = useMemo(() => {
    const set = new Map<string, { key: string; month: number; year: string }>();
    expenses.forEach((d) => {
      const p = parseDate(d.date);
      if (p) set.set(`${p.month}-${p.year}`, { key: `${p.month}-${p.year}`, ...p });
    });
    incomes.forEach((i) => {
      if (set.has(i.monthKey)) return;
      const [m, y] = i.monthKey.split("-");
      set.set(i.monthKey, { key: i.monthKey, month: parseInt(m), year: y });
    });
    budgets.forEach((b) => {
      if (set.has(b.monthKey)) return;
      const [m, y] = b.monthKey.split("-");
      set.set(b.monthKey, { key: b.monthKey, month: parseInt(m), year: y });
    });
    // Always include current month
    const now = new Date();
    const currentKey = `${now.getMonth()}-${String(now.getFullYear() % 100).padStart(2, "0")}`;
    if (!set.has(currentKey)) {
      set.set(currentKey, {
        key: currentKey,
        month: now.getMonth(),
        year: String(now.getFullYear() % 100).padStart(2, "0"),
      });
    }
    return Array.from(set.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year.localeCompare(a.year);
      return b.month - a.month;
    });
  }, [expenses, incomes, budgets]);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => monthOptions[0]?.key || ""
  );
  const activeKey = selectedMonth || monthOptions[0]?.key || "";

  // Aggregations for active month
  const monthExpenses = useMemo(() => {
    return expenses.filter((d) => {
      const p = parseDate(d.date);
      return p && `${p.month}-${p.year}` === activeKey;
    });
  }, [expenses, activeKey]);

  const totalExpense = monthExpenses.reduce(
    (s, d) => s + d.items.reduce((ss, i) => ss + i.amount, 0),
    0
  );

  const monthIncomeEntries =
    incomes.find((i) => i.monthKey === activeKey)?.entries || [];
  const totalIncome = monthIncomeEntries.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  // Per-category totals for active month
  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    monthExpenses.forEach((d) => {
      d.items.forEach((it) => {
        const k = it.categoryId || "__none__";
        map[k] = (map[k] || 0) + it.amount;
      });
    });
    return map;
  }, [monthExpenses]);

  const monthBudgets = useMemo(
    () => budgets.filter((b) => b.monthKey === activeKey),
    [budgets, activeKey]
  );

  const budgetMap = useMemo(() => {
    const m: Record<string, number> = {};
    monthBudgets.forEach((b) => {
      m[b.categoryId] = b.amount;
    });
    return m;
  }, [monthBudgets]);

  const totalBudget = monthBudgets.reduce((s, b) => s + b.amount, 0);

  // Income form
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [pendingDeleteIncome, setPendingDeleteIncome] = useState<string | null>(null);

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeSource.trim() || !incomeAmount) return;
    addIncome(activeKey, incomeSource.trim(), parseFloat(incomeAmount));
    setIncomeSource("");
    setIncomeAmount("");
  };

  const currency = t("currency");
  const activeMonthLabel = (() => {
    const opt = monthOptions.find((m) => m.key === activeKey);
    return opt ? `${monthName(opt.month)} '${fmtNum(opt.year)}` : "";
  })();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/app"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title={t("backToApp")}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">{t("overview")}</h1>
          <div className="ml-auto">
            <LanguageToggle variant="icon" />
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Month selector */}
        <div className="date-card p-5">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {t("selectMonth")}
          </label>
          <Select value={activeKey} onValueChange={setSelectedMonth}>
            <SelectTrigger className="input-field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {monthName(m.month)} '{fmtNum(m.year)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="date-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">{t("totalIncome")}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {currency}
              {fmtNum(totalIncome)}
            </p>
          </div>
          <div className="date-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm">{t("totalExpense")}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {currency}
              {fmtNum(totalExpense)}
            </p>
          </div>
          <div className="date-card p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">{t("balance")}</span>
            </div>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {currency}
              {fmtNum(balance)}
            </p>
          </div>
        </div>

        {/* Income vs expense bar */}
        {totalIncome > 0 && (
          <div className="date-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {t("expenseVsIncome")}
              </span>
              <span className="text-sm text-muted-foreground">
                {fmtNum(Math.round((totalExpense / totalIncome) * 100))}%
              </span>
            </div>
            <Progress
              value={Math.min(100, (totalExpense / totalIncome) * 100)}
              className="h-3"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {totalExpense > totalIncome
                ? t("incomeExceeded")
                : t("incomeRemaining", {
                    n: `${currency}${fmtNum(totalIncome - totalExpense)}`,
                  })}
            </p>
          </div>
        )}

        {/* Income entries */}
        <div className="date-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {t("monthlyIncome")} — {activeMonthLabel}
            </h2>
          </div>

          <form onSubmit={handleAddIncome} className="flex gap-2 mb-4">
            <Input
              placeholder={t("incomeSourcePlaceholder")}
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value)}
              className="input-field flex-1"
            />
            <Input
              type="number"
              placeholder={t("amountPlaceholder")}
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              className="input-field w-28"
            />
            <Button type="submit" size="icon" className="add-button shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
          </form>

          {monthIncomeEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              {t("noIncomeYet")}
            </p>
          ) : (
            <ul className="space-y-2">
              {monthIncomeEntries.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-foreground">{e.source}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      {currency}
                      {fmtNum(e.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setPendingDeleteIncome(e.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category budgets */}
        <div className="date-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">
              {t("categoryBudgets")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {t("budgetOptionalHint")}
          </p>

          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">
              {t("noCategoriesYet")}
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const spent = categorySpend[cat.id] || 0;
                const budget = budgetMap[cat.id] || 0;
                const hasBudget = budget > 0;
                const pct = hasBudget ? (spent / budget) * 100 : 0;
                const exceeded = hasBudget && spent > budget;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-foreground truncate">
                          {cat.name}
                        </span>
                        {hasBudget &&
                          (exceeded ? (
                            <span className="flex items-center gap-1 text-xs text-destructive">
                              <AlertTriangle className="h-3 w-3" />
                              {t("exceeded")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <CheckCircle2 className="h-3 w-3" />
                              {t("withinBudget")}
                            </span>
                          ))}
                      </div>
                      <Input
                        type="number"
                        placeholder={t("budgetPlaceholder")}
                        defaultValue={budget || ""}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (isNaN(val)) {
                            setBudget(activeKey, cat.id, 0);
                          } else if (val !== budget) {
                            setBudget(activeKey, cat.id, val);
                          }
                        }}
                        className="input-field w-28 text-right"
                      />
                    </div>

                    {hasBudget ? (
                      <>
                        <Progress
                          value={Math.min(100, pct)}
                          className={`h-2 ${exceeded ? "[&>div]:bg-destructive" : ""}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {t("spent")}: {currency}
                            {fmtNum(spent)} / {currency}
                            {fmtNum(budget)}
                          </span>
                          <span className={exceeded ? "text-destructive font-medium" : ""}>
                            {fmtNum(Math.round(pct))}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {t("spent")}: {currency}
                        {fmtNum(spent)} · {t("noBudgetSet")}
                      </p>
                    )}
                  </div>
                );
              })}

              {totalBudget > 0 && (
                <div className="border-t border-border pt-3 mt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("totalBudget")}</span>
                  <span className="font-semibold text-foreground">
                    {currency}
                    {fmtNum(totalBudget)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AlertDialog
        open={!!pendingDeleteIncome}
        onOpenChange={(o) => !o && setPendingDeleteIncome(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDeleteIncomeDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteIncome) deleteIncome(activeKey, pendingDeleteIncome);
                setPendingDeleteIncome(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Overview;
