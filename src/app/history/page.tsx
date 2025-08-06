"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import ExpenseBarChart from "@/components/ExpenseBarChart";
import { useLanguage } from "@/contexts/LanguageContext";

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

function setSessionData<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to sessionStorage:`, error);
  }
}

export default function HistoryPage() {
  const { t } = useLanguage();
  // State - initialize as empty arrays to avoid hydration mismatch
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from sessionStorage on mount (client-side only)
  useEffect(() => {
    console.log("History component mounted, loading data...");
    const savedExpenses = getSessionData("expenses", []);
    const savedIncomes = getSessionData("incomes", []);
    console.log("History loading data:", { savedExpenses, savedIncomes });

    // Always set the data, even if empty, but mark as loaded
    setExpenses(savedExpenses);
    setIncomes(savedIncomes);
    setIsDataLoaded(true);
    console.log("History data loaded successfully");
  }, []);

  const handleDeleteTransaction = (item: Expense | Income, index: number) => {
    const isExpense = "category" in item;

    if (isExpense) {
      const newExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(newExpenses);
      if (isDataLoaded) {
        setSessionData("expenses", newExpenses);
      }
    } else {
      const newIncomes = incomes.filter((_, i) => i !== index);
      setIncomes(newIncomes);
      if (isDataLoaded) {
        setSessionData("incomes", newIncomes);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
            {t("history.title")}
          </h1>
          <p className="text-slate-600 text-lg font-light">
            {t("history.subtitle")}
          </p>
        </div>

        {/* All Transactions */}
        <div className="w-full mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-1">
                  {t("history.title")}
                </h3>
                <p className="text-slate-500 text-sm">
                  {t("history.subtitle")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-500 font-medium">
                  {[...expenses, ...incomes].length} {t("profile.total")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {[...expenses, ...incomes]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((item, index) => {
                  const isExpense = "category" in item;
                  const originalIndex = isExpense
                    ? expenses.findIndex((e) => e === item)
                    : incomes.findIndex((i) => i === item);

                  return (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 hover:bg-gradient-to-r hover:from-white hover:to-slate-50 transition-all duration-300 ease-out transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isExpense
                                  ? "bg-red-50 border border-red-200 group-hover:bg-red-100 group-hover:border-red-300"
                                  : "bg-green-50 border border-green-200 group-hover:bg-green-100 group-hover:border-green-300"
                              }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  isExpense
                                    ? "bg-red-500 group-hover:bg-red-600"
                                    : "bg-green-500 group-hover:bg-green-600"
                                }`}
                              ></div>
                            </div>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-xs text-white font-bold">
                                  N
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p
                                className={`font-semibold text-slate-900 transition-colors duration-300 ${
                                  isExpense
                                    ? "text-red-700 group-hover:text-red-800"
                                    : "text-green-700 group-hover:text-green-800"
                                }`}
                              >
                                {
                                  (isExpense
                                    ? (item as Expense).title ||
                                      getExpenseCategories(t)[
                                        EXPENSE_CATEGORY_KEYS.indexOf(
                                          (item as Expense).category
                                        )
                                      ]
                                    : t("profile.income")) as string
                                }
                              </p>
                              {isExpense && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full transition-all duration-300 group-hover:bg-slate-200 group-hover:text-slate-700">
                                  {
                                    getExpenseCategories(t)[
                                      EXPENSE_CATEGORY_KEYS.indexOf(
                                        (item as Expense).category
                                      )
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-slate-500 font-medium group-hover:text-slate-600 transition-colors duration-300">
                                {format(new Date(item.date), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold transition-all duration-300 ${
                                isExpense
                                  ? "text-red-600 group-hover:text-red-700"
                                  : "text-green-600 group-hover:text-green-700"
                              }`}
                            >
                              {isExpense ? "-" : "+"}$
                              {item.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400 font-medium group-hover:text-slate-500 transition-colors duration-300">
                              {isExpense
                                ? t("profile.expense")
                                : t("profile.income")}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleDeleteTransaction(item, originalIndex)
                            }
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg hover:bg-red-50 hover:shadow-lg border border-transparent hover:border-red-200 transform hover:scale-110"
                            title={t("history.delete")}
                          >
                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600 transition-colors" />
                          </button>
                        </div>
                      </div>

                      {/* Enhanced hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                    </div>
                  );
                })}

              {expenses.length === 0 && incomes.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-2">
                    {t("history.noTransactions")}
                  </h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    {t("history.addFirstTransaction")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full mb-12">
          <ExpenseBarChart expenses={expenses} incomes={incomes} />
        </div>
      </div>
    </div>
  );
}
