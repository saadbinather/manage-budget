"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, DollarSign, Trash2 } from "lucide-react";
import { format } from "date-fns";
import ExpenseChart from "./ExpenseBarChart";
import BudgetChart from "./TopPieChart";
import Image from "next/image";
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

const getCategoryKey = (
  translatedCategory: string,
  t: (key: string) => string
) => {
  const categories = getExpenseCategories(t);
  const index = categories.indexOf(translatedCategory);
  return index >= 0 ? EXPENSE_CATEGORY_KEYS[index] : translatedCategory;
};

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
  if (typeof window === "undefined") {
    console.log(`getSessionData: window undefined for ${key}`);
    return fallback;
  }
  try {
    const data = sessionStorage.getItem(key);
    console.log(`getSessionData: ${key} =`, data);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from sessionStorage:`, error);
    return fallback;
  }
}

function setSessionData<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    console.log(`setSessionData: window undefined for ${key}`);
    return;
  }
  try {
    const jsonValue = JSON.stringify(value);
    console.log(`Saving ${key} to sessionStorage:`, jsonValue);
    sessionStorage.setItem(key, jsonValue);
    console.log(`Successfully saved ${key} to sessionStorage`);
  } catch (error) {
    console.error(`Error saving ${key} to sessionStorage:`, error);
  }
}

export default function Home() {
  const { t } = useLanguage();

  // Dialog states
  const [openExpense, setOpenExpense] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState<Expense>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "food",
    amount: 0,
    title: "",
  });
  const [incomeForm, setIncomeForm] = useState<Income>({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: 0,
  });

  // Data states - initialize as empty arrays to avoid hydration mismatch
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from sessionStorage on mount (client-side only)
  useEffect(() => {
    console.log("Home component mounted, loading data...");
    const savedExpenses = getSessionData<Expense[]>("expenses", []);
    const savedIncomes = getSessionData<Income[]>("incomes", []);
    console.log("Home loading data:", { savedExpenses, savedIncomes });
    console.log("Home expenses length:", savedExpenses.length);
    console.log("Home incomes length:", savedIncomes.length);

    // Always set the data, even if empty, but mark as loaded
    setExpenses(savedExpenses);
    setIncomes(savedIncomes);
    setIsDataLoaded(true);
    console.log("Home data loaded successfully");
  }, []);

  // Only save when explicitly adding/deleting, and only after data is loaded

  // Handlers
  const handleExpenseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIncomeForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpenses = [...expenses, expenseForm];
    setExpenses(newExpenses);
    if (isDataLoaded) {
      setSessionData("expenses", newExpenses); // Save immediately
    }
    setOpenExpense(false);
    setExpenseForm({
      date: format(new Date(), "yyyy-MM-dd"),
      category: "food",
      amount: 0,
      title: "",
    });
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncomes = [...incomes, incomeForm];
    setIncomes(newIncomes);
    if (isDataLoaded) {
      setSessionData("incomes", newIncomes); // Save immediately
    }
    setOpenIncome(false);
    setIncomeForm({
      date: format(new Date(), "yyyy-MM-dd"),
      amount: 0,
    });
  };

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

  // Get current month's expenses and income
  const currentMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonthIncome = incomes
    .filter((income) => {
      const incomeDate = new Date(income.date);
      const currentDate = new Date();
      return (
        incomeDate.getMonth() === currentDate.getMonth() &&
        incomeDate.getFullYear() === currentDate.getFullYear()
      );
    })
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center pt-28 px-6">
      {/* Logo Section */}
      <div className="absolute top-8 left-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="object-contain"
          priority
        />
      </div>

      {/* Header Section */}
      <div className="w-full max-w-5xl mb-12 text-center">
        <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
          {t("home.title")}
        </h1>
        <p className="text-slate-600 text-lg font-light">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-5xl mb-12 flex justify-center">
        <div className="flex gap-6">
          <Button
            variant="outline"
            className="flex items-center gap-3 px-8 py-3 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => setOpenExpense(true)}
          >
            <Plus className="w-5 h-5" />
            {t("home.addExpense")}
          </Button>
          <Button
            className="flex items-center gap-3 px-8 py-3 bg-green-500 text-white hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => setOpenIncome(true)}
          >
            <DollarSign className="w-5 h-5" />
            {t("home.addIncome")}
          </Button>
        </div>
      </div>

      {/* Budget Chart - Top Right */}
      <div className="absolute top-8 right-8">
        <BudgetChart
          currentMonthExpenses={currentMonthExpenses}
          currentMonthIncome={currentMonthIncome}
        />
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-5xl mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-50 rounded-2xl shadow-xl border border-red-200 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-red-900">
              {t("home.totalExpenses")}
            </h3>
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
          </div>
          <p className="text-4xl font-light text-red-600 mb-2">
            ${currentMonthExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-red-500 font-medium">
            {
              expenses.filter((expense) => {
                const expenseDate = new Date(expense.date);
                const currentDate = new Date();
                return (
                  expenseDate.getMonth() === currentDate.getMonth() &&
                  expenseDate.getFullYear() === currentDate.getFullYear()
                );
              }).length
            }{" "}
            {t("home.transactions")}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl shadow-xl border border-green-200 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-green-900">
              {t("home.totalIncome")}
            </h3>
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
          </div>
          <p className="text-4xl font-light text-green-600 mb-2">
            ${currentMonthIncome.toLocaleString()}
          </p>
          <p className="text-sm text-green-500 font-medium">
            {
              incomes.filter((income) => {
                const incomeDate = new Date(income.date);
                const currentDate = new Date();
                return (
                  incomeDate.getMonth() === currentDate.getMonth() &&
                  incomeDate.getFullYear() === currentDate.getFullYear()
                );
              }).length
            }{" "}
            {t("home.transactions")}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full max-w-5xl mb-12">
        <ExpenseChart expenses={expenses} incomes={incomes} />
      </div>

      {/* Budget Limits Section */}
      <div className="w-full max-w-5xl mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <h3 className="text-xl font-medium text-slate-800 mb-6 text-center">
            {t("home.categoryBreakdown")}
          </h3>
          <div className="space-y-4">
            {getExpenseCategories(t).map((category, index) => {
              const categoryKey = EXPENSE_CATEGORY_KEYS[index];
              const categoryExpenses = expenses.filter(
                (expense) => expense.category === categoryKey
              );
              // Filter to current month only for each category
              const currentMonthCategoryExpenses = categoryExpenses.filter(
                (expense) =>
                  new Date(expense.date).getMonth() === new Date().getMonth()
              );
              const spent = currentMonthCategoryExpenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
              );
              const percentage =
                currentMonthExpenses > 0
                  ? (spent / currentMonthExpenses) * 100
                  : 0;
              const barColor = percentage > 0 ? "bg-blue-500" : "bg-slate-200";

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-800 font-medium">
                      {category}
                    </span>
                    <span className="text-sm text-slate-600">
                      ${spent.toLocaleString()} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-3 ${barColor} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  {index < getExpenseCategories(t).length - 1 && (
                    <div className="border-t border-slate-200 mt-4"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 font-medium">
                {t("home.totalMonthlyExpenses")}
              </span>
              <span className="text-lg font-semibold text-slate-800">
                ${currentMonthExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mb-12 flex justify-center">
        <a
          href="/stats"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {t("home.showDetailedAnalysis")}
        </a>
      </div>

      {/* Recent Transactions */}
      <div className="w-full max-w-5xl mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-1">
                {t("home.recentTransactions")}
              </h3>
              <p className="text-slate-500 text-sm">
                {t("home.latestFinancialActivities")}
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
              .slice(0, 5)
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
                          title={t("home.deleteTransaction")}
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
                  {t("home.noTransactionsYet")}
                </h4>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  {t("home.startTrackingFinances")}
                </p>
              </div>
            )}
          </div>

          {[...expenses, ...incomes].length > 5 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <a
                href="/history"
                className="block w-full py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 text-center hover:bg-slate-50 rounded-lg"
              >
                {t("home.viewAllTransactions")}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Expense Dialog */}
      <Dialog open={openExpense} onOpenChange={setOpenExpense}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {t("home.addExpense")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <Label
                htmlFor="expense-title"
                className="text-gray-700 font-medium"
              >
                {t("home.formTitle")}
              </Label>
              <Input
                id="expense-title"
                name="title"
                type="text"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                required
                placeholder={t("home.enterExpenseTitle")}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="expense-date"
                className="text-gray-700 font-medium"
              >
                {t("home.formDate")}
              </Label>
              <Input
                id="expense-date"
                name="date"
                type="date"
                value={expenseForm.date}
                onChange={handleExpenseChange}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="expense-category"
                className="text-gray-700 font-medium"
              >
                {t("home.formCategory")}
              </Label>
              <Select
                value={expenseForm.category}
                onValueChange={(val) =>
                  setExpenseForm((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger
                  id="expense-category"
                  className="w-full mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <SelectValue placeholder={t("home.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {getExpenseCategories(t).map((cat, index) => (
                    <SelectItem key={cat} value={EXPENSE_CATEGORY_KEYS[index]}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="expense-amount"
                className="text-gray-700 font-medium"
              >
                {t("home.formAmount")}
              </Label>
              <Input
                id="expense-amount"
                name="amount"
                type="number"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                required
                min="0"
                step="0.01"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {t("home.addExpense")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Income Dialog */}
      <Dialog open={openIncome} onOpenChange={setOpenIncome}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {t("home.addIncome")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddIncome} className="space-y-4">
            <div>
              <Label
                htmlFor="income-date"
                className="text-gray-700 font-medium"
              >
                {t("home.formDate")}
              </Label>
              <Input
                id="income-date"
                name="date"
                type="date"
                value={incomeForm.date}
                onChange={handleIncomeChange}
                required
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label
                htmlFor="income-amount"
                className="text-gray-700 font-medium"
              >
                {t("home.formAmount")}
              </Label>
              <Input
                id="income-amount"
                name="amount"
                type="number"
                value={incomeForm.amount}
                onChange={handleIncomeChange}
                required
                min="0"
                step="0.01"
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {t("home.addIncome")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
