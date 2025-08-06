"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Chart.js and react-chartjs-2
import { Pie, Bar, Line } from "react-chartjs-2";
import DoubleRangeSlider from "@/components/DoubleRangeSlider";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

// Use consistent category keys for data storage
const EXPENSE_CATEGORY_KEYS = [
  "food",
  "rent",
  "utilities",
  "travel",
  "entertainment",
];

const getExpenseCategories = (t: (key: string) => string) => [
  t("category.food"),
  t("category.rent"),
  t("category.utilities"),
  t("category.travel"),
  t("category.entertainment"),
];

// Budget allocation percentages based on income
const getBudgetPercentages = () => ({
  food: 0.2, // 20% of income
  rent: 0.3, // 30% of income
  utilities: 0.15, // 15% of income
  travel: 0.2, // 20% of income
  entertainment: 0.15, // 15% of income
});

type Expense = {
  date: string;
  category: string;
  amount: number;
  title: string;
};

type Income = {
  date: string;
  amount: number;
};

function getSessionData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from sessionStorage:`, error);
    return fallback;
  }
}

function uniqueMonths(transactions: (Expense | Income)[]) {
  const months = new Set<string>();
  transactions.forEach((t) => {
    const d = new Date(t.date);
    months.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
  });
  return Array.from(months)
    .map((m) => {
      const [year, month] = m.split("-");
      return { year: Number(year), month: Number(month) };
    })
    .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year));
}

function formatMonthLabel(year: number, month: number) {
  return `${new Date(year, month - 1).toLocaleString("default", {
    month: "short",
  })} ${year}`;
}

export default function StatsPage() {
  const { t } = useLanguage();

  // State - initialize as empty arrays to avoid hydration mismatch
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    type: "all", // "all" | "expense" | "income"
  });

  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000]);

  // Load data from sessionStorage on mount (client-side only)
  useEffect(() => {
    console.log("Stats component mounted, loading data...");
    const savedExpenses = getSessionData<Expense[]>("expenses", []);
    const savedIncomes = getSessionData<Income[]>("incomes", []);
    console.log("Stats loading data:", { savedExpenses, savedIncomes });
    console.log("Stats expenses length:", savedExpenses.length);
    console.log("Stats incomes length:", savedIncomes.length);

    // Always set the data, even if empty, but mark as loaded
    setExpenses(savedExpenses);
    setIncomes(savedIncomes);
    setIsDataLoaded(true);
    console.log("Stats data loaded successfully");
  }, []);

  // Filtering logic
  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (filters.category && e.category !== filters.category) return false;
    if (e.amount < amountRange[0] || e.amount > amountRange[1]) return false;
    if (filters.type === "income") return false;
    return true;
  });

  const filteredIncomes = incomes.filter((i) => {
    const date = new Date(i.date);
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (i.amount < amountRange[0] || i.amount > amountRange[1]) return false;
    if (filters.type === "expense") return false;
    return true;
  });

  const filteredTransactions = [
    ...filteredExpenses.map((e) => ({ ...e, type: "expense" as const })),
    ...filteredIncomes.map((i) => ({ ...i, type: "income" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pie Chart: Expense Category Breakdown
  const expenseCategories = getExpenseCategories(t);
  const categoryTotals = expenseCategories.map((cat, index) => {
    const categoryKey = EXPENSE_CATEGORY_KEYS[index];
    return filteredExpenses
      .filter((e) => e.category === categoryKey)
      .reduce((sum, e) => sum + e.amount, 0);
  });
  const totalExpense = categoryTotals.reduce((a, b) => a + b, 0);

  const pieData = {
    labels: expenseCategories,
    datasets: [
      {
        data: categoryTotals,
        backgroundColor: [
          "#ef4444", // red-500
          "#f59e0b", // amber-500
          "#3b82f6", // blue-500
          "#10b981", // emerald-500
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Calculate total income for budget calculations
  const totalIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);

  // Calculate dynamic budget limits based on income percentages
  const budgetPercentages = getBudgetPercentages();
  const dynamicBudgetLimits = expenseCategories.map((cat, index) => {
    const categoryKey = EXPENSE_CATEGORY_KEYS[index];
    return Math.round(
      totalIncome *
        budgetPercentages[categoryKey as keyof typeof budgetPercentages]
    );
  });

  // Bar Chart: Budget vs Actual
  const barData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Spent",
        data: categoryTotals,
        backgroundColor: "#ef4444",
        borderRadius: 4,
      },
      {
        label: "Budget",
        data: dynamicBudgetLimits,
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        borderRadius: 4,
      },
    ],
  };

  // Line Chart: Monthly Trends
  const allMonths = uniqueMonths([...expenses, ...incomes]);
  const lineLabels = allMonths.map((m) => formatMonthLabel(m.year, m.month));
  const monthlyExpense = allMonths.map(({ year, month }) =>
    expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((sum, e) => sum + e.amount, 0)
  );
  const monthlyIncome = allMonths.map(({ year, month }) =>
    incomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((sum, i) => sum + i.amount, 0)
  );

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: t("profile.expense"),
        data: monthlyExpense,
        borderColor: "#ef4444",
        backgroundColor: "#fca5a5",
        tension: 0.3,
        fill: false,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: t("profile.income"),
        data: monthlyIncome,
        borderColor: "#10b981",
        backgroundColor: "#6ee7b7",
        tension: 0.3,
        fill: false,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Progress bars for each category
  function ProgressBar({ value, max }: { value: number; max: number }) {
    const percent = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            percent < 80
              ? "bg-emerald-500"
              : percent < 100
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  }

  // Responsive layout
  return (
    <div className="min-h-screen bg-white pt-28 px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
            {t("stats.title")}
          </h1>
          <p className="text-slate-600 text-lg font-light">
            {t("stats.subtitle")}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {t("home.totalExpenses")}
              </h3>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-light text-red-600 mb-2">
              ${totalExpense.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">
              {filteredExpenses.length} {t("home.transactions")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {t("home.totalIncome")}
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-light text-green-600 mb-2">
              $
              {filteredIncomes
                .reduce((sum, i) => sum + i.amount, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">
              {filteredIncomes.length} {t("home.transactions")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {t("home.netBalance")}
              </h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <p
              className={`text-3xl font-light mb-2 ${
                filteredIncomes.reduce((sum, i) => sum + i.amount, 0) -
                  totalExpense >=
                0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              $
              {(
                filteredIncomes.reduce((sum, i) => sum + i.amount, 0) -
                totalExpense
              ).toLocaleString()}
            </p>
            <p className="text-sm text-slate-500">
              {filteredTransactions.length} {t("home.transactions")}{" "}
              {t("profile.total")}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              {t("stats.advancedFilters")}
            </h3>
            <button
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              onClick={() => {
                setFilters({
                  dateFrom: "",
                  dateTo: "",
                  category: "",
                  minAmount: "",
                  maxAmount: "",
                  type: "all",
                });
                setAmountRange([0, 10000]);
              }}
            >
              {t("stats.resetFilters")}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("stats.dateFrom")}
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, dateFrom: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("stats.dateTo")}
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, dateTo: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("stats.category")}
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.category}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value }))
                }
              >
                <option value="">
                  {t("stats.all")} {t("stats.category")}
                </option>
                {expenseCategories.map((cat, index) => (
                  <option key={cat} value={EXPENSE_CATEGORY_KEYS[index]}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("stats.amountRange")}
              </label>
              <DoubleRangeSlider
                min={0}
                max={10000}
                step={100}
                value={amountRange}
                onChange={setAmountRange}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("stats.type")}
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.type}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, type: e.target.value }))
                }
              >
                <option value="all">
                  {t("stats.all")} {t("home.transactions")}
                </option>
                <option value="expense">
                  {t("stats.expense")} {t("common.only")}
                </option>
                <option value="income">
                  {t("stats.income")} {t("common.only")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
              {t("stats.expenseBreakdownByCategory")}
            </h2>
            <div className="w-full flex flex-col items-center">
              <div className="w-64 h-64 mb-6">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom" as const,
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="w-full space-y-4">
                {expenseCategories.map((cat, idx) => (
                  <div key={cat} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-slate-800">
                        {cat}
                      </span>
                      <span className="text-sm text-slate-600">
                        ${categoryTotals[idx].toLocaleString()} / $
                        {dynamicBudgetLimits[idx].toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar
                      value={categoryTotals[idx]}
                      max={dynamicBudgetLimits[idx]}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>
                        {Math.round(
                          (categoryTotals[idx] / dynamicBudgetLimits[idx]) * 100
                        )}
                        % used
                      </span>
                      <span>
                        ${dynamicBudgetLimits[idx] - categoryTotals[idx]}{" "}
                        remaining
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
              {t("stats.budgetVsActualSpending")}
            </h2>
            <div className="w-full h-80">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return "$" + value.toLocaleString();
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">
            {t("stats.monthlyTrends")}
          </h2>
          <div className="w-full h-80">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: {
                        size: 12,
                        weight: "600",
                      },
                    },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        return `${
                          context.dataset.label
                        }: $${context.parsed.y.toLocaleString()}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "#e5e7eb",
                      drawBorder: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                      callback: function (value) {
                        return "$" + value.toLocaleString();
                      },
                    },
                  },
                },
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                elements: {
                  line: {
                    tension: 0.3,
                  },
                  point: {
                    hoverRadius: 8,
                    radius: 6,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              {t("stats.filteredTransactions")} ({filteredTransactions.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">
                {t("stats.showingFilteredResults")}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-left font-semibold text-slate-700">
                    {t("history.date")}
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-slate-700">
                    {t("stats.type")}
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-slate-700">
                    {t("history.category")}/{t("history.transactionTitle")}
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-slate-700">
                    {t("history.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-slate-400 py-12"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-slate-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <p className="text-slate-500 font-medium">
                          {t("history.noTransactions")}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {t("stats.tryAdjustingFilters")}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredTransactions.map((transaction, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors duration-200 ${
                      transaction.type === "expense"
                        ? "bg-red-50/30"
                        : "bg-green-50/30"
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === "expense"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {transaction.type === "expense"
                          ? t("profile.expense")
                          : t("profile.income")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-slate-800">
                          {transaction.type === "expense"
                            ? (transaction as Expense).title ||
                              getExpenseCategories(t)[
                                EXPENSE_CATEGORY_KEYS.indexOf(
                                  (transaction as Expense).category
                                )
                              ]
                            : t("profile.income")}
                        </span>
                        {transaction.type === "expense" &&
                          (transaction as Expense).category && (
                            <span className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {
                                getExpenseCategories(t)[
                                  EXPENSE_CATEGORY_KEYS.indexOf(
                                    (transaction as Expense).category
                                  )
                                ]
                              }
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold text-lg ${
                          transaction.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
